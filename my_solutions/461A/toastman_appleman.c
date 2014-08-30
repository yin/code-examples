#include <stdio.h>
#include <stdlib.h>
#include <limits.h>

long long max_score_appleman_toastman(int n, long *A);

int main(int argc, char **argv) {
  int n, i;
  long *A;
  scanf("%d", &n);
  A = (long*) malloc(sizeof(long)*n);
  for (i = 0; i < n; i++) {
    scanf("%ld", A + i);
  }
  long long result = max_score_appleman_toastman(n, A);
  printf("%lld\n", result);
  return 0;
}

long long max_score_appleman_toastman(int n, long *A) {
  int cmp(const void *a, const void *b) {
    return *((long*)a) - *((long*)b);
  }
  qsort(A, n, sizeof(long), cmp);
  long long sum = 0, acc = -A[n-1];
  int i;
  for (i = n-1; i >= 0; i--) {
    sum += A[i];
    acc += sum;
  }
  return acc + sum;
}
