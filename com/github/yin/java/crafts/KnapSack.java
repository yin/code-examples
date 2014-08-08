package com.github.yin.java.crafts;

import static java.lang.Math.max;

/**
 * In the KnapSack problem you have a knapsack of some given capacity M and
 * an number N of items you can choose to place in it. Each item has a weight w,
 * benefit b. You have to pick the item in such a way to get maximum possible
 * sum of their benefits and keep the sum of their weights lower or equal to M.
 * 
 * It is an optimization problem. Let's forulate it, by adding an array of
 * booleans X of of the length equal to N:
 * 
 * maximize:    sum(X[i] * B[i])
 * constraints: sum(X[i] * W[i]) <= M
 *
 * This is solvable by trying out all combinations of items, which gives O(2^N)
 * and memory O-(1).
 * It is also solvable using dynamic programming, which will give O(N*M) and
 * O-(N*M).
 *
 * 1. Find the maximum possible benefit given M and array of items I.
 * 2. Find the combination of items giving the above result. 
 */
public class KnapSack {
    // Lets pack all test data into this particular file for now
    private static final Item[][] testData = {
        { new Item(5, 3), new Item(3, 2), new Item(4, 1) },
        { new Item(4, 3), new Item(3, 2), new Item(2, 4), new Item(3, 4) }
    };

    private int M;
    private Item[] items;

    public static void main(String args[]) {
    }

    public KnapSack(int M, Item[] items) {
        this.M = M;
        this.items = items;
    }

    public int solveBruteForce() {
        // TODO yin: write the straight-forward O(2^n) solution here latter
    }

    /** In dynamic programming, we want to do 3 things:
     * 1. Divide big problem to smaller problems
     * 2. Store answers for reuse when putting together ansers for the
     *    bigger problems.
     * 3. Just use answers for the smallest problem, we already know
     *
     * For a KnapSack problem we know 2 things: We will put not items into
     * knasack of capacity 0 and if we put no items into knapsack of any size,
     * we get 0 benefit.
     * Here we will start with a smaller knapsack of size 0 and build it's size
     * up considering one item at a time. In each step we will be
     * choosing to put the item in cosideration into the bag, or leaving it out.
     * We will be keeping each result 
     */
    public int solveDynamic() {
        int N = items.length;
        // Array A will help us answer task 1.
        // TODO yin: get rid with +1 in M+1, we know the 0 column is all 0's
        int A[][] = new int[N][M+1];
        // Array keep will help us answer task 2.
        // TODO yin: write down the backtracking part of algorithm
        // boolean keep[][] = new boolean[][]

        for (int i = 0; i < N; i++) {
            int w = items[i].weight;
            int b = items[i].benefit;
            for (int x = 0; x < M + 1; x++) {
                // While doing the first item, we can compare only with no items
                // in the knapsack and we know the answer here, it's 0
                int left = i > 0 ? left = A[i-1][x] : 0;
                int leftUnder i > 0 ? (x >= b ? A[i-1][x-b]) : 0
                A[i][x] = max(left, b + A[]);
            }
        }
    }

    public static class Item {
        // TODO yin: Common, public fields? Are you new to Java? Use getters!
        public final int weight;
        public final int benefit;

        public Item(int weight, int benefit) {
            this.weight = weight;
            this.benefit = benefit;
        }
    }
}
