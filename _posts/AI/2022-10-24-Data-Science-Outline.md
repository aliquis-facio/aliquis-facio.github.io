---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[DATA SCIENCE] 데이터과학 정리"
excerpt: "w.Python matplotlib"

date: 2022-10-24
last_modified_at: 2024-11-08

categories: [DATA SCIENCE]
tags: [DATASCIENCE]
---

# Data Visualization

## matplotlib

**python의 plotting 패키지 -> 데이터 통계 분석 및 가시화**
`from matplotlib import pyplot as plt` = `import matplotlib.pyplot as plt`  
  
그래프 생성: `plt.show()`
1. 선그래프(line chart)
	`plt.plot(x_vals, y_vals, ...)`
2. 막대그래프(bar chart): 이산적인 항목에 대한 변화나 차이를 보일 때 활용
	`plt.bar(x_vals, y_vals, ...)`  
3. 히스토그램(histogram): 정해진 구간에 해당하는 항목의 개수를 보이는 막대그래프(값의 분포)
	`w. Counter`
	```python
	from collections import Counter
	histogram = Counter(min(최댓값, x_val // 10 * 10) for x_val in x_vals)
	plt.bar([x + 5 for x in histogram.keys()], histogram.values()), ...)
	```  
4. 산점도(scatterplot): 두 변수 간의 연관 관계를 보일 때 활용
	 `plt.scatter(x_vals, y_vals)`  
5. 네트워크 시각화(network visualization)
	```python
	import networkx as nx
	G = nx.Graph()
	G.add_edge(e1, e2, ...)
	pos = nx.spring_layout(G)
	nx.draw(G, pos)
	```  

# Basic Linear Algebra

## vector

1. 정의 1
	- 방향과 크기의 의미를 모두 포함하는 표현도구. e.g. 속도(velocity), 무게(weight) 등
	- 스칼라(scalar): 방향성 없이 하나의 크기를 나타냄. e.g. 속력(speed), 질량(mass) 등
2. 정의 2
	- 유한한 차원의 공간에 존재하는 점
	- python의 list나 tuple을 사용해 벡터 표현 가능.
[그림1](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2022-10-24-vector.png?raw=true)

## python's list != vector

벡터는 다차원 공간상의 점으로 정의되므로, 리스트를 벡터처럼 사용하기 위해서는 각 점들끼리의 합, 차, 곱 등의 연산을 정의해야 함.

## 벡터의 연산

두 벡터의 합/차는 같은 차원의 값끼리 더한/뺀 것  
벡터 x와 스칼라 k의 곱은 벡터 x의 각 차원의 값을 k배 한 것  
벡터의 내적(dot product): 두 벡터의 내적은 같은 차원의 값끼리 곱한 것을 모두 더한 것  

## 행렬

* 수를 다음과 같이 직사각형 모양의 행과 열로 배열한 것을 행렬(matrix)이라 하며, 각각의 수를 행렬의 성분(entry)이라고 함.
* n행 m열을 가질 경우 n ⨉ m 행렬이라고 함.
* 같은 크기의 벡터들이 모이면 행렬이 됨.
* python에서 list의 list 혹은 tuple의 tuple로 표현 가능
[그림2](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2022-10-24-matrix.png?raw=true)

### 행렬의 연산

행렬의 합/차는 같은 위치의 값끼리 더한/뺀 것  
행렬 A와 스칼라 k의 곱은 행렬의 각 요소에 k를 곱한 것  
행렬의 곱셈  
[그림3](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2022-10-24-matrix_product.png?raw=true)
행렬 A의 크기가 n ⨉ m이고 행렬 B의 크기가 m ⨉ s일 때, 곱 AB의 결과로 나오는 행렬의 크기는 n ⨉ s이다. 행렬 A의 열 크기와 B의 행 크기가 같아야 연산 가능.

### 행렬의 응용

컴퓨터 그래픽스, 그래프 이론, 추천시스템, 딥러닝

