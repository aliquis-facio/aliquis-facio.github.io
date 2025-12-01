# 7. Vector Backprop
## 1. 벡터 미분 복습 (Gradient & Jacobian)
### 1.1 스칼라 도함수

- $y = f(x)$, $x, y \in \mathbb{R}$ 일 때 $x$가 아주 조금 변하면 $y$가 얼마나 변하는지 보는 값이 도함수
- 즉, $dy/dx$ 는 $x$에 대한 $y$의 변화율.

### 1.2 그레이디언트 (Gradient)

- $y = f(\mathbf{x})$
    - $\mathbf{x} \in \mathbb{R}^{D_x}$ : 벡터 입력
    - $y \in \mathbb{R}$ : 스칼라 출력
- 이때 도함수는 **그레이디언트 벡터**:  
    $$\nabla_{\mathbf{x}} y =  
    \begin{bmatrix}  
    \frac{\partial y}{\partial x_1} \\
    \vdots \\\
    \frac{\partial y}{\partial x_{D_x}}  
    \end{bmatrix}$$
- 해석: 각 성분 $x_i$를 아주 살짝 바꿨을 때 $y$가 얼마나 변하는지 모은 것.

### 1.3 자코비안 (Jacobian)

- $\mathbf{y} = f(\mathbf{x})$
    - $\mathbf{x} \in \mathbb{R}^{D_x}$
    - $\mathbf{y} \in \mathbb{R}^{D_y}$
- 각 $y_i$ 에 대해 각 $x_j$ 를 편미분한 행렬:  
    $$J_{y,x}  
    = \frac{\partial \mathbf{y}}{\partial \mathbf{x}}
    \begin{bmatrix}  
    \frac{\partial y_1}{\partial x_1} & \cdots & \frac{\partial y_1}{\partial x_{D_x}} \\  
    \vdots & \ddots & \vdots \\  
    \frac{\partial y_{D_y}}{\partial x_1} & \cdots & \frac{\partial y_{D_y}}{\partial x_{D_x}}  
    \end{bmatrix}$$
- 즉, “각 입력 성분을 조금씩 바꿨을 때, **각 출력 성분이** 얼마나 변하는지”를 모두 모아놓은 것.

## 2. 벡터 체인 룰과 Backprop 기본 그림

슬라이드는 **계산 그래프(computational graph)** 상에서 벡터/행렬 단위로 backprop을 설명한다.

### 2.1 설정

- 노드: $\mathbf{x} \to \mathbf{y} \to \mathbf{z} \to L$
- $L$ 은 항상 스칼라 loss
- 각 노드에서:
    - 입력: $\mathbf{x}$ (혹은 여러 입력)
    - 출력: $\mathbf{y}$ (혹은 다음 노드의 입력)
    - 로컬 자코비안: $\frac{\partial \mathbf{y}}{\partial \mathbf{x}}$
    - 업스트림 그레이디언트: $\frac{\partial L}{\partial \mathbf{y}}$
    - 다운스트림 그레이디언트: $\frac{\partial L}{\partial \mathbf{x}}$

### 2.2 벡터 체인 룰 (Matrix–vector 형태)

노드 $\mathbf{y} = f(\mathbf{x})$에 대해:
$$\frac{\partial L}{\partial \mathbf{x}}  
= \left(\frac{\partial \mathbf{y}}{\partial \mathbf{x}}\right)^\top  
\frac{\partial L}{\partial \mathbf{y}}$$
- $\frac{\partial \mathbf{y}}{\partial \mathbf{x}}$ : 로컬 자코비안 ($D_y \times D_x$)
- $\frac{\partial L}{\partial \mathbf{y}}$ : 업스트림 그레이디언트 ($D_y$)
- 결과 $\frac{\partial L}{\partial \mathbf{x}}$ : 다운스트림 그레이디언트 ($D_x$)

슬라이드에서는 이를 **“Jacobian $\times$ upstream gradient = downstream gradient”** 라는 형태의 **행렬–벡터 곱**으로 표현한다.

## 3. Backprop with Vectors – ReLU 예제
### 3.1 예제 설정

슬라이드의 예시는 elementwise ReLU:
- 함수: $f(x) = \max(0, x)$ (elementwise)
- 4D 입력:  
    $$\mathbf{x} =  
    \begin{bmatrix}  
    1 \\ -2 \\ 3 \\ -1  
    \end{bmatrix}$$
