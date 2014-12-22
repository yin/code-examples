#!/bin/bash

gcc -std=gnu99 minimum_in_array.c -lm

# Expected:
# Q(1, 2) = 3
# Q(4, 6) = 2
# Q(8, 8) = 9
# Q(0, 8) = 1
echo -e '1 2\n 4 6\n 8 8\n 0 8' | ./a.out 5 4 3 1 2 3 6 2 9

