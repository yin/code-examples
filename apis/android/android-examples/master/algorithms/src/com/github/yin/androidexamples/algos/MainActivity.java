package com.github.yin.androidexamples.algos;

import android.support.v4.app.FragmentActivity;
import android.app.Fragment;
import android.app.FragmentTransaction;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.Toast;

public class MainActivity extends FragmentActivity implements Moderator {
	private static final String TAG = "ALGOS";
	
	/** Called when the activity is first created. */
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.main);
		if (!hasWelcomed()) {
			Intent intent = new Intent(this, WelcomeActivity.class);
			startActivity(intent);
		}
		AlgorithmFragment algoFrag = (AlgorithmFragment) getSupportFragmentManager()
			.findFragmentById(R.id.algo);
		if (algoFrag != null) {
			// if tablet-screen:
			algoFrag.getView().setVisibility(View.GONE);
		}
		if (findViewById(R.id.fragment_container) != null) {
			// if phone-screen:
			if (savedInstanceState != null) {
				// Don't setup anything, if restoring saved state
				return;
			}
			// Setup the first
			AlgolistFragment firstFragment = new AlgolistFragment();
			firstFragment.setArguments(getIntent().getExtras());
			getSupportFragmentManager().beginTransaction()
				.add(R.id.fragment_container, firstFragment).commit();
		}

	}

	private boolean hasWelcomed() {
		SharedPreferences pref = PreferenceManager
			.getDefaultSharedPreferences(this);
		final boolean hasWelcome = pref.getBoolean("welcome", false);
		return hasWelcome;
	}

	@Override
	public void onStart() {
		super.onStart();
	}

	@Override
	public void onObjectSelected(Object what) {
		if (what instanceof AlgorithmEntry) {
			AlgorithmEntry algoEntry = (AlgorithmEntry) what;
			openAlgorirhm(algoEntry);
		} else {
			Log.w(TAG, "Could not handle selection of: " + what);
		}
	}

	private void openAlgorirhm(AlgorithmEntry algoEntry) {
		AlgorithmFragment algoFrag = (AlgorithmFragment) getSupportFragmentManager()
			.findFragmentById(R.id.algo);
		if (algoFrag != null) {
			algoFrag.getView().setVisibility(View.VISIBLE);
			algoFrag.setAlgorithm(algoEntry);
		}
		if (findViewById(R.id.fragment_container) != null) {
			// if phone-screen:
			AlgorithmFragment fragment = new AlgorithmFragment();
			Bundle args = new Bundle();
			fragment.setArguments(args);
			getSupportFragmentManager().beginTransaction()
				.add(R.id.fragment_container, fragment).commit();
			fragment.setAlgorithm(algoEntry);
		}
	}
}
