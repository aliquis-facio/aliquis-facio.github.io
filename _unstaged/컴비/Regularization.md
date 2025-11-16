## 5. Regularization

### 1. 뉴럴넷 복습

- **이전:** 선형 분류기  
    [  
    f(x) = w^\top x + b  
    ]  
    한 번의 선형 변환으로 점수를 계산하는 모델.
    
- **지금:** 2-layer / multi-layer Neural Network
    
    - 예: 2-layer  
        [  
        h = \sigma(W_1 x + b_1), \quad s = W_2 h + b_2  
        ]
        
    - 실제로는 보통 **각 레이어마다 bias**를 둔다.
        
    - **Depth(깊이)**: 레이어 개수
        
    - **Width(폭)**: 각 레이어의 뉴런 수(차원)
        
- **Loss function** 복습:
    
    - 한 샘플에 대한 손실: (L(f(x_i), y_i))
        
    - 데이터셋에 대한 손실:  
        [  
        \text{Loss} = \frac{1}{n}\sum_{i=1}^n L(f(x_i), y_i)  
        ]
        
    - 손실이 작을수록 좋은 분류기.
        

---

### 2. 과적합과 정규화 개념 (슬라이드 6~12)

#### (1) Overfitting

- **과적합(Overfitting)**: 모델 용량(capacity)이 너무 커서 **데이터의 노이즈까지 학습**해 버리는 현상.
    
- 훈련 데이터에선 성능이 매우 좋지만, **테스트/검증 데이터에서 성능이 나빠짐** → 일반화 실패.
    

#### (2) Regularization 아이디어

- 우리가 최소화하는 건 원래:  
    [  
    \min_{w,b} \text{loss}(w,b)  
    ]  
    (훈련 데이터 기준)
    
- **정규화(Regularization)**:
    
    - 손실에 **추가 항(regularizer)을 더한 것**:  
        [  
        \min_{w,b} \ \text{loss}(w,b) + \lambda ,\text{regularizer}(w,b)  
        ]
        
    - (\lambda): 정규화 세기(hyperparameter) – regularization term의 비중 조절.
        
- **정규화의 목적**
    
    - 단순히 “훈련오차 최소” 이상으로, **우리가 선호하는 형태의 모델**을 학습하도록 편향(bias)을 줌.
        
    - **Overfitting 방지**: 더 단순한 모델(작은 weight, sparse한 weight 등)을 선호.
        
    - Loss landscape에 **곡률(curvature)**를 추가하여 **최적화가 더 잘 되게** 도와주기도 함.
        

---

### 3. L2 / L1 Regularization과 Weight Decay (슬라이드 11~25)

#### (1) Regularizer의 기본 생각

- 보통 “너무 큰 weight”를 원치 않는다:
    
    - weight가 크면 입력 feature의 작은 변화가 출력에 큰 영향을 미침 → 불안정한 모델.
        
    - 쓸모없는 feature는 **weight를 0**으로 만드는 것이 좋을 수 있음.
        

#### (2) L2 정규화 (Weight Decay, Ridge)

- **정의:**  
    [  
    \mathcal{L}_\text{reg}(\theta) = \mathcal{L}(\theta) + \lambda \sum_k \theta_k^2  
    ]  
    모든 weight에 대해 제곱합을 패널티로 추가.
    
- **Gradient descent 업데이트:**  
    [  
    w_j = w_j + \eta \sum_i y_i x_{ij} \exp(-y_i(w^\top x_i + b)) - \eta \lambda w_j  
    ]  
    (예시: exponential loss + L2 regularization)
    
- **해석:**
    
    - 뒤쪽의 (-\eta \lambda w_j) 항 때문에,
        
        - (w_j>0)이면 감소,
            
        - (w_j<0)이면 증가 → **항상 0 쪽으로 끌려감**.
            
    - weight 크기에 비례해서 줄어드는 **“weight decay”** 효과.
        
- **(\lambda)의 역할:**
    
    - (\lambda)가 크면 큰 weight에 대한 패널티가 커짐 → 더 강하게 0으로 수축.
        

#### (3) L1 정규화 (Lasso)

- **정의:**  
    [  
    \mathcal{L}_\text{reg}(\theta) = \mathcal{L}(\theta) + \lambda \sum_k |\theta_k|  
    ]
    
- gradient는 sign을 사용:  
    [  
    \frac{\partial}{\partial w_j} \mathcal{L}_\text{reg}  
    = -\sum_i y_i x_{ij} \exp(-y_i(w^\top x_i + b)) + \lambda ,\text{sign}(w_j)  
    ]  
    
- 업데이트:  
    [  
    w_j = w_j +\eta \sum_i y_i x_{ij}\exp(-y_i(w^\top x_i + b)) - \eta\lambda ,\text{sign}(w_j)  
    ]
    
- **효과:**
    
    - (w_j>0): 일정 값만큼 감소
        
    - (w_j<0): 일정 값만큼 증가  
        → **크기와 상관없이 0 방향으로 일정 속도로 당김**  
        → 많은 weight를 정확히 0으로 만들어 **sparse 모델**을 만드는 경향.
        

#### (4) Elastic Net

