#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <memory.h>

char* read_input();
void reverse_words_inplace(char *input);
void reverse_string_inplace(char *input, size_t len);

int main(int argc, char** argv) {
  char *str = read_input();
  printf("Reverse words inplace\n");
  printf("input:  '%s'\n", str);
  reverse_words_inplace(str);
  printf("output: '%s'\n", str);
  free(str);
  return 0;
}

void reverse_words_inplace(char *s) {
  int len = strlen(s);
  reverse_string_inplace(s, len);
  printf("%s\n", s);
  for(int a = 0, b = 0; b <= len; b++) {
    if (b == len || s[b] == ' ') {
      reverse_string_inplace(s+a, b-a);
      a = ++b;
    }
  }
}

void reverse_string_inplace(char* s, size_t len) {
  for (int a = 0, b = len-1; a < len / 2; a++, b--) {
    s[a] ^= s[b];
    s[b] ^= s[a];
    s[a] ^= s[b];
  }
}

#define SIZE 256

// This reads a line of maximum length given by SIZE and replaces new line with
// a zero.
// Returns NULL if stdin is already closed
char* read_input() {
  char *result = (char*) malloc(sizeof(char) * SIZE);
  result = fgets(result, SIZE, stdin);
  if (result != NULL) {
    size_t len = strlen(result);
    if (len > 0)
      result[len - 1] = '\0';
  }
  return result;
}
