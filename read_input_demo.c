#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "read_input.h"

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
