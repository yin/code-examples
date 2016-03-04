package com.github.yin.angular.prototype;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertArrayEquals;

import javax.ws.rs.core.Response;
import java.util.Collection;

/**
 * Created by yin on 4.3.16.
 */
public class HelloRestServiceTest {

    @org.junit.Test
    public void testGreet() throws Exception {
        HelloRestService hello = new HelloRestService();
        Response resp = hello.greet("myself");
        assertEquals("It should return HTTP 200 OK", resp.getStatus(), 200);
        assertEquals("It should say hello to whoever asks to greet him", resp.getEntity(), (Object) "Hello myself!");
    }

    @org.junit.Test
    public void testJson() throws Exception {
        HelloRestService hello = new HelloRestService();
        Collection<Long> resp = hello.factors(12L);
        assertArrayEquals("It should return factors of a number", resp.toArray(),
                new Long[]{2L, 2L, 3L});
    }

    @org.junit.Test
    public void testJson_prime() throws Exception {
        HelloRestService hello = new HelloRestService();
        Collection<Long> resp = hello.factors(13L);
        assertArrayEquals("It should return factors of a number", resp.toArray(),
                new Long[]{13L});
    }

    @org.junit.Test
    public void testJson_big() throws Exception {
        HelloRestService hello = new HelloRestService();
        Collection<Long> resp = hello.factors(283626409262126736L);
        assertArrayEquals("It should return factors of a number", resp.toArray(),
                new Long[]{2L, 2L, 2L, 2L, 3L, 13L, 37L, 659L, 1031L, 18080743L});
    }

    // TODO yin: Make factoring more efficient. Try Java 8 streams
    // see http://mathforum.org/library/drmath/view/65801.html
    @org.junit.Test(timeout = 15000)
    public void testJson_bigReturn() throws Exception {
        HelloRestService hello = new HelloRestService();
        Collection<Long> resp = hello.factors(339714502038287L);
        assertArrayEquals("It should return factors of a number", resp.toArray(),
                new Long[]{659L, 1031L, 500000003L});
    }

    @org.junit.Test
    public void testJson_1() throws Exception {
        HelloRestService hello = new HelloRestService();
        Collection<Long> resp = hello.factors(1L);
        assertArrayEquals("It should return factors of a number", resp.toArray(),
                new Long[]{1L});
    }

    @org.junit.Test
    public void testJson_0() throws Exception {
        HelloRestService hello = new HelloRestService();
        Collection<Long> resp = hello.factors(0L);
        assertArrayEquals("It should return factors of a number", resp.toArray(),
                new Long[]{0L});
    }

    @org.junit.Test
    public void testJson_negative() throws Exception {
        HelloRestService hello = new HelloRestService();
        Collection<Long> resp = hello.factors(-10L);
        assertArrayEquals("It should return factors of a number", resp.toArray(),
                new Long[]{-10L});
    }
}