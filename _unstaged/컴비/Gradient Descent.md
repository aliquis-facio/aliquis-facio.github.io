## 4. Gradient Descent
### 1. 챕터 개요

- 목표: 주어진 목적 함수: $$\Theta^* = \arg\min_\Theta J(\Theta)$$의 해를 **해석적으로(analytical)** 구하기 어려울 때, **수치적으로** 최소점을 찾는 방법인 **경사하강법(Gradient Descent)** 를 설명.
- 어려운 경우 예시
    - 복잡한 loss 함수
    - 일반적인(비선형) 정규화 항
    - 데이터가 너무 커서 행렬 역행렬 계산이 비현실적인 경우 등

### 2. 1차원 경사하강법
#### 2.1 기본 아이디어

- 파라미터가 하나일 때(Θ ∈ ℝ), 함수 $f(\Theta)$의 그래프를 ‘언덕/골짜기’라고 생각.
- “현재 위치에서 **가장 가파르게 내려가는 방향(음의 기울기)** 으로 조금씩 이동”하는 알고리즘.

#### 2.2 1D 경사하강법 알고리즘

입력: 초기값 Θ_init, step size(learning rate) η, 함수 f, 미분 f′, 종료 기준 ε  
반복 업데이트: $$\Theta^{(t)} = \Theta^{(t-1)} - \eta f'(\Theta^{(t-1)})$$
- 알고리즘은 **연속 두 스텝의 함수값 차이**가 충분히 작아지면 종료: $$|f(\Theta^{(t)}) - f(\Theta^{(t-1)})| < \varepsilon$$

#### 2.3 종료 기준(Stopping Criteria)의 여러 가지

- 함수값 변화가 작을 때: $$|f(\Theta^{(t)}) - f(\Theta^{(t-1)})| < \varepsilon$$
- 파라미터 변화가 작을 때: $$|\Theta^{(t)} - \Theta^{(t-1)}| < \varepsilon$$
- 기울기가 작을 때: $$|f'(\Theta^{(t)})| < \varepsilon$$
- 혹은 **고정된 반복 횟수 T** 만큼만 수행하고 종료.

#### 2.4 수렴과 step size(η)의 역할

- **Convex + smooth** 함수이고 η가 충분히 작으면, 임의의 작은 거리 ε̃에 대해 **전역 최적점 주변까지 수렴**(Theorem 3.1.1).
- η가 너무
    - **작으면**: 매우 천천히 움직여 수렴이 느려짐.
    - **크면**: 최소점 주변에서 발산하거나 양 옆으로 튀면서 진동할 수 있음.

#### 2.5 Convex vs Non-convex

- **Convex 함수**: 두 점을 잇는 선분이 항상 그래프 위에 놓이는 함수 → 전역 최소점이 하나.
- **Non-convex 함수**:
    - local minimum이 여러 개 존재 가능.
    - gradient descent는 **초기값 x_init**에 따라 **서로 다른 local minimum**으로 수렴.

### 3. 다차원 경사하강법
#### 3.1 Gradient의 정의

- 파라미터 $\Theta \in \mathbb{R}^m$, 함수 $f: \mathbb{R}^m \to \mathbb{R}$
- Gradient:
    $$\nabla_\Theta f(\Theta) =  
    \begin{bmatrix}  
    \frac{\partial f}{\partial \Theta_1}\  
    \vdots\  
    \frac{\partial f}{\partial \Theta_m}  
    \end{bmatrix}$$

#### 3.2 다차원 업데이트 식

- 1D와 동일한 구조, 스칼라 기울기 대신 **벡터 gradient** 사용:  
    $$\Theta^{(t)} = \Theta^{(t-1)} - \eta \nabla_\Theta f(\Theta^{(t-1)})$$
- 종료 기준은 1D와 비슷하게:
    - 함수값 변화: $$|f(\Theta^{(t)}) - f(\Theta^{(t-1)})| < \varepsilon$$
    - 혹은 gradient norm $|\nabla_\Theta f(\Theta^{(t)})|$ 가 충분히 작을 때 등.

### 4. 회귀(regression)에의 적용
#### 4.1 선형 회귀 MSE loss에 대한 GD

- 선형 회귀의 평균제곱오차(MSE) 목적함수:  
    $$J(\theta) = \frac{1}{n}\sum_{i=1}^{n}(\theta^T x^{(i)} - y^{(i)})^2$$
- 행렬 형태 gradient: 
    $$\nabla_\theta J = \frac{2}{n} \tilde{X}^T(\tilde{X}\theta - \tilde{Y})$$
    (여기서 (\tilde{X})는 bias term이 포함된 디자인 행렬)
    
- GD 업데이트 (샘플 합 표현):
    $$\theta^{(t)} = \theta^{(t-1)} - \eta \frac{2}{n}\sum_{i=1}^{n}  
    \left(\left[\theta^{(t-1)}\right]^T x^{(i)} - y^{(i)} \right)x^{(i)}$$

> 이 문제는 정상적으로는 closed-form 해(정규방정식)로 풀 수 있지만, GD로도 수치적으로 해를 구할 수 있다는 점을 보여주는 예.

### 5. Ridge Regression에서의 Gradient Descent
#### 5.1 Ridge 목적함수

