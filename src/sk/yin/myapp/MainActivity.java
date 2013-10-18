package sk.yin.myapp;

import android.app.*;
import android.content.*;
import android.os.*;
import android.preference.*;
import android.view.*;
import android.widget.*;
import java.security.*;
import java.util.*;
import sk.yin.myapp.MainActivity.*;

public class MainActivity extends ListActivity {
    private AlgorithmEntry[] algos = new AlgorithmEntry[] {
		ae("sha1"),
		ae("md5"),
	};
	/** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
		ListView lv = (ListView) findViewById(android.R.id.list);
		lv.setOnItemClickListener(new AdapterView.OnItemClickListener() {
				public void onItemClick(AdapterView list, View item, int i, long l) {
					FragmentTransaction t = getFragmentManager().beginTransaction();
					Fragment f = new AlgorithmFragment();

					t.add(R.id.frags, f);
					t.addToBackStack(null);
					t.commit();
					Toast.makeText(MainActivity.this, "click " + item, Toast.LENGTH_LONG).show();
				}
			});
		ListAdapter adapter = new ListableAdapter(this, algos);
		setListAdapter(adapter);

		if (!hasWelcomed()) {
			Intent intent = new Intent(this, WelcomeActivity.class);
			startActivity(intent);
		}
	}

	private boolean hasWelcomed() {
		SharedPreferences pref = PreferenceManager.getDefaultSharedPreferences(this);
		final boolean hasWelcome = pref.getBoolean("welcome", false);
		return hasWelcome;
	}

	@Override
	public void onStart() {
		super.onStart();
	}

	private AlgorithmEntry ae(String s) {
		if ("sha1".equals(s)) {
			return new BasicAlgoEntry(new DigestAlgorithm(), "sha1");
		}
		else if ("md5".equals(s)) {
			return new BasicAlgoEntry(new DigestAlgorithm(), "md5");
		}
		else {
			return null;
		}
	}

	public static class BasicResult implements ComputeResult, Listable {
		private Map<String, Object> inputs;

		private Object result;

		public BasicResult() {}

		public BasicResult(Map<String,Object> inputs, Object result) {
			this.inputs = inputs;
			this.result = result;
		}

		public void setResult(Object result) {
			this.result = result;
		}

		public Object getResult() {
			return result;
		}

		public void setInputs(Map<String, Object> inputs) {
			this.inputs = inputs;
		}

		public Map<String,Object> getInputs() {
			return inputs;
		}
		public String getInputDisplay() {
			return String.valueOf(inputs);
		}

		public String getOutputDisplay() {
			return String.valueOf(result);
		}

		public int getViewId() {
			return R.layout.item;
		}

		public String getTitle() {
			return getInputDisplay();
		}

		public String getSubtitle() {
			return getOutputDisplay();
		}

	}

	public static class BasicAlgoEntry implements AlgorithmEntry {
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
}

