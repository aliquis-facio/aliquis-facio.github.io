---
layout: post
comments: true
sitemap:
  changefreq:
  priority:
title: "[COMPUTER VISION] 영상 처리 연산 1"
excerpt: 점 연산, 영역 연산
date: 2025-10-05
last_modified_at: 2025-10-17
categories:
  - COMPUTER VISION
tags:
  - COMPUTER_VISION
---

# 목차

1. [영상 처리 연산](#5-영상-처리-연산)
	1. [점 연산(Point operation)](#51-점-연산point-operation)
	2. [영역 연산(Spatial/Neighborhood operation, Filtering)](#52-영역-연산spatialneighborhood-operation-filtering)
		1. [상관(correlation) vs 컨볼루션(convolution)](#521-상관correlation-vs-컨볼루션convolution)
		2. [선형 필터의 핵심 성질(LSI)](#522-선형-필터의-핵심-성질lsi)
		3. [대표 필터와 효과](#523-대표-필터와-효과)
		4. [컨볼루션 연산의 대수적 성질](#524-컨볼루션-연산의-대수적-성질)

---

# 5. 영상 처리 연산
## 5.1. 점 연산(Point operation)

- **정의**: 한 픽셀의 새 값이 **오직 그 픽셀 자신의 명암값**만으로 결정되는 변환
	- $$f_{out}(i, j) = t(f_1(i, j), \, f_2(i, j), \, ..., \, f_k(i, j))$$
- **형태**
    - **선형 점 연산**: 밝기·대비 조절 등
	    - ![Alt Images](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2025-10-17-15-52-30.png?raw=true)
	    - $$f_{out}(i, j) = t(f(i, j))
	    = \begin{cases}
		min(f(i, j) + a, \, L-1), \quad \text{(밝게)} \\
		max(f(i, j) - a, \, 0), \quad \text{(어둡게)} \\
		(L-1) - f(i, j), \quad \text{(반전)}
		\end{cases}$$
    - **비선형 점 연산**: **감마 수정**(표시 장치 보정 등)
	    - ![Alt Images](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2025-10-17-15-52-54.png)
	    - $$f_{out}(i, j) = (L-1) \times (\hat f(i, j))^\gamma \quad \text {이때} \; \hat f(i, j) = \frac {f(i, j)}{L-1}$$
    - **디졸브(dissolve)**: 두 영상 섞기(점 연산이지만 **(k=2)** 입력) e.g. fade in/out
	    - ![Alt Images](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2025-10-17-15-53-13.png)
	    - $$f_{out}(i, j) = \alpha f_1(i, j) + (1 - \alpha)f_2(i, j)$$
- **특징/용도 요약**: 국소 문맥을 보지 않으므로 **빠르고 단순**, 명암 재매핑(밝기/대비/감마), 영상 간 블렌딩에 효과적.

## 5.2. 영역 연산(Spatial/Neighborhood operation, Filtering)

- **정의**: 한 픽셀의 새 값이 **이웃 화소들의 명암값 함수**로 정해짐.
- ==**무엇에 쓰나?**==
    - **향상**(노이즈 감소(denoise), 사이즈 조정(resize), 대조 강화(contrast))
    - **정보 추출**(texture, **edges**, keypoints)
    - **패턴 검출**(템플릿 매칭)

### 5.2.1. 상관(correlation) vs 컨볼루션(convolution)

- **상관**: “원시적인 매칭 연산(윈도우 형태 템플릿으로 물체 검출)”
- **컨볼루션**: **커널을 좌우·상하 뒤집은 후** 상관을 적용 → 내가 원하는 윈도우와 동일하게 출력시키기 위해 적용
- “컨볼루션은 커널을 **뒤집어** 적용, 상관/컨볼루션은 **유사도 최대 위치를 찾는** 동일한 맥락”.
- ![Alt Images](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2025-10-17-16-03-26.jpg)
- 수식
	- 상관: $$g(i) = u \otimes f = \sum_{x=-\frac{(w-1)}{2}}^{\frac{(w-1)}{2}} u(x)\,f(i+x)$$
	- 컨볼루션: $$g(i) = u \ast f
		= \sum_{x=-\frac{(w-1)}{2}}^{\frac{(w-1)}{2}}
		  u(x)\,f(i-x)$$
- ![Alt Images](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2025-10-17-16-03-44.jpg)
- 수식
	- 상관: $$g(j,i) = u \otimes f
		= \sum_{y=-\frac{(h-1)}{2}}^{\frac{(h-1)}{2}}
		  \sum_{x=-\frac{(w-1)}{2}}^{\frac{(w-1)}{2}}
		  u(y,x)\,f(j+y,i+x)$$
	- 컨볼루션: $$g(j,i) = u \ast f
		= \sum_{y=-\frac{(h-1)}{2}}^{\frac{(h-1)}{2}}
		  \sum_{x=-\frac{(w-1)}{2}}^{\frac{(w-1)}{2}}
		  u(y,x)\,f(j-y,i-x)$$

### 5.2.2. 선형 필터의 핵심 성질(LSI)

- **선형성·시프트 불변성**: “어떤 **선형·시불변 연산자도 컨볼루션**으로 표현 가능”.
	- $F(Shift(f)) = Shift(F(f))$
- **대수 성질**: 교환·결합·분배·항등(임펄스) 등
	- $F(f_1 + f_2) = F(f_1) + F(f_2)$
- **결론**: 여러 필터를 연속 적용 ≡ **하나의 등가 필터**(성능·설계 단순화).

### 5.2.3. 대표 필터와 효과

- $$h[m, n] = \sum _{k, l} f[m+k, n+l]$$
- ![Alt Images](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2025-10-17-16-12-02.jpg)
- **Smoothing, 스무딩(저역통과)**
    - **박스/가우시안**: 노이즈 저감, 부드러워짐.
	    - ![Alt Images](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2025-10-17-16-10-57.jpg)
	    - ![Alt Images](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2025-10-17-16-11-02.jpg)
	- 박스 특징: 각 픽셀의 인접 픽셀의 평균값으로 교체, 격자 무늬
    - **가우시안 특징**: 고주파 제거, **자기 컨볼루션 → 폭 증가**($\sigma !\to! \sigma\sqrt{2}$), **분리 가능**(2D = 1D×1D).
    - 5×5 **가중 커널 예시**(중심 가중, 주변 작음).
- **Sharpening, 샤프닝(고주파 강조)**
	- ![Alt Images](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2025-10-17-16-11-11.jpg)
	- 특징: 자기 자신의 명암 강조 - 주변의 평균값
    - “**지역 평균과의 차**를 강조”하는 샤프닝 필터 예시.
- **에지 검출(1차 미분형)**
	- ![Alt Images](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2025-10-17-16-11-16.jpg)
    - **Sobel**: 수직/수평 마스크로 **경계 강조**.
    - 미분은 노이즈에 민감 → **스무딩 후 미분**이 정석
- 모션 필터
	- ![Alt Images](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2025-10-17-16-11-39.jpg)
- **비선형 필터**
    - **Median**: **임펄스(솔트 페퍼) 노이즈**에 강함.
	    - ![Alt Images](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2025-10-17-16-18-18.jpg)
	    - 최소, 최대 제외 후 중앙값 사용

### 5.2.4. 컨볼루션 연산의 대수적 성질

- 선형성: $filter(f_1 + f_2) = filter(f_1) + filter(f_2)$
- 이동 불변성: $filter(shift(f)) = shift(filter(f))$
- 교환 법칙: $a \times b = b \times a$
- 결합 법칙: $a \times  (b \times  c) = (a \times  b) \times  c$
- 분배 법칙: $a \times  (b + c) = (a \times  b) + (a \times  c)$
- 스칼라 결합: $ka \times  b = a \times  kb = k (a \times  b)$
- 항등원: $e = [0, 0, 1, 0, 0], a \times  e = a$
