package sk.yin.myapp;

import java.util.*;

public interface ComputeResult
{
	Map<String, Object> getInputs();
	Object getResult();
	String getInputDisplay();
	String getOutputDisplay();
}

