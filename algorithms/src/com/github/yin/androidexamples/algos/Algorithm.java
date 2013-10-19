package com.github.yin.androidexamples.algos;

import java.util.*;

public interface Algorithm
{
	//TODO: This should be asynch using Task's, even report progress
	Object compute(Map<String, Object> inputs);
}

