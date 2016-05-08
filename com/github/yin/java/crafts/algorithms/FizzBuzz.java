package com.github.yin.java.crafts.algorithms;

import java.lang.NumberFormatException;
import java.io.PrintStream;

public class FizzBuzz {
    private static final int DEFAULT_NUM = 20;

    public void fizzbuzz(int num, PrintStream out) {
        for (int i = 0; i < num + 1; i++) {
            String s = "";
            int i3 = i % 3;
            int i5 = i % 5;
            if (i3 == 0) {
                s = "Fizz";
            }
            if (i5 == 0) {
                s += "Buzz";
            }
            if (i3 != 0 && i5 != 0) {
                s = String.valueOf(i);
            }
            out.println(s);
        }
    }

    public static void main(String args[]) {
        int num = DEFAULT_NUM;
        FizzBuzz me = new FizzBuzz();
        if (args.length > 1) {
            try {
                num = Integer.valueOf(args[1]);
            } catch(NumberFormatException e) {
                System.err.println(String.format("Next time use: java %s <num>",
                                                 FizzBuzz.class.getName()));
                System.err.println(String.format("Defaulting to num = %d",
                                                 DEFAULT_NUM));
            }
        }
        me.fizzbuzz(num, System.out);
    }
}
