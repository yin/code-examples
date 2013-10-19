package com.github.yin.androidexamples.algos;

import java.security.*;
import java.util.*;

public class DigestAlgorithm implements Algorithm {
	private static final String MSG_CANT_DO_HASH = "No hash available...";

	public String compute(Map<String,Object> inputs) { 
		if (inputs != null && inputs.size() > 0) {
			String text = (String)inputs.values().iterator().next();
			return getSha1(text);
		}
		return null;
	}

	public String getSha1(String str) {
		try {
			MessageDigest md = MessageDigest.getInstance("SHA1");
			md.update(str.getBytes());
			byte[] hash = md.digest();
			//TODO: Cache this.
			return toHex(hash);
		}
		catch (NoSuchAlgorithmException e) {
			return MSG_CANT_DO_HASH;
		}
	}

	private String toHex(byte[] hash) {
		StringBuilder sb = new StringBuilder();
		for (byte b : hash) {
			int u = (b >> 4) & 0x0F,
				l = b & 0x0F;
			char uhex = toHex(u),
				lhex = toHex(l);
			sb.append(uhex).append(lhex);
		}
		return sb.toString();
	}

	private char toHex(int i) {
		return (char) (i < 10 ? '0' + i : 'a' + (i % 10));
	}
}

