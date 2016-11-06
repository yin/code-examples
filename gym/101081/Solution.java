import java.io.*;
import java.util.Locale;
import java.util.StringTokenizer;

public class Solution implements Runnable {

    BufferedReader in;
    PrintWriter out;
    StringTokenizer tok = new StringTokenizer("");

    public static void main(String[] args) {
        new Thread(null, new Solution(), "", 256 * (1L << 20)).start();
    }

    public void run() {
        try {
            long t1 = System.currentTimeMillis();
            out = new PrintWriter(System.out);
            for (String s : new String[]{"3 3 1 2 2 3 3 1", "5 3 1 2 3 4 4 5", "2 1 1 2"}) {
                in = new BufferedReader(new StringReader(s));
                Locale.setDefault(Locale.US);
                System.err.println(s);
                System.err.flush();
                solve();
                in.close();
                long t2 = System.currentTimeMillis();
                System.err.println("Time = " + (t2 - t1));
            }
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
            //TODO yin: unbalanced connectivity tree
            con[broot] = aroot;
            rn[aroot] += rn[broot];
            rm[aroot] += rm[broot] + 1;
        } else {
            rm[aroot]++;
        }
    }

    private int connRoot(int[] con, int a) {
        if (con[a] == a) return a;
        return connRoot(con, con[a]);
    }
}