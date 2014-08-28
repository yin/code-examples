#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <memory.h>

#define SIZE 256

void on_line_read(char *line, void *payload);
void read_all_input_lines(void (*callback)(char*, void*), void *payload);
char* read_input_line();
char* read_input();
char* ensure_capacity(char *buffer, size_t len, size_t *alloc);

int main(int argc, char** argv) {
  printf("Read line of any size\n");
  char *input = read_input_line();
  printf("first line: '%s' %d\n", input, (int)strlen(input));
  read_all_input_lines(on_line_read, NULL);  
  free(input);
  return 0;
}

void on_line_read(char *line, void *payload) {
  printf("line: '%s' %d\n", line, (int)strlen(line));
  free(line);
}

// TODO yin: Add flow control function as optional 3rd argument
void read_all_input_lines(void (*callback)(char*, void*), void *payload) {
  while (!feof(stdin)) {
  }
}

char* read_input_line() {
  char *result = NULL, *buf;
  size_t alloc = 0;
  size_t len = 0;
  while (!feof(stdin)) {
    buf = result + len;
    result = ensure_capacity(result, len, &alloc);
    size_t read = 1;
    if(gets(buf)) {
      char c = buf[0];
      printf("just read %d characters. '%c' %d\n", (int) read, c, (int) c);
    } else {
      fprintf(stderr, "Error reading stdin\n");
      return result;
    }
    for (int i = 0; i < read; i++) {
      if (buf[i] == 0) {
        read = i;
        break;
      } else if (buf[i] == '\n') {
        buf[i] = 0;
        return result;
      }
    }
    len += read;
  }
  if (len == alloc) {
    result = (char*) realloc(result, alloc + 1);
  }
  result[len] = 0;
  return result;
}

char* ensure_capacity(char *buffer, size_t len, size_t *alloc) {
    if (buffer == NULL) {
      buffer = (char*) malloc(sizeof(char) * SIZE);
    } else if (*alloc - len < SIZE) {
      buffer = (char*) realloc(buffer, *alloc + SIZE);
      *alloc += SIZE;
    }
    if (buffer == NULL) {
      fprintf(stderr, "Not enough memory");
      return NULL;
    }
    return buffer;
}
