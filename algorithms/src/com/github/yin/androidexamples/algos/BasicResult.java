package com.github.yin.androidexamples.algos;

import java.util.Map;

public class BasicResult implements ComputeResult, Listable {
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