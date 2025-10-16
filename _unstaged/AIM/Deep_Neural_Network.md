# 심층 신경망 (Deep Neural Network, DNN)

여러 층(layer으로 구성된 인공 신경망(ANN)

## 1. 개념

- 신경망(Neural Network): 인간의 뇌 신경세포(뉴런, neuron)를 모방한 수학적 모델이다.
- 심층 신경망(Deep Neural Network, DNN): 이런 신경망이 여러 개의 층(layer)으로 깊게 쌓여 있는 형태이다.
> → “입력층(Input Layer) → 여러 개의 은닉층(Hidden Layers) → 출력층(Output Layer)” 구조로 이루어진 다층 퍼셉트론(Multilayer Perceptron)의 확장형이다.


## 2. 구조 요약

| 구분                      | 역할                                    |
| ----------------------- | ------------------------------------- |
| **입력층 (Input Layer)**   | 외부 데이터를 받는 층 (예: 이미지 픽셀, 문장의 단어 벡터 등) |
| **은닉층 (Hidden Layers)** | 입력을 점차 변환·추상화하여 의미 있는 특징(feature)을 추출 |
| **출력층 (Output Layer)**  | 최종 결과(예: 번역 문장, 분류 결과 등)를 산출          |
> 보통 은닉층이 3개 이상

## 3. 학습 방식

- **순전파(Forward Propagation)**: 입력 데이터를 각 층의 가중치(weight)와 활성 함수(activation function)를 통해 순차적으로 전달.
- **역전파(Backpropagation)**: 출력 결과와 실제 값의 차이(오차)를 계산하고, 그 오차를 반대로 전파시켜 **가중치(weight)** 를 조정.
- 반복 학습을 통해 입력과 출력의 관계를 점점 더 정교하게 모델링함.

## 4. 특징

|항목|설명|
|---|---|
|**복잡한 패턴 학습**|단순한 선형 모델이 표현할 수 없는 비선형 관계를 학습 가능|
|**자동 특징 추출**|사람이 직접 피처를 설계하지 않아도, 네트워크가 데이터로부터 스스로 특징을 학습|
|**대규모 데이터 활용**|데이터가 많을수록 더 정교한 표현 학습 가능|
|**다양한 아키텍처 확장**|CNN, RNN, LSTM, Transformer 등 모두 DNN의 특수 형태|

## 5. 예시

- **이미지 인식:** CNN(Convolutional Neural Network)
- **자연어 처리:** RNN, LSTM, GRU, Transformer
- **음성 인식:** Deep LSTM, CNN-RNN hybrid
- **생성 모델:** GAN, VAE, Diffusion Models