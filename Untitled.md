## 1번

Dynamic pruning의 경우 pruning mask를 동적으로 찾아 주기 때문에 학습 안정성이 높다.
하나를 선택하세요.
- [ ] 참
- [ ] 거짓

---

## 2번

Upstream gradient는 local gradient와 downstream gradient의 곱이다
하나를 선택하세요
- [ ] 참
- [ ] 거짓

---

## 3번

다음 모듈에 대해 **4D $dL/dx$의 1번 값을 구하시오.**
- 4D input $x$: $[4,\ -2,\ 8,\ -1]$
- 연산: $f(x) = \max(0,\ x/2)$ (elementwise)
- 4D output $y$: $[2,\ 0,\ 4,\ 0]$
- 4D $dL/dy$ (Upstream gradient): $[2,\ -1,\ 5,\ 9]$

---

## 4번

linear model을 계속 깊게 쌓다 보면 non-linear한 문제를 풀 수 있게 된다
하나를 선택하세요
- [ ] 참
- [ ] 거짓

---

## 5번

Quantization aware training은 gradient approximation을 사용하지 않는다.
하나를 선택하세요.
- [ ] 참
- [ ] 거짓

---

## 6번

**문제.** 밑의 조건에서 $W_1$의 값을 이용하여  
$W_1$ 상태에서의 **training loss**를 구하세요.
- training 데이터가 $(x, t)$ 형식인 linear regression 문제를  
    1차원 모델 $y = wx$ 로 해결하려고 한다.
- gradient descent로 model weight $w$를 **한 번 업데이트** 한 뒤의 weight 값 $w^1$과  
    그때의 training loss를 계산하라.
- $x$는 input, 정답 값 label은 $t$.  
    Training data $D = {(1,2), (3,6)}$
- cost function (loss function)
    $$  
    L = \frac{1}{n}\sum_{i=1}^n (y_i - t_i)^2  
    $$
- Learning rate, step-size $\alpha = 0.1$
- Gradient descent 식:
    $$  
    w^1 = w^0 - \alpha \cdot \frac{dL}{dw^0}  
    $$
- Initial point는 $w^0 = 1$.

---

## 7번

2번 자리에 들어갈 **Gradient 값**을 쓰세요.  
(소수점 형식으로, 예: 0.9)

주어진 연산 그래프:

```python
def f(w0, x0, w1, x1, w2):
    s0 = w0 * x0
    s1 = w1 * x1
    s2 = s0 + s1
    s3 = s2 + w2
    L  = sigmoid(s3)
```

(그래프 상에 `1번`, `2번` 위치와 값 표시)

---

## 8번

다음 모듈에 대해 **4D $dL/dx$의 3번 값을 구하시오.**
- 4D input $x$: $[4,\ -2,\ 8,\ -1]$
- 연산: $f(x) = \max(0,\ x/2)$ (elementwise)
- 4D output $y$: $[2,\ 0,\ 4,\ 0]$
- 4D $dL/dy$ (Upstream gradient): $[2,\ -1,\ 5,\ 9]$

---

## 9번

1번 자리에 들어갈 **Gradient 값**을 쓰세요.  
(소수점 형식으로, 예: 0.9)

위와 동일한 연산 그래프:

```python
def f(w0, x0, w1, x1, w2):
    s0 = w0 * x0
    s1 = w1 * x1
    s2 = s0 + s1
    s3 = s2 + w2
    L  = sigmoid(s3)
```

---

## 10번

**문제.** 밑의 조건에서 $W_1$의 값을 구하세요.
조건:
- 1차원 linear regression 모델 $y = wx$
- Training data $D = {(1,2), (3,6)}$
- Loss
    $$  
    L = \frac{1}{n}\sum_{i=1}^n (y_i - t_i)^2  
    $$
- Learning rate $\alpha = 0.1$
- Initial point $w^0 = 1$
- Gradient descent를 한 번 적용한 후의 weight $w^1$을 구하라.

---

## 11번

Knowledge distillation (Hinton 교수님 제안 버전)은  
작은 모델의 정보를 큰 모델로 넘겨주는 학습 방법이다.

하나를 선택하세요.

- [ ] 참
- [ ] 거짓

---

## 12번

Linear Model은 2D 상황에서 template matching이다.

하나를 선택하세요.

- [ ] 참
- [ ] 거짓

---

## 13번

$x: N \times C \times H \times W$ 의 형태일 때,  
**Instance normalization의 $\gamma, \beta$의 표현 형태**를 고르시오.

하나를 선택하세요.

- [ ] a. $N \times 1$
- [ ] b. $1 \times C \times 1 \times 1$
- [ ] c. $N \times C \times 1 \times 1$
- [ ] d. $1 \times D$
- [ ] e. $N \times C \times H \times W$

---

## 14번

$x: N \times C \times H \times W$ 의 형태일 때,  
**Batch Normalization의 $\mu, \sigma^2, \mu_{\text{running}}$ 등의 통계**  
(평균, 분산)의 표현 형태를 고르시오.

(보기: $N \times 1$, $1 \times D$, $N \times C \times 1 \times 1$,  
$1 \times C \times 1 \times 1$, $N \times C \times H \times W$ 중 선택)

---

## 15번

CNN의 layer가 깊어질수록 Input 관점에서 receptive field가 커진다.

하나를 선택하세요.

- 참
    
- 거짓
    

---

## 16번

$x: N \times C \times H \times W$ 의 형태일 때,  
**Batch Normalization의 $\gamma, \beta$의 표현 형태**를 고르시오.

- [ ] $N \times 1$
- [ ] $1 \times D$
- [ ] $N \times C \times 1 \times 1$
- [ ] $1 \times C \times 1 \times 1$
- [ ] $N \times C \times H \times W$

---

## 17번

One-shot pruning은 일반적으로 iterative pruning보다 성능이 좋다.

하나를 선택하세요.

- 참
- 거짓

---

## 18번

$x: N \times C \times H \times W$ 의 형태일 때,  
**Instance normalization의 $\mu, \sigma$의 표현 형태**를 고르시오.

- [ ] $1 \times D$
- [ ] $N \times 1$
- [ ] $1 \times C \times 1 \times 1$
- [ ] $N \times C \times 1 \times 1$
- [ ] $N \times C \times H \times W$