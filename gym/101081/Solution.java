import java.io.*;
import java.util.Locale;
import java.util.StringTokenizer;

public class Solution implements Runnable {

    BufferedReader in;
    PrintWriter out;
    StringTokenizer tok = new StringTokenizer("");

    public Solution(BufferedReader in) {
        this.in = in;
    }

    public static void main(String[] args) {
        if (args.length > 0) {
            for (String arg : args) {
                new Thread(null, new Solution(new BufferedReader(new StringReader(arg))), "", 256 * (1L << 20)).start();
            }
        } else {
            new Thread(null, new Solution(new BufferedReader(new InputStreamReader(System.in))), "", 256 * (1L << 20)).start();
        }
    }

    public void run() {
        try {
            long t1 = System.currentTimeMillis();
            out = new PrintWriter(System.out);
            Locale.setDefault(Locale.US);
            solve();
            in.close();
            long t2 = System.currentTimeMillis();
            out.close();
        } catch (Throwable t) {
            t.printStackTrace(System.err);
            System.exit(-1);
        }
    }

    String readString() throws IOException {
        while (!tok.hasMoreTokens()) {
            tok = new StringTokenizer(in.readLine());
        }
        return tok.nextToken();
    }

    int readInt() throws IOException {
        return Integer.parseInt(readString());
    }

    long readLong() throws IOException {
        return Long.parseLong(readString());
    }

    double readDouble() throws IOException {
        return Double.parseDouble(readString());
    }

    // solution

    void solve() throws IOException {
        int n = readInt(), m = readInt();
        int e1[] = new int[m];
        int e2[] = new int[m];
        int con[] = new int[n];
        int rn[] = new int[n];
        int rm[] = new int[n];
        int deg[] = new int[n];
        for (int i = 0; i < n; i++) {
            con[i] = i;
            rn[i] = 1;
            rm[i] = 0;
            deg[i] = 0;
        }
        for (int i = 0; i < m; i++) {
            e1[i] = readInt() - 1;
            e2[i] = readInt() - 1;
            connectivity(con, rn, rm, e1[i], e2[i]);
            deg[e1[i]]++;
            deg[e2[i]]++;
        }
        for (int i = 0; i < n; i++) {
            int root = connRoot(con, i);
            int rootN = rn[root];
            int rootM = rm[root];
            int ipi = 2*rootM + rootN;
            int id = deg[i]+1;
            int d = gcd(ipi, id);
            System.out.print(ipi / d + " " + id / d);
            System.out.println();
        }
    }

    private int gcd(int a, int b) {
        int c;
        while (a != 0) {
            c = a;
            a = b % a;
            b = c;
        }
        return b;
    }

    private void connectivity(int[] con, int rn[], int rm[], int a, int b) {
        int aroot = connRoot(con, a);
        int broot = connRoot(con, b);
        if (aroot != broot) {
            con[broot] = aroot;
            rn[aroot] += rn[broot];
            rm[aroot] += rm[broot] + 1;
        } else {
            rm[aroot]++;
        }
    }

    private int connRoot(int[] con, int a) {
        int r = a;
        while (con[r] != r) {
            r = con[r];
        }
        con[a] = r;
        return r;
    }
}