#include <stdio.h>
#include <limits.h>

int main() {
  long long n, h, l[4001], r[4001];
  long long i, j;
  scanf("%lld\n", &n);
  for (i = 0; i < n; i++) {
    for (j = 0; j < n; j++) {
      scanf("%lld\n", &h);
      int li = n + i - j;
      int ri = i + j;
      l[li] += h;
      r[ri] += h;
    }
  }
  long long max1 = 0, max2=0, max1_i=0, max1_j = 0, max2_i = 0, max2_j = 0;
  for (i = 0; i < 2*n-1; i++) {
    for (j = 0; j < 2*n-1; j++) {
      long long s = l[i] + r[j];
      if (max1 < s && (i-j)%2 == 0) {
        max1 = s;
        max1_i = i;
        max1_j = j;
      }
      if (max2 < s && (i-j)%2 == 1) {
        max2 = s;
        max2_i = i;
        max2_j = j;
      }
    }
  }
  long long x1 = (n + max1_j - max1_i) / 2;
  long long y1 = max1_j - x1;
  long long x2 = (n + max2_j - max2_i) / 2;
  long long y2 = max2_j - x2;
  printf("%lld\n", max1+max2);
  printf("%lld %lld %lld %lld\n", y1+1, x1+1, y2+1, x2+1); // rows are x1, x2
  return 0;
}
