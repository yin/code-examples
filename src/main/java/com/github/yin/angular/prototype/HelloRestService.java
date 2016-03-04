package com.github.yin.angular.prototype;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.Collection;

/**
 * Created by yin on 4.3.16.
 */
@Path("/")
public class HelloRestService {
    /**
     * @return Greeting to requested name
     */
    @GET
    @Path("/greet/{name}")
    public Response greet(@PathParam("name") String name) {
        return Response.status(200).entity("Hello " + name + "!").build();
    }

    /**
     * Factors a 64bit integer. If the integer is negative, it return list with single element (the number). There are
     * effective ways of factoring integers, but this works very fast... at least it looks like that, if you're a human.
     * @return Prime factors of number
     */
    @GET
    @Path("/factors/{int}")
    @Produces(MediaType.APPLICATION_JSON)
    public Collection<Long> factors(@PathParam("int") long number) {
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
