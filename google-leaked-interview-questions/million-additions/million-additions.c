#include <stdio.h>
#include <stdlib.h>
#include <memory.h>

// Problem description
// ===================
//
// Given an array of possibly million 64bit numbers (integers in our case) and
// another number N, find a pair in the array, which sums up to N. 

typedef struct {
  int a, b;
} idx2;

long* read_input();
void heap_sort(long *ary, int ary_len);
idx2 find_target_sum(long target, long *ary, int ary_len);

int main(int argc, char **argv) {
  long *input;
  input = read_input();
  if (input != NULL) {
    int ary_len = input[0] - 1;
    long target = input[1];
    long *ary = input + 2;
    printf("Input %d integers\n", ary_len);
    printf("Target sum to find: %ld\n", target);
    heap_sort(ary, ary_len);
    idx2 indexes = find_target_sum(target, ary, ary_len);
    if (indexes.a >= 0) {
      long a = ary[indexes.a], b = ary[indexes.b];
      printf("Found pair of values %ld and  %ld.\n", a, b);
    } else {
      printf("No such pair, which sums up to %d was found.\n", target);
    }
  } else {
    printf("Nothing at input, algorithm not run.\n");
    return 1;
  }
  return 0;
}

#define INITIAL_SIZE 1024

long* read_input() {
  int alloc = INITIAL_SIZE, len = 1;
  long elem, *elems = (long*) malloc(sizeof(long)*alloc);
  while (!feof(stdin)) {
    int symbols_read = fscanf(stdin, "%ld", &elem);
    if (symbols_read < 1)
      continue;
    if (len >= alloc) {
      alloc *= 2;
      elems = (long*) realloc(elems, sizeof(long)*alloc);
      if (elems == NULL) {
        fprintf(stderr, "Not enough memory\n");
        break;
      }
    }
    elems[len++] = elem;
  }
  elems[0] = len - 1;
  return elems;
}

// TODO yin: Implement real Heap Sort algorithm
void heap_sort(long *ary, int ary_len) {
  // Let's cheat for the time being and use std-c qsort()
  int comp(const void *a, const void *b) {
    long diff = (*((long*) a) - *((long*) b));
    return diff > 0 ? 1 : (diff == 0 ? 0 : -1);
  }
  qsort(ary, ary_len, sizeof(long), comp);
}

idx2 find_target_sum(long target, long *ary, int ary_len) {
  idx2 ret = { a: -1, b: -1 };
  for (int a = 0, b = ary_len - 1; a < b; ) {
    long sum = ary[a] + ary[b];
    if (sum == target) {
      ret.a = a;
      ret.b = b;
      break;
    } else if (sum > target) {
      b--;
    } else {
      a++;
    }
  }
  return ret;
}

