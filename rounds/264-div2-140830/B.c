#include <stdio.h>
#include <limits.h>

int main() {
  long long n, h;
  long long i, max = -1;
  scanf("%lld\n", &n);
  for (i = 0; i < n; i++) {
    scanf("%lld\n", &h);
    if (max < h)
      max = h;
  }
  printf("%lld\n", max);
  return 0;
}
