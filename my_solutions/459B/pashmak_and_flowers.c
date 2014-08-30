#include <stdio.h>
#include <math.h>
#include <limits.h>

int main() {
  long long i, n, a;
  long long min = INT_MAX, min_c = 0, max = INT_MIN, max_c = 0;
  scanf("%lld\n", &n);
  for (i = 0; i < n; i++) {
    int _ = scanf("%lld", &a);
    if (min > a || max < a) {
      if (min > a) {
        min = a;
        min_c = 1;
      }
      if (max < a) {
        max = a;
        max_c = 1;
      }
    } else {
      if (min == a) {
        min_c++;
      }
      if (max == a) {
        max_c++;
      }
    }
  }
  if (min == max) {
    printf("%lld %lld\n", max - min, min_c * (min_c-1) / 2);
  } else {
    printf("%lld %lld\n", max - min, min_c*max_c);
  }
  return 0;
}
