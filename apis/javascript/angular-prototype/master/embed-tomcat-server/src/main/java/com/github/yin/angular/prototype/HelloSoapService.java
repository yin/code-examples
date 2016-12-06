package com.github.yin.angular.prototype;

import javax.jws.WebService;
import java.util.Collection;

import com.github.yin.angular.prototype.math.Math;

/**
 * Created by yin on 4.3.16.
 */
@WebService(
        endpointInterface = "com.github.yin.angular.prototype.HelloSoapApi"
)
public class HelloSoapService implements HelloSoapApi {
    @Override
    public String hello(String name) {
        return "Hello " + name + "!";
    }

    @Override
    public Long[] factors(long number) {
        return (Long[]) Math.factors(number).toArray();
    }
}
