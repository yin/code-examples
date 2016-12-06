/**
 * Demonstration of libev framework - Event-driven programming.
 * This program is a UNIX Socket IPC server which uses simple protocol reverses
 * each message and send it back as response to the client.
 *
 * The protocol, requests:
 * IPC_EADER(string) | 32bit msg_len | msg
 * 
 * Responses are just raw bytes from msg in reversed order, for the moment.
 */

#include <string.h>
#include <stdlib.h>
#include <stdio.h>
#include <stdint.h>
#include <signal.h>
#include <unistd.h>
#include <sys/queue.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <sys/un.h>
#include <fcntl.h>
#include <errno.h>
#include <ev.h>

#define IPC_HEADER "ipc"

#define ERR_SOCKET 1
#define ERR_FCNTL   2
#define ERR_BIND    3
#define ERR_LISTEN  4
#define ERR_ACCEPT  5

typedef struct ipc_client {
  int fd;
  TAILQ_ENTRY(ipc_client) next;
} ipc_client;

char* socket_path = "./reverse.sock";
int sockfd;
TAILQ_HEAD(ipc_clients_head, ipc_client) ipc_clients = TAILQ_HEAD_INITIALIZER(ipc_clients);
struct ev_loop *main_loop;

static void cleanup();
static void handle_signal(int sig, siginfo_t *info, void *data);

void ipc_new_client(EV_P_ struct ev_io *w, int revents);
void close_client(int fd);
void ipc_receive_message(EV_P_ struct ev_io *w, int revents);
void handle_message(int fd, int len, char* msg);
void ipc_send_message(int fd, int len, char* msg);

int main(int argc, char** argv) {
  struct sockaddr_un local;

  sockfd = socket(AF_UNIX, SOCK_STREAM, 0);
  if (sockfd < 0) {
    perror("Could not create socket()");
    return ERR_SOCKET;
  }

  (void)fcntl(sockfd, F_SETFD, FD_CLOEXEC);

  local.sun_family = AF_LOCAL;
  strcpy(local.sun_path, socket_path);
  unlink(local.sun_path);
  int len = sizeof(local.sun_family) + strlen(local.sun_path);
  if (bind(sockfd, (struct sockaddr*) &local, len) < 0) {
    perror("Could not bind() socket");
    return ERR_BIND;
  }

  int flags = fcntl(sockfd, F_GETFL, 0);
  flags |= (O_NONBLOCK);
  if (fcntl(sockfd, F_SETFL, flags) < 0) {
    perror("Could not set O_NONBLOCK and O_CLOEXEC");
    return ERR_FCNTL;
  }

  if (listen(sockfd, 5) < 0) {
    perror("Could not listen() socket");
    return ERR_LISTEN;
  }

  main_loop = EV_DEFAULT;

  struct ev_io *ipc_io = malloc(sizeof(struct ev_io));
  ev_io_init(ipc_io, ipc_new_client, sockfd, EV_READ);
  ev_io_start(main_loop, ipc_io);

  struct sigaction action;

  action.sa_sigaction = handle_signal;
  action.sa_flags = SA_NODEFER | SA_RESETHAND | SA_SIGINFO;
  sigemptyset(&action.sa_mask);

  /* Catch all signals with default action "Core", see signal(7) */
  if (sigaction(SIGQUIT, &action, NULL) == -1 ||
      sigaction(SIGILL, &action, NULL) == -1 ||
      sigaction(SIGABRT, &action, NULL) == -1 ||
      sigaction(SIGFPE, &action, NULL) == -1 ||
      sigaction(SIGSEGV, &action, NULL) == -1) {
    fprintf(stderr, "Could not setup signal handler");
  }

  /* Catch all signals with default action "Term", see signal(7) */
  if (sigaction(SIGHUP, &action, NULL) == -1 ||
      sigaction(SIGINT, &action, NULL) == -1 ||
      sigaction(SIGALRM, &action, NULL) == -1 ||
      sigaction(SIGUSR1, &action, NULL) == -1 ||
      sigaction(SIGUSR2, &action, NULL) == -1) {
    fprintf(stderr, "Could not setup signal handler");
  }

  /* Ignore SIGPIPE to survive errors when an IPC client disconnects
   * while we are sending him a message */
  signal(SIGPIPE, SIG_IGN);

  atexit(cleanup);

  ev_loop(main_loop, 0);
}

static void cleanup() {
#if EV_VERSION_MAJOR >= 4
  ev_loop_destroy(main_loop);
#endif
}

static void handle_signal(int sig, siginfo_t *info, void *data) {
  raise(sig);
}

