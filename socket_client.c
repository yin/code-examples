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
#include <sys/types.h>
#include <sys/socket.h>
#include <sys/un.h>
#include <fcntl.h>
#include <errno.h>
#include <ev.h>

#define IPC_HEADER "ipc"

#define ERR_SOCKET   1
#define ERR_CONNECT  2
#define ERR_REQUEST  3
#define ERR_RESPONSE 4

char* socket_path = "./reverse.sock";
int sockfd;
//struct ev_loop *main_loop;

int main(int argc, char** argv) {
  struct sockaddr_un addr;

  sockfd = socket(AF_UNIX, SOCK_STREAM, 0);
  if (sockfd < 0) {
    perror("Could not create socket()");
    return ERR_SOCKET;
  }

  //(void)fcntl(sockfd, F_SETFD, FD_CLOEXEC);

  addr.sun_family = AF_LOCAL;
  strcpy(addr.sun_path, socket_path);
  int len = sizeof(addr.sun_family) + strlen(addr.sun_path);
  if (connect(sockfd, (struct sockaddr*) &addr, len) < 0) {
    perror("Could not bind() socket");
    return ERR_CONNECT;
  }

  while(!feof(stdin)) {
    char *line = NULL;
    int msg_size = getline(&line, NULL, stdin);
    int sent_bytes = 0;
    fprintf(stderr, "sending %d bytes: %s", msg_size, line);
    while(sent_bytes < msg_size) {
      int n = write(sockfd, line + sent_bytes, msg_size - sent_bytes);
      fprintf(stderr, "sent %d/%d bytes", sent_bytes+n, msg_size);
      if (n == 0) {
        fprintf(stderr, "Could not send message, because socket seems closed.\n");
        return ERR_REQUEST;
      }
      if (n == -1) {
        if (errno == EAGAIN) {
          continue;
        }
        perror("Sending message failed");
        return ERR_REQUEST;
      }
      sent_bytes += n;
    }
    int to_read = msg_size;
    int read_bytes = 0;
    while(read_bytes < to_read) {
      int n = read(sockfd, line, to_read);
      if (n == 0) {
        fprintf(stderr, "Could not receive response, premature end of stream.\n");
        return ERR_RESPONSE;
      }
      if (n == -1) {
        if (errno == EAGAIN) {
          continue;
        }
        perror("Receiving response failed");

      }
      sent_bytes += n;
    }
    printf("Response: %s\n", line);
  }
    

  /*
  int flags = fcntl(sockfd, F_GETFL, 0);
  flags |= (O_NONBLOCK);
  if (fcntl(sockfd, F_SETFL, flags) < 0) {
    fprintf(stderr, "Could not set O_NONBLOCK and O_CLOEXEC\n");
    return ERR_FNCTL;
  }
  */

  /*
  main_loop = EV_DEFAULT;

  struct ev_io *ipc_io = malloc(sizeof(struct ev_io));
  ev_io_init(ipc_io, ipc_new_client, sockfd, EV_READ);
  ev_io_start(main_loop, ipc_io);

  struct sigaction action;

  action.sa_sigaction = handle_signal;
  action.sa_flags = SA_NODEFER | SA_RESETHAND | SA_SIGINFO;
  sigemptyset(&action.sa_mask);

  if (sigaction(SIGQUIT, &action, NULL) == -1 ||
      sigaction(SIGILL, &action, NULL) == -1 ||
      sigaction(SIGABRT, &action, NULL) == -1 ||
      sigaction(SIGFPE, &action, NULL) == -1 ||
      sigaction(SIGSEGV, &action, NULL) == -1) {
    fprintf(stderr, "Could not setup signal handler");
  }

  if (sigaction(SIGHUP, &action, NULL) == -1 ||
      sigaction(SIGINT, &action, NULL) == -1 ||
      sigaction(SIGALRM, &action, NULL) == -1 ||
      sigaction(SIGUSR1, &action, NULL) == -1 ||
      sigaction(SIGUSR2, &action, NULL) == -1) {
    fprintf(stderr, "Could not setup signal handler");
  }

  signal(SIGPIPE, SIG_IGN);

  atexit(cleanup);

  ev_loop(main_loop, 0);
  */
}
