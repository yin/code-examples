#include <stdio.h>
#include <stdlib.h>
#include <memory.h>

#define DEBUG 0
#if DEBUG == 1
#define debug(...) printf(__VA_ARGS__)
#else
#define debug(...)
#endif

// A Heap is a data structure physicaly based on an array, but represents
// a binary tree, where // each child is smaller (or bigger) than it's
// parent - this is the Heap invariant.
// The zero element in the array is the root. You can figure out the child
// indexes a & b from parents index i by the following way:
//   a = i*2 + 1
//   b = i*2 + 2
//
// Heap supports operations: Extract maximum, Insertion, Deletion. Insertion
// of array elements into a heap takes O(NlogN) and is not the most efficient
// way of building a Heap.
// The efficient way of building a heap in O(N) is implemented by the heapify()
// operation.

void heap_sort(long *ary, int ary_len);
void heapify(long *ary, int ary_len);
void heap_sift_down(long *ary, int ary_len, int index);
int is_lt(long a, long b);
int is_gt(long a, long b);
void swap(long *ary, int i, int j);

void heap_sort(long *ary, int ary_len) {
  int heap_size = ary_len;
  heapify(ary, heap_size);
  while (heap_size > 0) {
    debug("heap_sort().while heap_size:%d\n", heap_size);
    swap(ary, 0, --heap_size);
    heap_sift_down(ary, heap_size, 0);
  }
}

// heapify() pushes down, say sift down, each of the array elements, until all
// elements satisfy the Heap invariant.
// Time O(N) and additional memory O(1).
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