- **L1 + L2를 섞은 정규화:**  
    [  
    \mathcal{L}_\text{reg}(\theta) =  
    \mathcal{L}(\theta) + \lambda_1 \sum_k |\theta_k| + \lambda_2 \sum_k \theta_k^2  
    ]
    
- L1의 **희소성(sparsity)** + L2의 **안정성(stability)**을 동시에 얻고자 할 때 사용.
    

---

### 4. 모델 기반 ML 관점에서의 정규화 (슬라이드 16~21)

- **모델 기반 ML의 3단계**
    
    1. 모델 선택 (예: linear classifier, neural network 등)
        
    2. 최적화할 **목표 함수(objective)** 선택
        
    3. 그 목표를 최소화하는 **학습 알고리즘** 설계
        
- 예: logistic-like loss + L2 정규화  
    [  
    \min_{w,b} \sum_{i=1}^n \exp(-y_i(w^\top x_i + b)) + \frac{\lambda}{2}|w|^2  
    ]
    
    - 앞 항: **데이터 손실** – 예측이 라벨과 다른 정도를 패널티.
        
    - 뒤 항: **정규화 항** – 큰 weight를 패널티.
        
- 이 목적 함수는 **convex**라서 gradient descent로 최적화가 가능함(선형모델 기준).
    

---

### 5. Dropout & Early Stopping (슬라이드 30~32)

#### (1) Dropout

- **훈련 시**, 각 미니배치마다 뉴런(유닛)을 **확률적으로 끔**:
    
    - 각 유닛은 dropout rate (p)로 제거(또는 (1-p)로 유지).
        
    - 일반적으로 **20~50% 정도**를 drop.
        
- **효과:**
    
    - 매 미니배치마다 **조금씩 다른 구조의 네트워크**를 학습하는 것과 같음 → 일종의 **앙상블(ensemble)** 효과.
        
    - 특정 뉴런/경로에 의존하는 것을 막고, 보다 **robust한 표현**을 학습.
        

#### (2) Early Stopping

- 훈련 시 **validation set**을 별도로 모니터링:
    
    - 예: train:val = 75:25
        
    - validation loss/accuracy가 **n epoch 연속으로 개선되지 않으면 중단** (patience = n).
        
- 너무 오래 학습해서 **train에 과적합**되는 것을 방지하는, 또 다른 형태의 regularization으로 해석 가능.
    

---

### 6. 행렬 연산 관점의 뉴럴넷 (슬라이드 26~29)

- **단일 레이어**:  
    [  
    a_1 = \sigma(W_1 x + b_1)  
    ]
    
    - (x): 입력 벡터
        
    - (W_1): weight matrix
        
    - (b_1): bias 벡터
        
    - (a_1): 출력(activation) 벡터
        
- **다층 네트워크 전체**:  
    [  
    \begin{aligned}  
    a_1 &= \sigma(W_1 x + b_1) \  
    a_2 &= \sigma(W_2 a_1 + b_2) \  
    &;;\vdots \  
    y &= a_L = f(x)  
    \end{aligned}  
    ]  
    행렬 연산으로 쓰면 **벡터화/배치 연산**이 가능해서, 실제 구현에서 매우 중요함.
    

---

### 7. 활성화 함수 & 뉴런 (슬라이드 33~39)

#### (1) 활성화 함수 (Activation Function)

- **ReLU**: (\text{ReLU}(x) = \max(0, x)) – 기본 선택(default)으로 많이 사용.
    
- 그 외:
    
    - Sigmoid
        
    - tanh
        
    - Leaky ReLU
        
    - Maxout
        
    - ELU 등
        
- **활성화 함수가 없다면?**
    
    - 레이어를 여러 개 쌓아도 모두 선형 변환의 합성 → 결국 **하나의 선형 분류기와 동일** (표현력이 증가하지 않음).
        

#### (2) 생물학적 뉴런과 비교

- 뇌의 뉴런:
    
    - 여러 입력(dendrite)이 들어와 가중 합 → cell body에서 비선형 “발화” 결정 → axon을 통해 신호 전파.
        
- 인공 뉴런:
    
    - (z = w^\top x + b) (가중합)
        
    - (a = \sigma(z)) (비선형 활성화)  
        → 생물학적 뉴런의 “firing rate의 비선형 함수”를 수학적으로 흉내 낸 것.
        

---

### 한 번에 정리해 보면

- **Regularization = “훈련오차 + 제약”**  
    → 단순히 훈련 데이터에 맞추는 것뿐 아니라, **일반화가 잘 되는 단순한 모델**을 선호하게 만드는 장치.
    
- **L2 (weight decay)**: weight를 크기에 비례해 0 쪽으로 끌어당김 → 부드럽게 수축.
    
- **L1**: weight를 일정 속도로 0 쪽으로 끌어당김 → 많은 weight를 0으로 만들어 **sparse 모델**을 만듦.
    
- **Dropout, Early Stopping**도 넓은 의미의 정규화 기법.
    
- **활성화 함수**와 **행렬 연산** 구조까지 포함해서 신경망 전체가,  
    “모델 + 손실 + 정규화 + 최적화”의 조합으로 이해되도록 정리한 슬라이드라고 보면 됩니다.