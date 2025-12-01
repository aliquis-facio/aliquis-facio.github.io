# Backpropagation with Computational Graph
## 1. 문제 설정: “어떻게 그레디언트를 계산할 것인가?”

- 우리가 학습하고 싶은 것은 **손실 (L)** 을 줄이도록 **파라미터 $W_1, W_2, \dots$** 를 업데이트하는 것.
- 예시 구성:
    - **비선형(score) 함수**
    - **힌지 손실(hinge loss)** 또는 소프트맥스 + 크로스 엔트로피
    - **정규화(regularization)** 항
- 결국 필요한 것은  $\frac{\partial L}{\partial W_1},\quad \frac{\partial L}{\partial W_2}, \dots$을 효율적으로 계산하는 방법이다.

### 1.1. (Bad Idea) 손으로 미분 다 때려 넣기

- 복잡한 모델일수록 **매트릭스 미분이 매우 번거로움**.
- 손실 함수를 힌지 → 소프트맥스로 바꾸거나, 레이어를 하나만 추가해도  
    → **처음부터 다시 미분 유도**해야 함.
- 유지보수·모듈화가 안 된다 → **실용적인 딥러닝 시스템 구현에 부적합**.

### 1.2. (Better Idea) Computational Graph 사용

- 전체 연산을 **노드(연산) + 엣지(값)** 로 이루어진 **그래프로 표현**.
    - 예:  
        $x, W \xrightarrow{\text{곱셈}} s \xrightarrow{\text{손실 함수}} L$
        - 정규화 $R(W)$ → 최종 손실 $L = \text{data loss} + \text{reg}$
- 이렇게 표현해 두면:
    - **Forward pass**: 그래프를 앞에서 뒤로 따라가며 값 계산
    - **Backward pass (backprop)**: 그래프를 뒤에서 앞으로 따라가며 그레디언트 계산  
        → 구조만 바꾸면 자동으로 그레디언트도 바뀌는 **모듈식** 구조

## 2. 간단한 스칼라 예제로 보는 Backprop

강의에서 쓰던 전형적인 예제 (값 예: $x=-2, y=5, z=-4$):

1. **Forward pass**
    - 예:  $$q = x + y,\quad f = q \cdot z$$
    - 순서대로 계산하면서 **중간 값들을 모두 저장**해 둔다.
2. **Backward pass – 목표**
    - $\frac{\partial f}{\partial x},; \frac{\partial f}{\partial y},; \frac{\partial f}{\partial z}$ 를 구하고 싶다.
    - 이를 위해 **체인 룰(chain rule)** + **계산 그래프**를 사용.

## 3. 체인 룰: Local / Upstream / Downstream Gradient
### 3.1. 체인 룰

- 두 함수 $f(g(x))$가 있을 때:  
    $$\frac{df}{dx} = \frac{df}{dg} \cdot \frac{dg}{dx}$$  
- 그래프에서 어떤 노드 $g$가 있을 때,
    - **Local gradient**: $\frac{\partial f}{\partial g}$ (해당 노드 주변만 보고 계산 가능한 미분)
    - **Upstream gradient**: 그래프 “위쪽”에서 내려오는 $\frac{\partial L}{\partial f}$
    - **Downstream gradient**: 우리가 궁극적으로 알고 싶은 $\frac{\partial L}{\partial g}$

### 3.2. backprop의 기본 규칙

노드 하나에 대해:
$$\text{Downstream grad} = \text{Upstream grad} \times \text{Local grad}$$

- 각 노드는 **“내 주변에서의 미분(Local)”만 알면 됨**.
- 전체 그래프의 그레디언트는:
    1. 맨 끝에서 $\frac{\partial L}{\partial L} = 1$ 로 시작해서
    2. 그래프를 **역순으로** 순회하며, 각 노드에서
        - 로컬 그레디언트 계산
        - 업스트림 그레디언트와 곱해서 다운스트림으로 전달

## 4. 다양한 연산에 대한 Local Gradient 패턴
### 4.1. Add gate (덧셈 연산)

- 연산: $q = x + y$
- 로컬 그레디언트:  $$\frac{\partial q}{\partial x} = 1,\quad \frac{\partial q}{\partial y} = 1$$
- 역할:
    - **“gradient distributor”**  
        → 업스트림 그레디언트를 **양쪽 입력으로 그대로 복사**해서 흘려보냄
        $$\frac{\partial L}{\partial x} = \frac{\partial L}{\partial q} \cdot 1,\quad  
        \frac{\partial L}{\partial y} = \frac{\partial L}{\partial q} \cdot 1$$

### 4.2. Mul gate (곱셈 연산)

- 연산: $q = x \cdot y$
- 로컬 그레디언트:  $$\frac{\partial q}{\partial x} = y,\quad \frac{\partial q}{\partial y} = x$$
- 역할:
    - **“swap multiplier”**  
        → x 쪽으로 가는 그레디언트는 y를 곱해주고, y 쪽으로 가는 그레디언트는 x를 곱해준다.
        $$\frac{\partial L}{\partial x} = \frac{\partial L}{\partial q} \cdot y,\quad  
        \frac{\partial L}{\partial y} = \frac{\partial L}{\partial q} \cdot x$$

### 4.3 Max gate (최댓값 연산)

