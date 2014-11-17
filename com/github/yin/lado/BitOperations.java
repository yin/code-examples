package com.github.yin.lado;

public class BitOperations {

    public static void main(String[] args) {
        byte a = 0x0f;
        byte b = 0x02;
        byte x = (byte) ((b << 4) | (a & 0xff));
        System.out.println(String.format("concatenate %d and %d = %d", a, b, x));
    }

    public void take_a_byte(byte b) {
    }

    private byte b;
    void setB(byte b){ this.b = b;}
    void test(){ setB((byte) 0x02);}
}
