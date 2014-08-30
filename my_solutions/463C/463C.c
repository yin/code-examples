#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <limits.h>

long long f[4001111];

int main() {
  long long l[4001], r[4001];
  int n, x, y, h;
  int q = 10;
  scanf("%d\n", &n);
  for (h = 0; h < 2*n+1; h++) r[h] = l[h] = 0;
  for (y = 0; y < n; y++) {
    for (x = 0; x < n; x++) {
      h = y*n+x;
      scanf("%lld\n", &f[h]);
      int li = n + y - x;
      int ri = y + x;
      l[li] += f[h];
      r[ri] += f[h];
    }
  }
  long long max1 = -1, max2 = -1;
  int max1_x = 0, max1_y = 0, max2_x = 0, max2_y = 0;
  for (y = 0; y < n; y++) {
    for (x = 0; x < n; x++) {
      h = y*n+x;
      int li = n + y - x;
      int ri = y + x;
      long long s = l[li] + r[ri] - f[h];
      if (max1 < s && (y-x)%2 == 0) {
        max1 = s;
        max1_x = x;
        max1_y = y;
      }
      if (max2 < s && abs(y-x)%2 == 1) {
        max2 = s;
        max2_x = x;
        max2_y = y;
      }
    }
  }
  printf("%lld\n", max1+max2);
  printf("%d %d %d %d\n", max1_y+1, max1_x+1, max2_y+1, max2_x+1); // rows are x1, x2
  return 0;
}
