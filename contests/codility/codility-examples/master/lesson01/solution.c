// you can write to stdout for debugging purposes, e.g.
// printf("this is a debug message\n");

int solution(int N) {
    int max = 0, m = 0, f = 0;
    while (N > 0) {
        if (N%2) {
            f = 1;
            m = 0;
        } else {
            m++;
            if (f && m > max)
                max = m;
        }
         N>>=1;
    }
    return max;
}
