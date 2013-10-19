package com.github.yin.androidexamples.algos;

import android.app.Activity;
import android.app.ListFragment;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ListAdapter;
import android.widget.ListView;

public class AlgolistFragment extends ListFragment {
	private AlgorithmEntry[] algos = new AlgorithmEntry[] { ae("sha1"),
			ae("md5"), };
	private Moderator moderator;

	@Override
	public void onAttach(Activity activity) {
		super.onAttach(activity);
		try {
			moderator = (Moderator) activity;
		} catch (ClassCastException ex) {
			moderator = null;
			throw new ClassCastException(
					"Parent activity must implement the adaptor pattern.");
		}
	}

	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container,
			Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		View view = inflater.inflate(R.layout.algolist, container, false);
		return view;
	}

	@Override
	public void onStart() {
		super.onStart();
		ListAdapter adapter = new ListableAdapter(getActivity(), algos);
		setListAdapter(adapter);
	}

	@Override
	public void onListItemClick(ListView listView, View itemView,
			int position, long id) {
		if(moderator != null) {
			moderator.onObjectSelected(listView.getSelectedItem());
		}
		listView.setItemChecked(position, true);
	}

	private AlgorithmEntry ae(String s) {
		if ("sha1".equals(s)) {
			return new BasicAlgoEntry(new DigestAlgorithm(), "sha1");
		} else if ("md5".equals(s)) {
			return new BasicAlgoEntry(new DigestAlgorithm(), "md5");
		} else {
			return null;
		}
	}
}
