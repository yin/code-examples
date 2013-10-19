package sk.yin.myapp;

import java.util.Map;

import android.app.Fragment;
import android.app.FragmentTransaction;
import android.app.ListFragment;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ListAdapter;
import android.widget.ListView;
import android.widget.Toast;


public class AlgolistFragment extends ListFragment {
    private AlgorithmEntry[] algos = new AlgorithmEntry[] {
		ae("sha1"),
		ae("md5"),
	};
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        View view = inflater.inflate(R.layout.algolist, container, false);
		return view;
	}

	@Override
	public void onStart() {
		super.onStart();
		ListView lv = (ListView) getView().findViewById(android.R.id.list);
		lv.setOnItemClickListener(new AdapterView.OnItemClickListener() {
				public void onItemClick(AdapterView<?> list, View item, int i, long l) {
					AlgorithmFragment af = (AlgorithmFragment) getFragmentManager().findFragmentById(R.id.algo);
					af.getView().setVisibility(View.VISIBLE);

					FragmentTransaction t = getFragmentManager().beginTransaction();
					Fragment f = new SingleStringFragment();

					t.replace(R.id.algo_in, f);
					t.addToBackStack(null);
					t.commit();
					Toast.makeText(getActivity(), "click " + item, Toast.LENGTH_LONG).show();
				}
			});
		ListAdapter adapter = new ListableAdapter(getActivity(), algos);
		setListAdapter(adapter);
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

