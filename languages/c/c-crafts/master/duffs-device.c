#include <stdio.h>

// Duff's device is a technique of loop-unwinding, which leverages a little
// known syntactical feature of C language. It's an interesting syntactical
// construct, so I present it here. It tough, does not beat the GCC
// optimizations at level -O1.
//
// https://en.wikipedia.org/wiki/Duff's_device
//
// Test gcc -O0 --std=gnu99:
//   $ time ./a.out b
//   1000000000
//
//   real	0m2.445s
//   user	0m2.432s
//   sys	0m0.004s
//
//   $ time ./a.out a
//   1000000000
//
//   real	0m2.125s
//   user	0m2.120s
//   sys	0m0.004s
//
// Test gcc -O1 --std=gnu99:
//   $ time ./a.out b
//   1000000000
//
//   real	0m0.002s
//   user	0m0.000s
//   sys	0m0.000s
//
//   $ time ./a.out a
//   1000000000
//
//   real	0m0.412s
//   user	0m0.408s
//   sys	0m0.004s


#define N 1e9L

void classic_loop(int n);
void duffs_loop(int n);

int main(int argc, char **argv) {
  if (argc < 2 || argv[1][0] != 'a' && argv[1][0] != 'b') {
    fprintf(stderr, "  %s <a|b>\n", argv[0]);
    printf("%d, %d, %d", argc < 2, argv[1][0] != 'a', argv[1][0] != 'b');
    return 1;
  }
  int n = (int) N;
  printf("%d\n", n);
  if (argv[1][0] == 'a') {
    classic_loop(n);
  } else {
    duffs_loop(n);
  }
  return 0;
}

void classic_loop(int n) {
  int i = 0;
  while(i < n) {
    i++;
  }
}

void duffs_loop(int n) {
  int i = 0;
  switch(n%8) {
  case 7: while(i < n) {
      i++;
    case 6:
      i++;
    case 5:
      i++;
    case 4:
      i++;
    case 3:
      i++;
    case 2:
      i++;
    case 1:
      i++;
    case 0:
      i++;
    }
  }
}
