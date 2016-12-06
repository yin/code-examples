// you can write to stdout for debugging purposes, e.g.
// printf("this is a debug message\n");

int solution(int A[], int N) {
    // write your code in C99 (gcc 4.8.2)
    long sum = 0, accl, accr, min = -1; 
    for (int i = 0; i < N; sum += A[i++]);
    accr = sum;
    accl = 0;
    for(int i = 0; i < N - 1; i++) {
        accr -= A[N-i-1];
        accl += A[N-i-1];
        long d = accr - accl;
        if (d < 0) d = -d;
        if(min < 0 || min > d) min = d;
    }
    return (int)min;
}