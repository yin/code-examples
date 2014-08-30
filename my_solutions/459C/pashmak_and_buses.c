#include <stdio.h>

// This is actually an optimized version of solution 7624747 from seneca.
// This does not keep any arrays, just some variables.
//
// The idea is to place each two childs in different busses on least one day.
// As soon as they have been once in different busses, other days may be
// identical. If there is too few days and too few busses, it's not possible.
// 
// First we place each student another bus, this n/k creates repeating strips
// of students. i-th students from each strip have been in the same bus, next
// day we place each strip into different buss to break this, we get n/k^2
// new strips. We need at least log<k>N days to break up all strips.
int main() {
  int i, j, c = 0, x = 1, div = 1, mod = 1;
  int n, k, d;
  scanf("%d %d %d\n", &n, &k, &d);
  while(n > x) {
    if (++c > d || (n > 1 && k == 1)) {
      printf(" -1\n");
      return 0;
    }
    x *= k;
  }
  for(j = 0; j < d;  j++) {
    mod = div;
    div *= k;
    for (i = 0; i < n; i++) {
      printf("%d ", i/mod % k + 1);
    }
    printf("\n");
  }
  return 0;
}