- 연산: $q = \max(x, y)$
- 로컬 그레디언트:
    - $x > y$ 이면: $\frac{\partial q}{\partial x} = 1,\; \frac{\partial q}{\partial y} = 0$
    - $y > x$ 이면: $\frac{\partial q}{\partial x} = 0,\; \frac{\partial q}{\partial y} = 1$
- 역할:
    - **“gradient router”**  → 업스트림 그레디언트를 **max를 낸 쪽으로만** 보내고, 나머지는 0.

이 세 가지 패턴(add, mul, max)을 이해하면, 복잡한 네트워크도 “게이트들의 조합”으로 보면서 **그레디언트 흐름을 직관적으로 추적**할 수 있다.

## 5. 활성 함수(Activation)와 Softmax의 Gradient
### 5.1 활성 함수들의 로컬 그레디언트

주요 활성 함수:
- **Sigmoid**: $\sigma(x) = \frac{1}{1+e^{-x}}$
    $$\sigma'(x) = \sigma(x)(1-\sigma(x))$$
- **tanh**: $$\frac{d}{dx} \tanh(x) = 1 - \tanh^2(x)$$
- **ReLU**:
    $$\text{ReLU}(x) = \max(0, x),\quad  
    \text{ReLU}'(x) =  
    \begin{cases}  
    0 & x < 0\  
    1 & x > 0  
    \end{cases}$$
- **Leaky ReLU, Maxout, ELU** 등도 각각의 로컬 그레디언트가 정의되어 있고, backprop 때 그대로 사용.

핵심 포인트:
- 활성 함수는 **반드시 미분 가능(or 거의 미분 가능)** 해야 하고,
- 그 미분식을 알아야 backprop을 할 수 있다.
- 실제 코드에서는 이 로컬 그레디언트가 **레이어 단위로 캡슐화** 되어 있어, 파라미터를 바꿔도 같은 규칙으로 backprop 가능.

### 5.2 Softmax + Cross-Entropy Loss

- Softmax는 **raw score(logit)** 를 **확률**로 바꾸는 함수: $$p_k = \frac{e^{s_k}}{\sum_j e^{s_j}}$$
- 다중 클래스 분류에서 **크로스 엔트로피 손실**: $$L_i = -\log p_{y_i}$$
    (정답 클래스 (y_i) 에 대한 확률만을 사용)
- 슬라이드는 자세한 유도 대신, **softmax의 gradient** 에 대한 참고 링크로 넘기고,
    - 실제로는 $$\frac{\partial L}{\partial s_k} = p_k - 1[k = y]$$
        꼴로 정리된 결과를 많이 쓴다는 정도의 메시지를 전달.

## 6. Backprop 구현 패턴
### 6.1 “Flat” gradient 코드

1. **Forward pass 코드**
    - 중간 값들을 모두 저장:
        ```python
        # 예시 느낌
        x = ...
        y = ...
        z = ...
        q = x + y
        f = q * z
        ```
2. **Backward pass 코드
    - 뒤에서부터 시작해서 그레디언트 계산:
        ```python
        df = 1.0          # dL/df
        dq = df * z       # dL/dq
        dz = df * q       # dL/dz
        dx = dq * 1       # dL/dx
        dy = dq * 1       # dL/dy
        ```

- 이 패턴이 모든 연산에 대해 반복되며, 각 연산은 **자신의 로컬 그레디언트만 알고 있으면** 된다.

### 6.2 Autograd (PyTorch 예시)

슬라이드 마지막 부분: **PyTorch의 `autograd.Function`** 예시
- 클래스 구조:
    ```python
    class Mul(Function):
        @staticmethod
        def forward(ctx, x, y):
            ctx.save_for_backward(x, y)  # backward에서 쓸 값 저장
            return x * y
    
        @staticmethod
        def backward(ctx, grad_output):
            x, y = ctx.saved_tensors
            # 로컬 그레디언트 × 업스트림 그레디언트
            grad_x = grad_output * y
            grad_y = grad_output * x
            return grad_x, grad_y
    ```
- 포인트:
    - **forward** 에서는
        - 실제 연산 수행
        - backward에서 필요할 값은 `ctx` 에 **stash(저장)**.
    - **backward** 에서는
        - 입력값들을 꺼내 로컬 그레디언트 계산
        - 업스트림 그레디언트와 곱해서 다운스트림 그레디언트를 반환
- 여러분이 구현해야 할 것은
    - 각 연산에 대한 **로컬 그레디언트** 계산뿐이고,
    - 나머지 그레디언트 전파는 프레임워크가 자동으로 해 준다.

## 7. 전체 Backprop 알고리즘 요약

1. **모델을 연산 그래프로 표현**한다 (레이어, 활성함수, 손실, 정규화 등).
2. **Forward pass**
    - 입력 → 출력까지 차례대로 계산.
    - 중간 값들을 저장.
3. **Backward pass**
    - $\frac{\partial L}{\partial L} = 1$ 로 시작.
    - 그래프의 **역순**으로 순회하면서:
        - 각 노드에서 **로컬 그레디언트** 계산
        - 업스트림 그레디언트와 곱해 **입력 쪽으로 down-stream 그레디언트 전달**
        - 파라미터에 대한 그레디언트를 누적.
4. 계산된 $\frac{\partial L}{\partial W}$ 로 **경사하강법(gradient descent)** 업데이트 수행: $$W \leftarrow W - \eta \frac{\partial L}{\partial W}$$