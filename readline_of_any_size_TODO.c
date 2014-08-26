#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <memory.h>

#define SIZE 256

char* read_input();

int main(int argc, char** argv) {
  char *input = read_input();
  printf("Read line of any size\n");
  printf("input: '%s'\n", input);
  free(input);
  return 0;
}

// This is supposed to read a line any length, terminated by zero.
// Returns NULL if stdin is closed, or not enough memory
// TODO(yin): This reads 0 bytes
char* read_input() {
  char *result = NULL, *buf;
  size_t alloc = SIZE;
  size_t len = 0;
  printf("feof(stdin) is %d\n", feof(stdin));
  while (!feof(stdin)) {
    if (result == NULL) {
      result = (char*) malloc(sizeof(char) * SIZE);
      buf = result;
    } else if (alloc - len < SIZE) {
      result = (char*) realloc(result, alloc + SIZE);
      alloc += SIZE;
      buf = result + len;
    }
    if (result == NULL) {
      fprintf(stderr, "Not enough memory");
      return NULL;
    }

    size_t read = fread(buf, SIZE, sizeof(char), stdin);
    printf("just read %d characters.\n", (int) read);
    len += read;
    for (int i = 0; i < read; i++) {
      if (buf[i] == '\n' || buf[i] == 0) {
        buf[i] = '\0';
        return result;
      }
    }
    printf("feof(stdin) is %d\n", feof(stdin));
    
  }
  if (len == alloc) {
    result = (char*) realloc(result, alloc + 1);
  }
  result[len] = '\0';
  return result;
}
