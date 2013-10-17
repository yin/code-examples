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

public class MainActivity extends ListActivity
{
    private AlgorithmEntry[] algos = new AlgorithmEntry[] {
		ae("sha1"),
	};
	/** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState)
	{
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
		ListAdapter adapter = new ListableAdapter(this, algos);
		setListAdapter(adapter);

		if (!hasWelcomed())
		{
			Intent intent = new Intent(this, WelcomeActivity.class);
			startActivity(intent);
		}
	}

	private boolean hasWelcomed()
	{
		SharedPreferences pref = PreferenceManager.getDefaultSharedPreferences(this);
		final boolean hasWelcome = pref.getBoolean("welcome", false);
		return hasWelcome;
	}

	@Override
	public void onStart()
	{
		super.onStart();
		Toast.makeText(MainActivity.this, "Welcomed: " + hasWelcomed(), Toast.LENGTH_LONG).show();
	}

	private AlgorithmEntry ae(String s)
	{
		if ("sha1".equals(s))
		{
			return new BasicAlgoEntry(new Sha1Algorithm(), "sha1");
		}
		else
		{
			return null;
		}
	}

	public static class BasicResult implements ComputeResult, Listable
	{
		private Map<String, Object> inputs;

		private Object result;

		public BasicResult() {}

		public BasicResult(Map<String,Object> inputs, Object result) {
			this.inputs = inputs;
			this.result = result;
		}

		public void setResult(Object result)
		{
			this.result = result;
		}

		public Object getResult()
		{
			return result;
		}

		public void setInputs(Map<String, Object> inputs)
		{
			this.inputs = inputs;
		}

		public Map<String,Object> getInputs()
		{
			return inputs;
		}
		public String getInputDisplay()
		{
			return String.valueOf(inputs);
		}
		
		public String getOutputDisplay()
		{
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

	public static class Sha1Algorithm implements Algorithm
	{
		private static final String MSG_CANT_DO_HASH = "No hash available...";

		public String compute(Map<String,Object> inputs)
		{ 
			if (inputs != null && inputs.size() > 0)
			{
				String text = (String)inputs.values().iterator().next();
				return getSha1(text);
			}
			return null;
		}

		public String getSha1(String str)
		{
			try
			{
				MessageDigest md = MessageDigest.getInstance("SHA1");
				md.update(str.getBytes());
				byte[] hash = md.digest();
				//TODO: Cache this.
				return toHex(hash);
			}
			catch (NoSuchAlgorithmException e)
			{
				return MSG_CANT_DO_HASH;
			}
		}

		private String toHex(byte[] hash)
		{
			StringBuilder sb = new StringBuilder();
			for (byte b : hash)
			{
				int u = (b >> 4) & 0x0F,
				    l = b & 0x0F;
				char uhex = toHex(u),
				    lhex = toHex(l);
			    sb.append(uhex).append(lhex);
			}
			return sb.toString();
		}

		private char toHex(int i)
		{
			return (char) (i < 10 ? '0' + i : 'a' + (i % 10));
		}
	}

	public static class BasicAlgoEntry implements AlgorithmEntry
	{
		private String display;

		private Algorithm algo;

		public BasicAlgoEntry(Algorithm algo, String display)
		{
			this.display = display;
			this.algo = algo;
		}

		public int getViewId()
		{
			return R.layout.item;
		}
		
		public String getTitle() {
			return getDisplay();
		}
		
		public String getSubtitle() {
			return algo != null ? algo.getClass().getSimpleName() : "<no algorithm>";
		}

		public void onLoad(View view)
		{
		}

		public void onUnload()
		{
		}

		public Algorithm getAlgorithm()
		{
			return algo;
		}

		public String getDisplay()
		{
			return display;
		}
	}
}

