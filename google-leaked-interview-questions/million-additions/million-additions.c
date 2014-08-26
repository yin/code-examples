#include <stdio.h>
#include <stdlib.h>
#include <memory.h>

#define DEBUG 0
#if DEBUG == 1
#define debug(...) printf(__VA_ARGS__)
#else
#define debug(...)
#endif

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
void heapify(long *ary, int ary_len);
void heap_sift_down(long *ary, int ary_len, int index);
int is_lt(long a, long b);
int is_gt(long a, long b);
void swap(long *ary, int i, int j);

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
      printf("No such pair, which sums up to %ld was found.\n", target);
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

// Heap Sort works in two steps, first it builds a Heap. A Heap is a data
// structure physicaly based on an array, but represents a binary tree, where
// each child is smaller (or bigger) than it's parent - this is the Heap
// invariant.
// The zero element in the array is the root. You can figure out the child
// indexes a & b from parents index i by the following way:
//   a = i*2 + 1
//   b = i*2 + 2
// The efficient way of building a heap in O(N) is implemented by the heapify()
// operation. It tries to push down, say sift down, each of the array elements,
// until all elements satisfy the Heap invariant.
//
// In the second step, Heap Sort just swap the first (maximum) element with the
// last element in the array to get the maximum element into sorted position.
// Next decreases the heap length to keep the sorted tail from moving and sifts
// down the element in the first position, to keep the Heap invariant. This is
// repeated until all elements are placed into sorted position from back to the
// from of the array.
//
// Time O(NlogN) and additional memory O(1) - that's better than Quick Sort.
void heap_sort(long *ary, int ary_len) {
  int heap_size = ary_len;
  heapify(ary, heap_size);
  while (heap_size > 0) {
    debug("heap_sort().while heap_size:%d\n", heap_size);
    swap(ary, 0, --heap_size);
    heap_sift_down(ary, heap_size, 0);
  }
}

idx2 find_target_sum(long target, long *ary, int ary_len) {
  idx2 ret = { .a = -1, .b = -1 };
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

void heapify(long *ary, int ary_len) {
  // TODO: Skip the lower level, we can not sift down those guys
  for (int i = ary_len - 1; i >= 0; i--) {
    debug("heapify().for\n");
    heap_sift_down(ary, ary_len, i);
  }
}

void heap_sift_down(long *ary, int heap_len, int index) {
  int i = index;
  while (i < heap_len) {
    int a = i*2 + 1, b = i*2 + 2;
    debug("heap_sift_down().while i:%d a:%d b:%d\n", i, a, b);
    // NOTE: I use is_lt() instead of proper cmp() function - it does the job
    if (a < heap_len && is_lt(ary[i], ary[a])) {
      if (b < heap_len && is_lt(ary[a], ary[b])) {
        swap(ary, i, b);
        i = b;
      } else {
        swap(ary, i, a);
        i = a;
      }
    } else if (b < heap_len && is_lt(ary[i], ary[b])) {
      swap(ary, i, b);
      i = b;
    } else {
      // No more childs exist, or they satisfy the heap invariant
      break;
    }
  }
}

inline int is_lt(long a, long b) {
  return a < b;
}

inline int is_gt(long a, long b) {
  return a > b;
}

void swap(long *ary, int i, int j) {
  debug("swap(%d, %d)\n", i, j);
  long tmp = ary[i];
  ary[i] = ary[j];
  ary[j] = tmp;
}

// This returns the maximum/root and moves children up to keep the Heap
// invariant. not really needed here... Hoops! 
// TODO yin: Move to dedicated Heap source
long heap_extract_max(long *ary, int heap_len) {
  int ret;
  if (heap_len > 0) {
    ret = ary[0];
    int i = 0;
    while (i < heap_len) {
      int a = i*2 + 1, b = i*2 + 2;
      // NOTE: I use is_gt() instead of proper cmp() function - it does the job
      if (a < heap_len && is_gt(ary[a], ary[b])) {
        swap(ary, i, a);
        i = a;
      } else if (b < heap_len && (i == 0 || is_gt(ary[i], ary[b]))) {
        swap(ary, i, b);
        i = b;
      } else {
        // No more childs exist, or they satisfy the heap invariant
        break;
      }
    }
  } // NOTE: What to do in an empty heap??? Go crazy?
  return ret;
}