## numpy
데이터, 수치 분석을 위한 python 패키지 효율적인 선형대수 프로그래밍 가능.
```python
import numpy as np

v1 = np.array([1, 2, 3])
v2 = np.array([2, 3, 4])

v1 + v2 # 벡터 합
v1 - v2 # 벡터 차
v1 * v2 # 벡터 요소별 곱
v1.dot(v2) # 벡터 내적

mat1 = np.array([1, 2], [2, 3])
mat2 = np.array([3, 4], [4, 5])

mat1 + mat2 # 행렬 합
mat1 - mat2 # 행렬 차
mat1.T # 전치행렬
mat1 * mat2 # 행렬 요소별 곱하기
mat1.dot(mat2) # 행렬 곱
```  

# Probability and Statistics

* 평균(mean, average)
* 중앙값(median): 정렬했을 때 가장 중앙에 있는 데이터
* 최빈값(mode): 가장 자주 등장하는 데이터
* 최대값/최소값
* 분위(quantile): 특정 백분위보다 낮은 분위에 속하는 데이터
* 산포도(dispersion): 데이터가 퍼져있는 정도
* max - min: 최대값과 최소값의 차이
* 분산(variance): 편차 제곱의 평균
* interquartile range: 상위 25%와 하위 25%의 차이
* 공분산(covariance): 두 확률변수의 상관관계를 나타내는 값
    두 확률변수 X와 Y에 대해서 공분산 Cov(X, Y)는 다음과 같이 정의됨.
    [그림4](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2022-10-24-covariance.png?raw=true)
* 상관계수(Pearson Corr. Coef.): 두 확률변수의 상관관계를 -1 ~ 1 사이의 값으로 나타내는 값
    [그림5](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2022-10-24-coeff.png?raw=true)
    [그림6](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2022-10-24-coeff_figure.png?raw=true)
    
# Regression
* 지도학습(suprevised learning): 훈련 데이터(training data)로부터 하나의 함수를 유추해내기 위한 기계 학습(machine learning)의 한 방법 ex) teachable machine

* 회귀분석(regression): 관찰된 연속형 변수들에 대해 두 변수 사이의 모형을 구한 뒤 적합도를 측정해 내는 분석 방법 -> 지도 학습 방법 중 하나
* 선형회귀분석(linear regression): 종속 변수 y와 한 개 이상의 독립 변수(또는 설명 변수) X와의 선형 상관 관계를 모델링하는 회귀분석 기법
    [그림7](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2022-10-24-linear_regression.png?raw=true)

* 가설(hypothesis)과 비용(cost)
    [그림8](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2022-10-24-hypothesis_and_cost.png?raw=true)

* 경사하강법(gradient descent): 편미분을 이용해 cost를 최소로 만드는 w, b 값을 찾자.
    [그림9](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2022-10-24-gradient_descent.png?raw=true)
    [그림10](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2022-10-24-gradient_descent_1.png?raw=true)
    [그림11](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2022-10-24-gradient_descent_2.png?raw=true)

* 그 밖의 학습 방법들: SGE, Momentum, NAG, Adagrad, Adadelta, Rmsprop

# Linear Regression Practice
## pytorch
`import torch`
텐서(tensor): 파이토치에서 사용하는 가장 기본적인 자료구조. 다양한 수식 계산을 지원. 수학의 스칼라, 벡터, 행렬 등을 일반화한 개념.
[그림12](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2022-10-24-torch_tensor.png?raw=true)

```python
# x == y, 같은 내용
x = torch.tensor([[1, 2, 3], [4, 5, 6], [7, 8, 9]], dtype = torch.float)
y = torch.FloatTensor([[1, 2, 3], [4, 5, 6], [7, 8, 9]])

x.size() # size
x.shape() # shape
x.ndimension() # 차원(rank)

torch.unsqueeze(x, i) # tensor x에 i번째 차원 추가
torch.squeeze(x) # tensor x에서 크기가 1인 차원 제거
x.view([shape]) # x를 [shape]의 모양으로 변환 ex) x.view(1, 3, 3), x.view(9)

# xw + b
x = torch.FloatTensor([1, 2], [3, 4], [5, 6])
w = torch.randn(1, 2, dtype = torch.float)
b = torch.randn(3, 1, dtype = torch.float)

result = torch.mm(x, torch.t(w)) + b
```