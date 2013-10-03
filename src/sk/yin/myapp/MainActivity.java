package sk.yin.myapp;

import android.app.*;
import android.os.*;
import android.widget.*;
import java.security.*;
import java.util.*;

public class MainActivity extends ListActivity
{
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState)
	{
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
		ListAdapter adapter = new ArrayAdapter<HashedString>(this,
		   android.R.layout.simple_list_item_1,
		   new HashedString[] {hs("one"),hs("two")});
		setListAdapter(adapter);
	}
	
	@Override
	public void onStart() {
		super.onStart();

	}
	
	private HashedString hs(String s) {
		return new HashedString(s);
	}
	
	public static class HashedString
	{
		private String str;

		private static final String MSG_CANT_DO_HASH = "No hash available...";
		
		public HashedString() {}
		
		public HashedString(String str) {
			this.str = str;
		}

		public String getSha1()
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
			for (byte b : hash) {
				int u = (b >> 4) & 0x0F,
				    l = b & 0x0F;
				sb.append(u<10 ? ('0'+u) : ('a'+u-10))
				    .append(l<10 ? ('0'+l) : ('a'+l-10));
			}
			return sb.toString();
		}

		public void setStr(String str)
		{
			this.str = str;
		}

		public String getStr()
		{
			return str;
		}
		public String toString() {
			return str+"/"+getSha1();
		}
	}
}