- 출력:  
    $$\mathbf{y} = f(\mathbf{x}) =  
    \begin{bmatrix}  
    1 \\ 0 \\ 3 \\ 0  
    \end{bmatrix}$$
- 업스트림 그레이디언트 (이미 앞쪽에서 계산된 값):  
    $$  
    \frac{\partial L}{\partial \mathbf{y}}
    
    \begin{bmatrix}  
    4 \\ -1 \\ 5 \\ 9  
    \end{bmatrix}  
    $$

### 3.2 ReLU의 Jacobian

각 성분에 대해  
$$  
y_i = \max(0, x_i)  
$$  
이므로
$$  
\frac{\partial y_i}{\partial x_j}

\begin{cases}  
1 & \text{if } i = j \text{ and } x_i > 0 \  
0 & \text{otherwise}  
\end{cases}  
$$

예제에서의 Jacobian은 대각선에 $$1, 0, 1, 0$$이 있는 대각 행렬:

$$  
\frac{\partial \mathbf{y}}{\partial \mathbf{x}}

\begin{bmatrix}  
1 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 \\
0 & 0 & 1 & 0 \\
0 & 0 & 0 & 0
\end{bmatrix}  
$$

### 3.3 다운스트림 그레이디언트 계산

체인 룰에 따라:
$$  
\frac{\partial L}{\partial \mathbf{x}}
\left(\frac{\partial \mathbf{y}}{\partial \mathbf{x}}\right)^\top  
\frac{\partial L}{\partial \mathbf{y}}  
$$
대각 행렬이라 transpose 해도 동일하고, 실제 계산은 **마스크 곱**과 같다:

$$  
\frac{\partial L}{\partial \mathbf{x}}
\begin{bmatrix}  
1 & 0 & 0 & 0 \\  
0 & 0 & 0 & 0 \\  
0 & 0 & 1 & 0 \\  
0 & 0 & 0 & 0  
\end{bmatrix}  
\begin{bmatrix}  
4 \\ -1 \\ 5 \\ 9  
\end{bmatrix}
\begin{bmatrix}  
4 \\ 0 \\ 5 \\ 0  
\end{bmatrix}  
$$

**실질적인 규칙:**
- $x_i > 0$ (ReLU가 “살아 있는” 위치): $dL/dx_i = dL/dy_i$
- $x_i \le 0$ (“죽은” 위치): $dL/dx_i = 0$

프레임워크에서는 Jacobian을 만들지 않고, **업스트림 그레이디언트에 활성화 마스크를 elementwise 곱**하는 방식으로 구현한다.

## 4. Backprop with Matrices (또는 Tensors)
### 4.1 모양(Shape) 일반화

슬라이드는 벡터 개념을 그대로 **행렬/텐서**로 확장한다.
- 입력: $x \in \mathbb{R}^{D_x \times M_x}$
- 중간: $y \in \mathbb{R}^{D_y \times M_y}$
- 출력: $z \in \mathbb{R}^{D_z \times M_z}$
- loss $L$은 여전히 스칼라

핵심 규칙:
- $dL/dx$ 의 **shape는 항상 $x$와 같다.**
- $dL/dy$ 는 $y$와, $dL/dz$ 는 $z$와 같은 shape.

### 4.2 자코비안과 업스트림 그레이디언트

- $\frac{\partial z}{\partial y}$, $\frac{\partial y}{\partial x}$ 는 각각 거대한 **자코비안 행렬**:
    - 예: $\frac{\partial y}{\partial x}$ 의 크기 $\big(D_y M_y\big) \times \big(D_x M_x\big)$
- 하지만 실제 코드에서는 이 자코비안을 **명시적으로 만들지 않는다.**
- 대신, 앞에서 본 것처럼  
    $$  
    \frac{\partial L}{\partial x}
    
    \left(\frac{\partial y}{\partial x}\right)^\top  
    \frac{\partial L}{\partial y}  
    $$  
    꼴의 **행렬–벡터 곱만 암묵적으로** 계산한다.

## 5. 예제: 행렬 곱 $y = xw$ 의 Backprop
### 5.1 전방 연산 (Forward)

슬라이드의 예제
- 입력 행렬: $x \in \mathbb{R}^{N \times D},\quad  w \in \mathbb{R}^{D \times M}$
- 출력: $y = xw \in \mathbb{R}^{N \times M}$
- 각 원소:  $$y_{i,j} = \sum_{k=1}^{D} x_{i,k} w_{k,j}$$

실제 슬라이드에는 구체적인 숫자 예제와 함께 $dL/dy$ 가 주어진다.

