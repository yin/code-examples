package com.github.yin.angular.prototype;

import javax.jws.WebService;
import javax.jws.soap.SOAPBinding;
import java.util.Collection;

/**
 * Created by yin on 4.3.16.
 */
@WebService
@SOAPBinding(style = SOAPBinding.Style.RPC)
public interface HelloSoapApi {
    String hello(String name);

    Long[] factors(long number);
//    Collection<Long> factors(long number);
}
