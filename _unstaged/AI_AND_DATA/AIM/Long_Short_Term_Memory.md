# Long Short-Term Memory, LSTM

[RNN(Recurrent Neural Network, 순환 신경망)](AIM/Recurrent_Neural_Network.md)의 한 종류로, “시퀀스 데이터”; 즉, 순서가 중요한 데이터를 처리하는 데 특화된 신경망 구조이다.

## 1. 기본 정의

**LSTM(Long Short-Term Memory)**: “긴 시퀀스에서도 정보를 오래 기억하고, 불필요한 것은 잊을 수 있는 RNN 구조”
- **기억(memory)** 과 **망각(forget)** 을 스스로 조절할 수 있는 RNN이다.
- 기존 RNN이 가지는 **장기 의존성 문제(long-term dependency problem)** 를 해결하기 위해 고안되었다.

---

## 2. 등장 배경 — RNN의 한계

### 2.1. RNN(Recurrent Neural Network)

- 시퀀스 데이터를 처리할 때, 이전 시점의 정보를 다음 시점에 전달.
- $$h_t = f(Wx_t + Uh_{t-1} + b)$$
- 문제: 시퀀스가 길어질수록 **이전 정보가 점점 사라짐** → “**기울기 소실(vanishing gradient)**”  → 긴 문장이나 긴 문맥을 기억하지 못함

### 2.2. LSTM의 등장

- 1997년, **Hochreiter & Schmidhuber** 가 제안
- 핵심 아이디어: RNN에 **기억 셀(cell state)** 과 **게이트(gate)** 구조를 추가해서 “정보를 얼마나 기억할지 / 잊을지 / 출력할지” 스스로 조절하게 함

---

## 3. LSTM의 구조

LSTM은 내부에 세 가지 게이트와 하나의 셀 상태(cell state)를 가집니다.

```
입력 x_t → [입력 게이트, 망각 게이트, 출력 게이트] → 셀 상태 → 출력 h_t
```

### 3.1. 망각 게이트 (Forget Gate)

- 이전 상태 중 **어떤 정보를 버릴지 결정**
-   $$f_t = \sigma(W_f \cdot [h_{t-1}, x_t] + b_f)$$
	- $f_t$ 값이 0이면 잊고, 1이면 유지

### 3.2. 입력 게이트 (Input Gate)

- **새로운 정보 중 무엇을 저장할지 결정**
	- $$i_t = \sigma(W_i \cdot [h_{t-1}, x_t] + b_i)$$
	- $$\tilde{C}_t = \tanh(W_C \cdot [h_{t-1}, x_t] + b_C)  $$

### 3.3. 셀 상태 업데이트 (Cell State)

- 이전 기억과 새로운 정보를 결합하여 업데이트
	- $$C_t = f_t * C_{t-1} + i_t * \tilde{C}_t$$

### 3.4. 출력 게이트 (Output Gate)

- 현재 상태에서 **어떤 정보를 출력으로 보낼지 결정**
	- $$o_t = \sigma(W_o \cdot [h_{t-1}, x_t] + b_o)$$
	- $$h_t = o_t * \tanh(C_t)$$

---

## 4. 핵심 작동 원리 요약

1. **Forget Gate:** 이전 정보 중 불필요한 것 제거
2. **Input Gate:** 새로운 입력 중 중요한 것 선택
3. **Cell Update:** 기억 셀($C_t$)에 저장
4. **Output Gate:** 필요한 정보만 다음 시점으로 전달

→ **필요한 정보는 오래 유지하고**, **불필요한 정보는 잊음**으로써 긴 문맥(예: 문장, 문단, 대화 맥락)을 안정적으로 처리

---

## 5. 장점

- **장기 의존성(Long-term dependency) 처리 가능**
- **Gradient vanishing 문제 해결**
- **문맥 기억력(Contextual memory)** 향상
- **NLP, 음성, 시계열 등 다양한 시퀀스 작업에 적용 가능**

---

## 6. 주요 응용 분야

|분야|예시|
|---|---|
|**기계 번역**|Seq2Seq 모델의 Encoder–Decoder 구조 (입력 → 번역문)|
|**음성 인식**|음성 → 텍스트 변환 (DeepSpeech 등)|
|**텍스트 생성**|문장 생성, 챗봇 응답|
|**시계열 분석**|주가 예측, 센서 데이터 예측|
|**감정 분석**|문장의 감정(긍정/부정) 분류|

---

## 7. 변형 모델들

|모델|특징|
|---|---|
|**GRU (Gated Recurrent Unit)**|LSTM보다 간단한 구조, 유사한 성능|
|**Bi-LSTM (Bidirectional LSTM)**|앞뒤 문맥을 모두 반영|
|**Stacked LSTM (Deep LSTM)**|여러 LSTM 층을 쌓아 더 깊은 표현 학습|
