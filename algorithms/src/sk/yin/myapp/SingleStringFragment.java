package sk.yin.myapp;

import android.os.Bundle;
import android.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

public class SingleStringFragment extends Fragment 
{
	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle state) {
		return inflater.inflate(R.layout.singlestring, container, false);
	}

	@Override
	public void onResume() {
		super.onResume();
		Toast.makeText(getActivity(), "single string!" , Toast.LENGTH_LONG).show();
	}
}