- Ridge Regression (L2 정규화 포함):
    $$J_{\text{ridge}}(\theta, \theta_0) =  
    \frac{1}{n}\sum_{i=1}^{n}(\theta^T x^{(i)} + \theta_0 - y^{(i)})^2 + \lambda |\theta|^2$$
- 여기서 θ는 weight, θ₀는 bias. L2 penalty는 θ에만 적용(θ₀에는 적용 X).

#### 5.2 Gradient 계산

- θ에 대한 gradient:  
    $$\nabla_\theta J_{\text{ridge}}(\theta, \theta_0) =  
    \frac{2}{n}\sum_{i=1}^{n}(\theta^T x^{(i)} + \theta_0 - y^{(i)})x^{(i)} + 2\lambda\theta$$
- θ₀에 대한 derivative:
    $$\frac{\partial J_{\text{ridge}}}{\partial \theta_0} =  
    \frac{2}{n}\sum_{i=1}^{n}(\theta^T x^{(i)} + \theta_0 - y^{(i)}$$

#### 5.3 Ridge용 GD 알고리즘

업데이트 규칙:
- θ 업데이트:
    $$\theta^{(t)} = \theta^{(t-1)} - \eta \left(  
    \frac{1}{n}\sum_{i=1}^{n}  
    (\theta^{(t-1)T} x^{(i)} + \theta_0^{(t-1)} y^{(i)})x^{(i)} \lambda \theta^{(t-1)}  
        \right)$$
- θ₀ 업데이트: 
    $$\theta_0^{(t)} = \theta_0^{(t-1)} - \eta \left(  
    \frac{1}{n}\sum_{i=1}^{n}  
    (\theta^{(t-1)T} x^{(i)} + \theta_0^{(t-1)} - y^{(i)})  
    \right)$$

> 질문 포인트로, 왜 θ₀ 업데이트 식에는 λ가 없고, 왜 gradient에 있던 2가 빠졌는지(η에 흡수 가능)를 생각해 보라고 유도함.

### 6. 확률적 경사하강법(Stochastic Gradient Descent, SGD)
#### 6.1 기본 아이디어

- 목적 함수가 데이터 포인트들의 합으로 표현되는 경우: $$f(\Theta) = \sum_{i=1}^n f_i(\Theta)$$
- Batch GD: 모든 샘플에 대한 gradient를 합한 뒤 한 번에 업데이트.
- **SGD**: 매 반복마다 **임의의 데이터 한 개(or 작은 미니배치)** 를 골라 해당 항의 gradient만 사용해서 업데이트.

#### 6.2 SGD 알고리즘

반복 t = 1 … T:
1. i ~ Uniform{1, …, n} 랜덤 선택
2. $$\Theta^{(t)} = \Theta^{(t-1)} - \eta^{(t)} \nabla_\Theta f_i(\Theta^{(t-1)})$$

- 여기서 step size η는 반복에 따라 달라지는 **η(t)** 를 사용.

#### 6.3 수렴 조건 (Theorem 3.4.1)

Convex 함수 f에 대해, step size 시퀀스 η(t)가 다음을 만족하면 SGD는 **확률 1로(optimal Θ에 almost surely)** 수렴:

$$\sum_{t=1}^{\infty}\eta^{(t)} = \infty, \quad  
\sum_{t=1}^{\infty}(\eta^{(t)})^2 < \infty$$

- 직관:
    - 첫 번째 조건: 충분히 멀리까지 탐색할 “총 이동거리” 보장.
    - 두 번째 조건: 시간이 지날수록 step이 점점 작아져서 수렴 가능.

실무에서는 보통 (\eta^{(t)} = 1/t) 같은 이상적인 스케줄보다 **더 천천히 줄어드는 스케줄**을 쓰기도 함(이론적인 수렴 조건은 만족 안 해도 실전 성능이 더 좋은 경우).

#### 6.4 SGD가 유리한 이유들

- **대규모 데이터**에서
    - BGD는 매 step마다 전체 데이터를 한 번 훑어야 함 → 느리고 메모리 부담.
    - SGD/mini-batch SGD는 일부 데이터만 보고도 충분히 좋은 방향으로 진행.
- **Non-convex** 함수에서
    - Noise가 local minimum/flat region에서 빠져나오는 데 도움을 줄 수 있음.
- **일반화 관점**
    - Training loss는 BGD가 더 잘 줄일 수 있어도,
    - SGD의 noisy update가 오히려 **overfitting을 줄이고 test 성능**을 좋게 만들 수 있음.

### 7. 정리: 이 챕터의 핵심 메시지

1. **Gradient Descent**
    - 해석적인 해를 구하기 어렵거나 비싸면, “기울기 방향으로 조금씩 내려가는” 단순한 알고리즘으로 최적값 근처를 찾을 수 있다.
2. **Convex vs Non-convex**
    - Convex: 어디서 시작해도 전역 최적 근처로 수렴 가능.
    - Non-convex: 초기값에 따라 서로 다른 local minimum으로 수렴.
3. **Learning Rate & Stopping**
    - η 선택, 종료 조건 설계가 **수렴 속도와 안정성**을 크게 좌우.
4. **Ridge Regression**
    - L2 정규화가 추가된 선형 회귀도 GD로 쉽게 최적화 가능.
5. **SGD**
    - 대규모 데이터, non-convex 최적화, 일반화 성능 측면에서 **딥러닝에서 사실상 표준**이 되는 알고리즘.