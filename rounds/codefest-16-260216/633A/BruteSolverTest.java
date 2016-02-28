import static org.junit.Assert.*;

/**
 * Created by yin on 28.2.16.
 */
public class BruteSolverTest {

    @org.junit.Test
    public void testSolve() throws Exception {
        assertEquals(false, new BruteSolver().solve(4, 6, 15));
        assertEquals(true, new BruteSolver().solve(4, 6, 16));
        assertEquals(true, new BruteSolver().solve(11, 13, 37));
        assertEquals(true, new BruteSolver().solve(44, 50, 150));
    }
}