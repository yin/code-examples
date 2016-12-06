// you can write to stdout for debugging purposes, e.g.
// printf("this is a debug message\n");

int solution(int X, int Y, int D) {
    // write your code in C99 (gcc 4.8.2)
    return (Y-X) / D + !!((Y-X) % D);
}