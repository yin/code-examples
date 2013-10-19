package com.github.yin.androidexamples.algos;

import android.view.View;

public class BasicAlgoEntry implements AlgorithmEntry {
	private String display;

	private Algorithm algo;

	public BasicAlgoEntry(Algorithm algo, String display) {
		this.display = display;
		this.algo = algo;
	}

	public int getViewId() {
		return R.layout.item;
	}

	public String getTitle() {
		return getDisplay();
	}

	public String getSubtitle() {
		return algo != null ? algo.getClass().getSimpleName() : "<no algorithm>";
	}

	public void onLoad(View view) {
	}

	public void onUnload() {
	}

	public Algorithm getAlgorithm() {
		return algo;
	}

	public String getDisplay() {
		return display;
	}
}