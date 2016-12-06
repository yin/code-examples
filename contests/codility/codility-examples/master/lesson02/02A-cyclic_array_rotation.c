// you can write to stdout for debugging purposes, e.g.
// printf("this is a debug message\n");

void reverse(int A[], int N) {
    for (int a = 0; a < N/2; a++) {
        A[a] ^= A[N-a-1];
        A[N-a-1] ^= A[a];
        A[a] ^= A[N-a-1];
        // int a = A[i], b = A[N-i-1];
        // A[N-i-1] = a;
        // A[i] = b;
    }
}

struct Results solution(int A[], int N, int K) {
    struct Results result;
    // write your code in C99 (gcc 4.8.2)
    reverse(A, N);
    reverse(A, K);
    reverse(A+K, N-K);
    result.A = A;
    result.N = N;
    return result;
}