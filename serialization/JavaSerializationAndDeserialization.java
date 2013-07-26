package com.rwe.aide.ui.e2e.deploy.editor.util;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.Serializable;

public class JavaSerializationAndDeserialization {

	/**
	 * @param args
	 * @throws IOException
	 * @throws FileNotFoundException
	 * @throws ClassNotFoundException
	 */
	public static void main(String[] args) throws FileNotFoundException,
			IOException, ClassNotFoundException {
		// Save an object to stream
		ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(
				"test.object"));
		ATest t = new ATest();
		t.id = 4;
		t.name = "Abc";
		
		oos.writeObject(t);

		// Load an Object from a stream
		ObjectInputStream ois = new ObjectInputStream(new FileInputStream(
				"test.object"));
		ATest loaded = (ATest) ois.readObject();
		System.out.println(loaded.toString());
	}

	public static class ATest implements Serializable {
		public int id;
		public String name;

		public String toString() {
			return "ATest@" + hashCode() + "(id:" + id + ", " + "name:'" + name
					+ "')";
		}
	}
}
