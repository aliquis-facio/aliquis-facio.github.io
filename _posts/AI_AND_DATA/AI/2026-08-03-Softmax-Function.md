---
layout: post
comments: true
sitemap:
title: "[AI] Softmax 함수"
excerpt: Softmax 함수의 정의 및 성질과 Sigmoid 함수와의 비교 (w. Python)
date: 2026-08-03
last_modified_at: 2026-08-03
categories:
  - AI
tags:
  - AI
  - ACTIVATION_FUNCTION
---

<!-- markdownlint-disable MD004 MD010 MD025 MD033 MD060 -->

# Softmax

---

## 목록

1. [정의](#1-정의)
1. [수식](#2-수식)
1. [성질](#3-성질)
1. [왜 지수(exponential)를 쓸까?](#4-왜-지수exponential를-쓸까)
1. [Softmax VS Sigmoid](#5-softmax-vs-sigmoid)
1. [Python](#6-python)

---

## 1. 정의

**Softmax 함수(이하 S(x))**: 실수 벡터를 **전체 합이 1인 확률 분포(probability distribution)** 로 변환하는 함수이다.
입력값의 상대적인 크기 차이를 강조해, 값이 더 큰 클래스에 더 높은 확률을 부여한다.

## 2. 수식

입력 벡터가 다음과 같을 때:
$$z = [z_1, z_2, ..., z_n]$$

Softmax 함수는 다음과 같이 정의된다:
$$\text{S}(z_i) = \frac{e^{z_i}}{\sum_{j=1}^{n} e^{z_j}}$$

- $z_i$: $i$번째 클래스의 점수(logit)
- $e^{z_i}$: 지수 함수로 양수화
- $\sum_j e^{z_j}$: 모든 클래스 점수의 합 (정규화 항)
- $S(z_i)$: $i$번째 클래스에 대한 예측 확률

## 3. 성질

- $\sum_i \text{S}(z_i) = 1$: 전체 합이 항상 1 → 확률 분포
- $0 < \text{S}(z_i) < 1$: 모든 값이 0~1 사이
- 입력이 모두 같을 때: 모든 클래스 확률 = 1/n
- 값이 큰 쪽이 강조됨: 지수 함수의 특징 때문

## 4. 왜 지수(exponential)를 쓸까?

지수를 사용하면 **모든 입력값을 양수로 변환하면서 입력값의 차이를 비선형적으로 확대**시킨다.

예를 들어 입력값이 다음과 같을 때:

$$
z = [-2, -1, 0, 1, 2]
$$

지수 함수를 적용하면
$$
e^z
=[e^{-2},e^{-1},e^0,e^1,e^2]
\approx[0.135,\ 0.368,\ 1.000,\ 2.718,\ 7.389]
$$

softmax 함수가 적용되면
$$
S(z)\approx[0.012,\ 0.032,\ 0.086,\ 0.234,\ 0.636]
$$

원래 입력값은 1씩 일정하게 증가하지만, 지수 함수를 적용한 값은 점점 더 큰 폭으로 증가한다. 그 결과 가장 큰 입력값인 $2$가 약 **63.6%** 의 확률을 차지한다.

## 5. Softmax VS Sigmoid

Softmax와 Sigmoid 함수 모두 입력값을 0과 1 사이의 값으로 반환하지만, 다음과 같은 차이점이 있다.

- Sigmoid 함수는 하나의 입력값을 0과 1 사이의 값으로 변환한다.
	$$
	\sigma(z)=\frac{1}{1+e^{-z}}
	$$
- Softmax는 입력 벡터 전체를 함께 사용하여 각 출력값을 계산한다.
	$$
	S(z_i)=\frac{e^{z_i}}{\sum_j e^{z_j}}
	$$

| 구분     | Sigmoid           | Softmax               |
| ------ | ----------------- | --------------------- |
| 입력 처리  | 각 logit을 독립적으로 처리 | 모든 logit을 함께 처리       |
| 출력값 범위 | 0과 1 사이           | 0과 1 사이               |
| 출력값의 합 | 1이 아닐 수 있음        | 항상 1                  |
| 클래스 관계 | 서로 독립적            | 서로 경쟁적                |
| 적합한 문제 | 이진 분류, 다중 레이블 분류  | 다중 클래스 단일 레이블 분류      |
| 의미     | 각 클래스가 해당될 독립 확률  | 전체 클래스 중 각 클래스의 상대 확률 |

## 6. Python

<details>
<summary>전체 코드 접기/펼치기</summary>
<div markdown="1">

```python
import numpy as np
import matplotlib.pyplot as plt


def sigmoid(z):
    return 1 / (1 + np.exp(-z))

def softmax(z):
    # 최댓값을 빼서 overflow 방지
    shifted_z = z - np.max(z)
    exp_z = np.exp(shifted_z)
    return exp_z / np.sum(exp_z)

fig, axes = plt.subplots(2, 1, figsize=(11, 9))

# 1. 이진 분류에서 Sigmoid와 Softmax 비교
z = np.linspace(-6, 6, 500)

sigmoid_values = sigmoid(z)

# softmax([z, 0])에서 첫 번째 클래스의 확률
binary_softmax_values = np.array([
    softmax(np.array([value, 0]))[0]
    for value in z
])

axes[0].plot(
    z,
    sigmoid_values,
    linewidth=3,
    label="Sigmoid(z)"
)

axes[0].plot(
    z,
    binary_softmax_values,
    linestyle="--",
    linewidth=2.5,
    label="Softmax([z, 0])[0]"
)

axes[0].axhline(0.5, color="gray", linestyle=":", linewidth=1)
axes[0].axvline(0, color="gray", linestyle=":", linewidth=1)

axes[0].set_title(
    "Binary Classification: Sigmoid and Softmax"
)
axes[0].set_xlabel("Logit z")
axes[0].set_ylabel("Output")
axes[0].set_xlim(-6, 6)
axes[0].set_ylim(-0.03, 1.03)
axes[0].grid(alpha=0.25)
axes[0].legend()

# 2. 다중 클래스에서 Sigmoid와 Softmax 비교
logits = np.array([1.0, 2.0, 3.0])

sigmoid_outputs = sigmoid(logits)
softmax_outputs = softmax(logits)

positions = np.arange(len(logits))
width = 0.34

sigmoid_bars = axes[1].bar(
    positions - width / 2,
    sigmoid_outputs,
    width,
    label=f"Sigmoid (sum={sigmoid_outputs.sum():.2f})"
)

softmax_bars = axes[1].bar(
    positions + width / 2,
    softmax_outputs,
    width,
    label=f"Softmax (sum={softmax_outputs.sum():.2f})"
)

axes[1].bar_label(sigmoid_bars, fmt="%.2f", padding=3)
axes[1].bar_label(softmax_bars, fmt="%.2f", padding=3)

axes[1].set_title(
    "Multiclass Comparison: logits = [1, 2, 3]"
)
axes[1].set_xlabel("Class")
axes[1].set_ylabel("Output")
axes[1].set_xticks(positions)
axes[1].set_xticklabels(["Class 1", "Class 2", "Class 3"])
axes[1].set_ylim(0, 1.08)
axes[1].grid(axis="y", alpha=0.25)
axes[1].legend()

plt.tight_layout()
plt.show()
```

</div>
</details>

실행 결과:

![500x408](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-08-03-14-05-22.png)

- 이진 분류에서 2개 입력값에 적용한 softmax는 sigmoid와 같다.
- 아래쪽 그래프에서는 sigmoid는 각 값을 독립적으로 계산하지만, softmax는 세 출력의 합이 1이 되도록 계산한다.

## 참고

- [Naver: 소프트맥스(softmax) 함수 조금 자세히 알아보기](https://m.blog.naver.com/luexr/223133865455)
- [Velog: Softmax Function](https://velog.io/@chiroya/13-Softmax-Function)
