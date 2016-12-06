#include <stdio.h>
#include <stdlib.h>
#include <memory.h>
#include <math.h>

// NOTE yin: WARNING! Following code contains cryptic expressions (level: easy)

#ifndef min
#define min(a, b) (a<b?a:b)
#endif

#ifndef log2
#define log2 log2_a
#endif

#define LOG2E 1.44269504088896340736 // = log2(e)

int log2_a(int n);
int log2_b(int n);
int min_fnc(int a, int b);

int main(int argc, char **argv) {
        int n, k, **dp;         // Elements, Dynamic Programming
        int m, qa, qb, qk, qx;  // Queries
        int (*func)(int a, int b) = min_fnc;
        // Loading input
        scanf("%d", &n);
        k = log2(n) + 1;
        // NOTE yin: Some people declare static array of maximum input size.
        dp = (int**) malloc(k*sizeof(int*) + n*k*sizeof(int));
        if (!dp) return 1;
        for (int j = 0; j < k; j++) {
                dp[j] = ((int*) (dp+k))+(j*n);
        }
        for (int i = 0; i < n; i++) {
                scanf("%d", &dp[0][i]);
        }
        // Precomputing dp
        for (int j = 1, p2 = 1; j < k; j++, p2*=2) {
                for (int i = 0; i < n; i++) {
                // NOTE yin: dp[j][i] can be better optimized dp[i][j]
                // TODO yin: test it in this code
                // TODO yin: Maybe optimize away unuseful entries at bottom
                        int r = min(i + p2, n - 1);
                        dp[j][i] = func(dp[j-1][i], dp[j-1][r]);
                        printf("%d  -> %d  %d,%d %d\n", i, dp[j][i], dp[j-1][i], dp[j-1][r], r);
                        if (i == 0)printf("\n");
                }
        }
        // Serving queries
        scanf("%d", &m);
        for (int i = 0; i < m; i++) {
                int read = scanf("%d %d\n", &qa, &qb);
                if (read == 2) {
                        if (qb < qa) {
                                qb ^= qa;
                                qa ^= qb;
                                qb ^= qa;
                        }
                        qk = log2(qb - qa + 1);
                        fprintf(stderr, " %d %d\n", dp[qk][qa], dp[qk][qb]);
                        qx = func(dp[qk][qa], dp[qk][qb]);
                        printf("[%d,%d] => %d\n", qa, qb, qx);
                } else if (read < 0) {
                        break;
                } else {
                        fprintf(stderr, "Query needs 2 parameters, given: %d\n", read);
                }
        }
        return 0;
}

int log2_a(int n) {
        return log(n) * LOG2E;
}

int log2_b(int n) {
        int log2 = 0;
        while (n) {n=n>>1;log2++;}
        return log2 - 1;
}

int min_fnc(int a, int b) {
        return min(a, b);
}
