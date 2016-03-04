package com.github.yin.angular.prototype.math;

import java.util.ArrayList;
import java.util.Collection;

/**
 * Created by yin on 4.3.16.
 */
public class Math {
    public static Collection<Long> factors(long number) {
        Collection<Long> resp = new ArrayList();
        if (number < 2) {
            resp.add(number);
            return resp;
        }
        long divisor = 2;
        while (number >= divisor) {
            while(number % divisor == 0) {
                number /= divisor;
                resp.add(divisor);
            }
            divisor++;
        }
        return resp;
    }
}
