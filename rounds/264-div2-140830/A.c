#include <stdio.h>
#include <limits.h>

int main() {
  long long n, s, a, b;
  long long i, j, max = -1;
  scanf("%lld %lld\n", &n, &s);
  s *= 100;
  for (i = 0; i < n; i++) {
    scanf("%lld %lld\n", &a, &b);
    a = a*100 + b;
    if (s >= a) {
      for (j = a; j <= s; j+=a) {
        int ch = (100 - j % 100) % 100;
        if (ch > max) {
          max = ch;
        }
      }
    }
  }
  printf("%lld\n", max);
  return 0;
}
