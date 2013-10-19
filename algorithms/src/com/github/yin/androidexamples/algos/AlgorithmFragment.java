package com.github.yin.androidexamples.algos;

import android.os.*;
import android.support.v4.app.*;
import android.view.*;
import android.widget.*;
import com.github.yin.androidexamples.algos.*;

public class AlgorithmFragment extends Fragment {
	private AlgorithmEntry algoEntry;

	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle state) {
		return inflater.inflate(R.layout.algo_common, container, false);
	}

	@Override
	public void onResume() {
		super.onResume();
		Toast.makeText(getActivity(), "hello world!" , Toast.LENGTH_LONG).show();
	}

	public void setAlgorithm(AlgorithmEntry algoEntry) {
		if (this.algoEntry != algoEntry) {
			this.algoEntry = algoEntry;
			
			((TextView) getView().findViewById(R.id.algo_name)).setText(algoEntry.getDisplay());
			
			int v = R.layout.singlestring;
			LayoutInflater inflater = getActivity().getLayoutInflater();
			ViewGroup root = (ViewGroup) getView().findViewById(R.id.algo_in);
			root.removeAllViews();
			View newInput = inflater.inflate(v, root, true);
			String param1 = algoEntry.getAlgorithm().getInputTypes().keySet().iterator().next();
			((TextView) newInput.findViewById(R.id.param1_name)).setText(param1);
		}
	}
}
