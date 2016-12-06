package com.github.yin.java.crafts.memory;

import java.lang.ref.Reference;
import java.lang.ref.ReferenceQueue;
import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.List;

/**
 * Small example as to how {@link WeakReference}'s work.
 *
 * The WeakReference, once it is enqueued can be used to perform cleanup tasks
 * after GC started reclamation of the value object. (WeakReference is not
 * final, so we can subclass it and use it to run the cleanup task.)
 *
 * We allocate a WeakReference and dereference it's value (to remove all Stong
 * references to it), then repeatedly check if it's still returns the value and
 * if the WeakReference is present in the queue.
 *
 * From: <a href="http://stackoverflow.com/questions/5585694/whats-the-state-of-a-weak-reference-that-has-been-manually-enqueued>
 *     StackOverflow - Java - What's the state of a weak reference that has been manually enqueued?</a>
 */
public class WeakReferenceGCExample implements Runnable {
    static final long MB = 1024 * 1024;
    static final long MEM_TOTAL = Runtime.getRuntime().totalMemory();
    static final long MEM_MAX = Runtime.getRuntime().maxMemory();
    static final int ALLOC_SIZE = (int) (MEM_MAX / 4 - 2048);

    public static void main(String[] args) throws InterruptedException {
        new Thread(new WeakReferenceGCExample()).run();
    }

    public void run() {
        String weakString = new String("Help me!");
        ReferenceQueue<String> refQ = new ReferenceQueue<>();
        WeakReference<String> weakRef = new WeakReference<>(weakString, refQ);
        List<byte[]> memoryleaks = new ArrayList<>();

        System.out.println("Maximum memory: " + (MEM_MAX / MB));
        System.out.println("Total memory: " + (MEM_TOTAL / MB));
        System.out.println("Each iteration we allocate " + ALLOC_SIZE + " bytes");

        // There is no object in ReferenceQueue
        System.out.println("Before releasing string reference");
        System.out.println("ref value: " + weakRef.get());
        System.out.println("queue poll: " + refQ.poll());
        System.out.println();

        // There is no more "hard reference to the strings"
        weakString = null;

        // Once WeakReference was enqueued manually, GC never reclaims it. Not sure why, try it yourself:
        // weakRef.enqueue();
        for (int iter = 0; true; iter++) {
            System.out.println("Iteration # " + iter);
            allocateMoreMemory(memoryleaks);
            System.out.println();

            //There will be returned "Help me" until the garbage collector will "kill"
            //"weak" string. This will be done after some time because there are no
            //more strong references to the string. After that will be returned a null
            //object.
            String value = weakRef.get();
            System.out.println("stack value: " + value);

            //only one time there will be returned a refenrece to the String object
            Reference<? extends String> poll = refQ.poll();
            System.out.println("poll: " + poll);

            waitASecond();
            System.out.println();
            if (poll == null && value == null) break;
        }
        System.out.println("Reference queue is empty and the weak reference value has been ceared from memory...");
    }

    void waitASecond() {
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {}
    }

    static void allocateMoreMemory(List<byte[]> memoryleaks) {
        try {
            System.out.println("allocating next " + ALLOC_SIZE + " bytes");
            memoryleaks.add(new byte[ALLOC_SIZE]);
        } catch(OutOfMemoryError e) {
            System.out.println("JVM run out of memory, let's see now...");
        }
    }
}