void ipc_new_client(EV_P_ struct ev_io *w, int revents) {
  struct sockaddr_un peer;
  socklen_t len = sizeof(struct sockaddr_un);
  int clientfd = accept(w->fd, (struct sockaddr*) &peer, &len);

  if (clientfd < 0) {
    if (errno == EINTR) {
      perror("Could not accept(), because of interruption signal");
      return;
    }
    perror("Could not accept() socket connection");
    exit(ERR_ACCEPT);
  }

  (void)fcntl(sockfd, F_SETFD, FD_CLOEXEC);

  int flags = fcntl(sockfd, F_GETFL, 0);
  flags |= (O_NONBLOCK);
  if (fcntl(sockfd, F_SETFL, flags) < 0) {
    perror("Could not set O_NONBLOCK and O_CLOEXEC");
    exit(ERR_FCNTL);
  }

  struct ev_io *package = malloc(sizeof(struct ev_io));
  ev_io_init(package, ipc_receive_message, clientfd, EV_READ);
  ev_io_start(EV_A_ package);
  printf("new-client(fd:%d)\n", clientfd);

  ipc_client *client = malloc(sizeof(ipc_client));
  client->fd = clientfd;
  TAILQ_INSERT_TAIL(&ipc_clients, client, next);
}

void close_client(int fd) {
  ipc_client *current;
  TAILQ_FOREACH(current, &ipc_clients, next) {
    if (current->fd == fd) {
      TAILQ_REMOVE(&ipc_clients, current, next);
    }
  }
  // TODO(yin): check if we ever had client with this fd
  close(fd);
}

void ipc_receive_message(EV_P_ struct ev_io *w, int revents) {
  int head_len = strlen(IPC_HEADER);
  int to_read = head_len + sizeof(uint32_t);
  int read_bytes = 0;
  char* msg = malloc(to_read);
  
  while (read_bytes < to_read) {
    fprintf(stderr, "Receiving header (%d bytes)...\n", to_read-read_bytes);
    int n = read(w->fd, msg + read_bytes, to_read - read_bytes);
    fprintf(stderr, "received %d bytes (%d total)\n", n, read_bytes+n);
    if (n == -1) {
      perror("Could not receive message from client");
      close_client(w->fd);
      return;
    }
    if (n == 0) {
      fprintf(stderr, "Received premature end of message.\n");
      close_client(w->fd);
      return;
    }
    read_bytes += n;
  }
  if (memcmp(msg, IPC_HEADER, head_len) != 0) {
    fprintf(stderr, "IPC message has wrong HEADER.\n");
    write (1, msg, read_bytes);
    printf("\n");
  }
  to_read = *((uint32_t*)(msg + head_len));
  read_bytes = 0;
  free(msg);
  msg = malloc(to_read);
  fprintf(stderr, "Receiving message...\n");
  while (read_bytes < to_read) {
    int n = read(w->fd, msg + read_bytes, to_read - read_bytes);
    fprintf(stderr, "received %d bytes\n", n);
    if (n == -1) {
      if (errno == EINTR || errno == EAGAIN) {
        continue;
      }
      perror("Could not receive message from client.");
      close_client(w->fd);
      return;
    }
    if (n == 0) {
      fprintf(stderr, "Received premature end of message.\n");
      close_client(w->fd);
      return;
    }
    read_bytes += n;
  }
  
  handle_message(w->fd, to_read, msg);
}

void handle_message(int fd, int len, char* msg) {
  printf("Request (len:%d): ", len);
  write(1, msg, len);
  printf("\n");
  for(int i = 0; i < len / 2; i++) {
    int j = len - i - 1;
    msg[j] ^= msg[i];
    msg[i] ^= msg[j];
    msg[j] ^= msg[i];
  }
  printf("Response (len:%d): ", len);
  write(1, msg, len);
  printf("\n");
  ipc_send_message(fd, len, msg);
}

void ipc_send_message(int fd, int len, char* msg) {
  int msg_size = len;
  int sent_bytes = 0;
  // TODO(yin): Add IPC_HEADER also to the response
  while (sent_bytes < msg_size) {
    fprintf(stderr, "Sending %d bytes: %s\n", msg_size, msg);
    int n = write(fd, msg + sent_bytes, msg_size - sent_bytes);
    fprintf(stderr, "sent %d/%d bytes\n", sent_bytes+n, msg_size);
    if (n == -1) {
      if (errno == EAGAIN) {
	continue;
      }
      fprintf(stderr, "Could not send response to client.\n");
    }
    sent_bytes += n;
  }
}
