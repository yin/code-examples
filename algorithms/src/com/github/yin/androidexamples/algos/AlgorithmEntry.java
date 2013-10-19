package com.github.yin.androidexamples.algos;

import android.view.*;

public interface AlgorithmEntry extends Listable
{
	int getViewId();
	String getDisplay();
	void onLoad(View view);
	void onUnload();
	// on button pressed... on input changed?
	Algorithm getAlgorithm();
}
