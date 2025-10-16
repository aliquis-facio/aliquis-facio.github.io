# LIS Algorithm
## LIS란?
LIS, Longest Increasing Subsequence(최장 증가 수열, 최대 증가 부분 수열): 어떤 수열에서 특정 부분을 지워서 만들어낼 수 있는 가장 긴 증가하는 부분 수열

> 10, 20, 40, 25, 20, 50, 30, 70, 85 라는 수열이 있을 때,
> LIS는 10, 20, 40, 50, 70, 85가 된다.

## DP → $O(n^2)$
```text
n: 배열의 길이
arr[]: 주어진 배열
cache[n]: arr[0] ~ arr[n]일 때 LIS 값
```

```java
int lisDP (int[] arr) {
	int n = arr.length;
	int[] cache = new int[n];
	int maxLength = Integer.MIN_VALUE;
	
	for (int i = 0; i < n; i++) {
		if (cache[i] == 0) cache[i] = 1;
		
		for (int j = 0; j < i; j++) {
			if (arr[j] < arr[i] && cache[j]+1 > cache[i]) cache[i] = cache[j]+1;
		}
		
		if (maxLength < cache[i]) maxLength = cache[i];
	}
	
	return maxLength;
}
```

## 이진 탐색 → $O(nlogn)$
```text
arr[]: 주어진 배열
cache[n]: 길이가 n인 LIS 중에서 마지막 원소가 최소인 값
```

```java
int binarySearch(ArrayList<Integer> cache, int l, int r, int trg) {
	int c;
	
	while (l < r) {
		c = (l+r)/2;
		
		if (trg > cache[c]) l = c+1;
		else r = c;
	}
	
	return r;
}

int lisBS() {
	int len = 0;
	ArrayList<Integer> cache = new ArrayList<>();
	cache.add(arr[0]);
	
	for (int i = 1; i < n; i++) {
		if (arr[i] > cache.get(cache.length()-1)) {
			cache.add(arr[i]);
			len = cache.length()-1;
		}
		
		int pos = binarySearch(cache, 0, len, arr[i]);
		cache[pos] = arr[i];
	}
	
	return len+1;
}
```

# 참고
* [LIS의 길이를 구하는 3가지 알고리즘](https://shoark7.github.io/programming/algorithm/3-LIS-algorithms)
* [[최장 증가 수열] LIS(Longest Increasing Subsequence)](https://jason9319.tistory.com/113)
* [[1][LIS : 최장 증가 수열 알고리즘] - DP를 이용한 알고리즘 (Longest Increasing Subsequence Algorithm)](https://source-sc.tistory.com/14)
* [[2][LIS : 최장 증가 수열 알고리즘] - Lower Bound를 이용한 알고리즘 (Longest Increasing Subsequence Algorithm)](https://source-sc.tistory.com/15)
* [최장 증가 수열 (LIS, Longest Increasing Subsequence) 2](https://4legs-study.tistory.com/106)