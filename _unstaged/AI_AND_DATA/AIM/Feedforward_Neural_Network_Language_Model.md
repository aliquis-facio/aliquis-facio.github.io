# Feedforward NNLM (Feedforward Neural Network Language Model, 전방향 신경망 언어모델)

**Word2Vec**과 **RNN 언어모델(LM)** 의 **기원(시작점)**

---

## 1. 기본 정의

**Feedforward NNLM**: **단어 시퀀스의 확률(문장의 자연스러움)을 예측하기 위해** **전방향 신경망(Feedforward Neural Network)** 을 사용하는 **언어 모델(Language Model)** 이다.

“이전 단어들이 주어졌을 때 다음 단어가 나올 확률”을 **신경망으로 학습**하는 모델
$$P(w_t | w_{t-1}, w_{t-2}, \dots, w_{t-n+1})$$

---

## 2. 언어 모델(Language Model, LM) 복습

언어모델의 목표: 문장의 확률을 계산
$$P(w_1, w_2, ..., w_T) = \prod_{t=1}^{T} P(w_t | w_1, w_2, ..., w_{t-1})$$

하지만 실제 문장은 길기 때문에, **n-gram 언어모델처럼 “최근 n개의 단어”만 사용**한다.
$$P(w_t | w_{t-1}, ..., w_{t-n+1})$$

---

## 3. 전통적 n-gram 모델의 한계

| 항목       | n-gram 언어모델의 문제          |
| -------- | ------------------------ |
| 데이터 희소성  | n이 커질수록 가능한 단어 조합 폭발적 증가 |
| 일반화 부족   | 새로운 단어 조합은 확률 0으로 처리     |
| 문맥 이해 부족 | 단순 빈도 기반이라 의미적 관계 학습 불가  |

이를 해결하기 위해 **Neural Network 기반 언어 모델(NNLM)** 이 등장

---

## 4️. Feedforward NNLM의 구조 (Bengio et al., 2003)

**Bengio et al., 2003** 논문 *“A Neural Probabilistic Language Model”* 에서 처음 제안된 방식

### 4.1. 입력: n개의 이전 단어

각 단어는 **원-핫 벡터(one-hot vector)** 로 표현되고, **임베딩 행렬(Embedding Matrix)** 을 통해 밀집 벡터로 변환된다.
$$x_t = [E(w_{t-n+1}), E(w_{t-n+2}), ..., E(w_{t-1})]$$
→ 각 단어 벡터를 이어붙인(concatenate) 하나의 입력 벡터로 만듭니다.

### 4.2. 은닉층 (Hidden Layer)

$$h = \tanh(W_h x_t + b_h)$$
- 입력 단어들의 의미적 패턴을 학습하는 비선형 층
- **Feedforward** 구조이므로 “시간에 따른 순환 없음” (RNN 아님)

### 4.3. 출력층 (Softmax Layer)

$$P(w_t | w_{t-1}, ..., w_{t-n+1}) = \text{Softmax}(W_o h + b_o)$$

→ 각 단어가 다음 단어가 될 확률을 예측

### 4.4. 학습

손실 함수: **Cross-Entropy Loss**
$$L = -\log P(w_t = w_{\text{true}} | \text{context})$$

→ 예측된 확률이 실제 단어에 가까워지도록 가중치(W)를 학습한다.

---

## 5. Feedforward NNLM의 동작 요약

```
입력 단어들 → 임베딩 → 결합(Concat) → 은닉층(비선형) → Softmax → 다음 단어 확률
```

“이전 단어 몇 개를 보고, 다음 단어의 확률을 예측하는 완전연결 신경망”

---

## 6. 수식 정리

$$\begin{aligned}  
x_t &= [E(w_{t-n+1}), ..., E(w_{t-1})] \\
h &= f(W_h x_t + b_h) \\
y &= \text{Softmax}(W_o h + b_o)
\end{aligned}$$
- $E(\cdot)$: 임베딩 벡터
- $f$: 비선형 활성화 함수 (tanh, ReLU 등)
- $y$: 단어 확률 분포

---

## 7. 한계점

|한계|설명|
|---|---|
|**고정된 입력 길이**|n개의 단어만 참조 가능 (장기 문맥 반영 불가)|
|**계산량 큼**|Softmax 계산 복잡도 (O(V)) (단어 수가 수만 개)|
|**시퀀스 정보 부족**|시간적 의존성(Long-term dependency) 학습 불가능|

→ **RNN 기반 NNLM**(Recurrent Neural Network Language Model, 2010 이후)이 등장했다.