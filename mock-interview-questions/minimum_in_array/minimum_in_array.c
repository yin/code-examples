// Problem
// =======
//
// 1. Given an array A, create a function, which finds the minimum element in an
// interval Q(a, b) in O(1).
// 
// Note that only the query function has to be O(1), you can do preprocessing of
// the array.
//
// TODO: 2. Do the same, but find the lowest common divisor in interval given by
// Q(a, b)
//
// Solution
// ========
// We preproces the array A of size N, building up an matrix B of size NxlogN,
// B[i][k] will contain the minimum element in interval A[i]..A[i+2^k].
//
// The most efficient way is said to be O(NlogN). The strait-forward way to do
// it is O(N^2), that's what we'll use in our first implementation.
//
// For each query Q(a, b), calculate a number k, where 2^k <= b-a < 2^(k+1).
// Then we can query for minimums in two overlapping intevals B_a=B[a][k] and
// B_b = B[b-k][k], which translate to A[a]..A[a+k] and A[b-k]..A[b]. The
// minimum in A[a]..A[b] is then the lower of B_a and B_b.
// 
// Noticed any problem/sloppyness with the above?
//
// Note
// ====
//
// We need to implement the log2(x) function, which returns an floored integer.
// We'll could use the following equation:
//   log2(x) = log_y(x) / log_y(y)
// 
// But the division stirs up fear in us, so we use the other one:
//   log2(x) = log_y(x) * log2(y)
//
// Putting y=e, because we have log() function in C.
//
// This operation is equivalent to looking up the leftmost set bit of an
// integer, but for sake of clarity, we won't implement this operation that way.

#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <limits.h>

int* preprocess_min(int* A, int N);
int get_min(int *B, int N, int a, int b);
#ifndef __USE_ISOC99
int log2(int N);
#endif

int main(int argc, char** argv) {
  int N = argc - 1;
  int *A = (int*) malloc(sizeof(int) * N);
  int *B;
  int a, b, k = log2(N);
  printf("A = [");
  int i;
  for (i = 1; i < argc; i++) {
    A[i-1] = atoi(argv[i]);
    printf("%d, ", A[i-1]);
  }
  printf("]\n");
  B = preprocess_min(A, N);
  printf("B = [");
  for (i = 0; i < N*k; i++) {
    if (i%N == 0 && i > 0) printf("\n     ");
    printf("%d, ", B[i]);
  }
  printf("]\n");
  while(!feof(stdin)) {
    int c = scanf("%d %d\n", &a, &b);
    if (c == 2) {
      int m = get_min(B, N, a, b);
      printf("Q(%d, %d) = %d\n", a, b, m);
    } else {
      fprintf(stderr, "Wrong query, it should b 2 integers per line\n");
    }
  }
  free(A);
  free(B);
  return 0;
}

int* preprocess_min(int* A, int N) {
  int logN = log2(N);
  int *B = (int*)malloc(sizeof(int)*N*(logN+1));
  for (int k = 0; k <= logN; k++) {
    int exp2k = 1 << k;
    for (int i = 0; i < N; i++) {
      // TODO yin: There's another way to be figured out, which takes O(NlogN)
      int m = INT_MAX;
      for (int j = 0; j < exp2k && i+j < N; j++) {
        if (m > A[i+j]) m = A[i+j];
      }
      B[i+k*N] = m;
    }
  }
  return B;
}

int get_min(int *B, int N, int a, int b) {
  int d = b - a + 1;
  if (d < 0) return INT_MAX;
  int k = log2(d);
  return B[a+k*N] < B[b-k+k*N] ? B[a+k*N] : B[b-k+k*N];
}

#ifndef __USE_ISOC99
#define LOG2E 1.44269504088896340736 // log2(e)

int log2(int N) {
  return (int) (log(N) * LOG2E);
}
#endif
