import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        // TODO yin: Scanner is too slow
        Scanner r = new Scanner(System.in);
        int a = r.nextInt(), b = r.nextInt(), c = r.nextInt();
        //System.out.println(new Solver().solve(a, b, c) ? "Yes" : "No");
        System.out.println(new BruteSolver().solve(a, b, c) ? "Yes" : "No");
    }
}

class Solver {
    public boolean solve(int a, int b, int c) {
        if (a > b) {
            a ^= b;
            b ^= a;
            a ^= b;
        }
        int gcdab = gcd(a, b);
        System.out.println(a + " " + b + " " + c + " gdc(a,b)" + gcdab + " c%a" + c % a + " c%b" + c % b + " c/a" + c / a + " c/b" + c / b);
        return (c % a) % gcdab == 0 && -((c % a) / gcdab) < 0;
    }

    int gcd(int m, int n) {
        if ((m % n) == 0)
            return n;
        else
            return gcd(n, m % n);
    }
}

class BruteSolver {
    public boolean solve(int a, int b, int c) {
        if (a > b) {
            a ^= b;
            b ^= a;
            a ^= b;
        }
        int am = c / a;
        for (int an = am; an >= 0; an--) {
            if ((c-(an * a)) % b == 0) {
                return true;
            }
        }
        return false;
    }
}
