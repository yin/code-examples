package sk.yin.myapp;


import android.app.*;
import android.os.*;
import android.view.*;
import android.widget.*;
import android.content.*;
import android.preference.*;
import android.view.View.*;

public class WelcomeActivity extends Activity
{
    public void onCreate(Bundle saved) {
		super.onCreate(saved);
		setContentView(R.layout.welcome);
		TextView v = (TextView)findViewById(R.id.text);
		v.setOnTouchListener(new OnTouchListener() {
			public boolean onTouch(View v, MotionEvent e) {
				finish();
				return true;
			}
		});
	}
	
	public void onStart() {
		super.onStart();
		SharedPreferences pref = PreferenceManager.getDefaultSharedPreferences(this);
		SharedPreferences.Editor edit = pref.edit();
		edit.putBoolean("welcome", true);
		edit.commit();
	}
}
