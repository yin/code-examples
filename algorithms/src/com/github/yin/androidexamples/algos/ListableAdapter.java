package com.github.yin.androidexamples.algos;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;
import com.github.yin.androidexamples.algos.R;

public class ListableAdapter extends ArrayAdapter<Listable>
{

	public ListableAdapter(Context context, Listable[] algos) {
		super(context, R.layout.item, algos);
	}
	
	@Override
	public View getView(int position, View convertView, ViewGroup parent)
	{
		LayoutInflater inflater = (LayoutInflater)getContext()
			.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
		View listItemView = convertView;
		Listable t = (Listable) getItem(position);
		if (null == convertView)
		{
			listItemView = inflater.inflate(t.getViewId(), parent, false);
		}
		// The ListItemLayout must use the standard text item IDs.
		TextView lineOneView = (TextView)listItemView.findViewById(R.id.text1);
		TextView lineTwoView = (TextView)listItemView.findViewById(R.id.text2);
		
		lineOneView.setText(t.getTitle());
		lineTwoView.setText(t.getSubtitle());
		return listItemView;
	}
}
