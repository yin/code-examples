/**
 * Demonstration of libev framework - Event-driven programming.
 * This program is a UNIX Socket IPC client which sends a message to server
 * and prints the response.
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
// struct ev_loop *main_loop;

int main(int argc, char** argv) {
  struct sockaddr_un addr;

  sockfd = socket(AF_UNIX, SOCK_STREAM, 0);
  if (sockfd < 0) {
    perror("Could not create socket()");
    return ERR_SOCKET;
  }

  (void)fcntl(sockfd, F_SETFD, FD_CLOEXEC);

  addr.sun_family = AF_LOCAL;
  strcpy(addr.sun_path, socket_path);
  int len = sizeof(addr.sun_family) + strlen(addr.sun_path);
  if (connect(sockfd, (struct sockaddr*) &addr, len) < 0) {
    perror("Could not bind() socket");
    return ERR_CONNECT;
  }

  while(!feof(stdin)) {
    char msg[256];
    int hdr_len = strlen(IPC_HEADER);
    int size_len = sizeof(uint32_t);
    char *line = &msg[hdr_len + size_len];

    fgets(line, 256 - hdr_len - size_len, stdin);
    //uint32_t size = getline(&line, NULL, stdin);
    uint32_t size = strlen(line);

    int msg_size = size + line - msg;
    memcpy(msg, IPC_HEADER, hdr_len);
    memcpy(msg + hdr_len, &size, size_len);

    int sent_bytes = 0;
    while(sent_bytes < msg_size) {
      fprintf(stderr, "Sending %d bytes: %s (msg:%d)\n", msg_size, msg, (int)size);
      int n = write(sockfd, msg + sent_bytes, msg_size - sent_bytes);
      fprintf(stderr, "sent %d/%d bytes\n", sent_bytes+n, msg_size);
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
    int to_read = size;
    int read_bytes = 0;
    while(read_bytes < to_read) {
      fprintf(stderr, "Receiving (read %d < %d bytes)...\n", read_bytes, to_read);
      int n = read(sockfd, line + read_bytes, to_read - read_bytes);
      fprintf(stderr, "received %d bytes (%d total)...\n", n, read_bytes+n);
      if (n == 0) {
        fprintf(stderr, "Could not receive response, premature end of stream.\n");
        return ERR_RESPONSE;
      }
      if (n == -1) {
        if (errno == EAGAIN) {
          continue;
        }
        perror("Receiving response failed");
        return ERR_RESPONSE;
      }
      read_bytes += n;
    }
    printf("Response: %s\n", line);
  }
  close(sockfd);
  /*
  main_loop = EV_DEFAULT;

  struct ev_io *ipc_io = malloc(sizeof(struct ev_io));
  ev_io_init(ipc_io, ipc_new_client, sockfd, EV_READ);
  ev_io_start(main_loop, ipc_io);

  atexit(cleanup);

  ev_loop(main_loop, 0);
  */
}
