// you can write to stdout for debugging purposes, e.g.
// printf("this is a debug message\n");

int solution(int A[], int N) {
    // write your code in C99 (gcc 4.8.2)
    int x = 0;
    for (int i = 0; i < N; i++) x ^= A[i];
    return x;
}