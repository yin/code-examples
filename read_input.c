#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <memory.h>
#include "read_input.h"

#define SIZE 256

// TODO yin: Add flow control function as optional 3rd argument
void read_all_input_lines(void (*callback)(char*, void*), void *payload) {
  while (!feof(stdin)) {
    callback(read_input_line(), payload);
  }
}

// TODO yin: Make possible to read continously to a single character buffer
char* read_input_line() {
  char *result = NULL, *buf;
  size_t alloc = 0;
  size_t len = 0;
  while (!feof(stdin)) {
    size_t read;
    printf("-- %d\n", feof(stdin));
    result = ensure_capacity(result, len, &alloc);
    buf = result + len;
    if(!fgets(buf, SIZE, stdin)) {
      break;
    }
    for (int i = 0; i < SIZE; i++) {
      if (buf[i] == 0) {
        read = i;
        break;
      } else if (buf[i] == '\n') {
        buf[i] = 0;
        return result;
      }
    }
    char c = buf[0];
    printf("just read %d characters. '%c' %d\n", (int) read, c, (int) c);
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