### 5.2 자코비안 크기의 문제

이론적으로는:
- $y$ 를 $x$ 에 대해 미분한 자코비안: $$\frac{\partial y}{\partial x} \in \mathbb{R}^{(N D) \times (N M)}$$
- $y$ 를 $w$ 에 대해 미분한 자코비안: $$\frac{\partial y}{\partial w} \in \mathbb{R}^{(D M) \times (N M)}$$
예: $N = 64$, $D = M = 4096$ 인 경우, 각 자코비안이 **약 256 GB 메모리**를 차지하므로, 명시적으로 만들 수 없다.
그래서 **Jacobians는 암묵적으로만** 다루고, 우리가 필요로 하는 것은 오직:
- $dL/dx$ (입력에 대한 gradient)
- $dL/dw$ (weight에 대한 gradient)
뿐이다.

### 5.3 $dL/dx$ 유도

각 원소에 대해 체인 룰을 쓰면:
$$  
\frac{\partial L}{\partial x_{i,k}}

\sum_{j=1}^{M}  
\frac{\partial L}{\partial y_{i,j}}  
\frac{\partial y_{i,j}}{\partial x_{i,k}}  
$$

여기서  
$$  
\frac{\partial y_{i,j}}{\partial x_{i,k}} = w_{k,j}  
$$  
이므로
$$  
\frac{\partial L}{\partial x_{i,k}}
\sum_{j=1}^{M}  
\left(\frac{\partial L}{\partial y_{i,j}}\right) w_{k,j}  
$$
이를 행렬 형태로 모으면
$$
\boxed{  
\frac{\partial L}{\partial x}
\frac{\partial L}{\partial y} , w^\top  
}
$$
- 여기서 $\frac{\partial L}{\partial y} \in \mathbb{R}^{N \times M}$ 이고, $w^\top \in \mathbb{R}^{M \times D}$ 이므로 결과는 $N \times D$ 로 $x$와 동일한 shape.
- 슬라이드는 이를 “로컬 gradient slice”와 $dL/dy$ 의 내적(dot product)로 표현한 뒤, 위의 행렬식으로 일반화한다.

### 5.4 $dL/dw$ 유도

마찬가지로:
$$  
\frac{\partial L}{\partial w_{k,j}}
\sum_{i=1}^{N}  
\frac{\partial L}{\partial y_{i,j}}  
\frac{\partial y_{i,j}}{\partial w_{k,j}}  
$$
여기서  
$$  
\frac{\partial y_{i,j}}{\partial w_{k,j}} = x_{i,k}  
$$
이므로
$$  
\frac{\partial L}{\partial w_{k,j}}
\sum_{i=1}^{N}  
\left(\frac{\partial L}{\partial y_{i,j}}\right) x_{i,k}  
$$
행렬 형태로 쓰면:
$$  
\boxed{  
\frac{\partial L}{\partial w}
x^\top \frac{\partial L}{\partial y}  
}  
$$
- $x^\top \in \mathbb{R}^{D \times N}$, $dL/dy \in \mathbb{R}^{N \times M}$ 이므로 결과는 $D \times M$ 으로 $w$와 동일한 shape.

슬라이드는 여러 페이지에 걸쳐 “local gradient slice”를 구체적으로 보여준 후, 전체 행렬 공식으로 이어진다.

## 6. 실무적 관점: 프레임워크에서의 Backprop

1. **Loss $L$는 스칼라**: 그래서 어떤 노드에서든 업스트림/다운스트림 gradient는 항상 “변수 vs 스칼라” 관계의 그레이디언트/자코비안 구조를 갖는다.
2. **Jacobians는 절대 명시적으로 만들지 않는다**
    - 메모리 폭발 (수백 GB) 때문에 불가능.
    - 대신, 각 연산의 **로컬 gradient 공식을 직접 구현**해서, 업스트림 gradient와의 곱만 수행한다.
    - 예:
        - ReLU: 마스크 곱
        - MatMul:
            - $dL/dx = (dL/dy) w^\top$
            - $dL/dw = x^\top (dL/dy)$
3. **모듈화된 backward**
    - PyTorch 같은 프레임워크는 각 연산(레이어)에 대해
        - forward: $y = f(x, w)$
        - backward: 주어진 $dL/dy$ 로부터 $dL/dx$, $dL/dw$ 를 계산하는 함수
    - 사용자는 보통 `loss.backward()` 한 줄만 호출하면, 이 규칙들이 계산 그래프를 따라 자동으로 적용된다.