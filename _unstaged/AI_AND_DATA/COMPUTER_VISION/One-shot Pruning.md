# 🪓 One-shot Pruning이란?

**One-shot pruning(원샷 가지치기)** 은  
신경망 모델을 **한 번에 크게 압축(prune)** 하는 방식으로,  
**훈련 중간에 반복적인 prune → 재학습 과정을 거치지 않는다**는 것이 핵심이다.

## 🔍 1. 개념

One-shot pruning은 **사전 훈련된 모델(pretrained model)**에서  
중요도가 낮은 가중치(혹은 채널·필터)를 **한 번에 제거(prune)**한 뒤,  
**필요하면 짧게 fine-tuning만 수행하는 방법**이다.

즉,

```
1) 모델 완전 학습
2) 중요도 측정(weight magnitude 등)
3) 한 번에 top-K%를 잘라냄
4) (선택) 짧게 fine-tuning
```

정확하게 **딱 한 번만 pruning을 수행하는 방식**이라는 점이 특징이다.

## 🧠 2. Pruning의 종류와 비교

### 🔹 One-shot pruning

- **한 번의 pruning**
- 훈련 중간 반복 과정 없음
- 단순하고 빠름
- 하지만 모델이 크게 손상될 위험이 존재

### 🔹 Iterative pruning(점진적/반복적 가지치기)

- **여러 단계**에 걸쳐 조금씩 prune
- 각 단계마다 **retraining** 포함
- 정확도가 잘 유지됨
- 하지만 계산 비용 많음

### 🔹 Once-for-all pruning과 혼동 주의

One-shot pruning ≠ Once-for-all 모델(OFA)

One-shot pruning은 단순히 모델의 파라미터를 한 번에 줄이는 것이고  
OFA는 서로 다른 크기의 서브넷을 뽑아 쓰는 모델 구조를 의미한다.

## ⚙️ 3. One-shot pruning 방법

### 1) Weight magnitude pruning (가장 흔함)

가중치의 절댓값이 작은 순으로 제거  
→ 작은 값은 모델 출력에 기여가 적다고 가정

### 2) Structured pruning (필터/채널 단위)

CNN에서 필터 중요도를 측정해 필터 단위로 삭제  
→ 더 높은 속도 향상 가능

### 3) Sensitivity-based pruning

레이어별 sensitivity를 측정 후 레이어별로 다른 비율로 prune

## 📈 4. 장단점

### 👍 장점

- 매우 빠름 (one-shot이므로)
- 구현 간단
- baseline 압축 테스트에 적합

### 👎 단점

- 정확도 손실이 클 수 있음  
    (모델이 무리하게 한 번에 큰 변화를 겪기 때문)
- 반복적 pruning보다 결과가 좋지 않은 경우가 많음

## 🚀 5. 언제 쓰는가?

- 모델을 **빠르게 가볍게 만들고 싶을 때**
- 여러 pruning 전략을 비교하기 위한 baseline
- edge-device 배포를 위한 단순 모델 최적화
- 학습비용이 부족해 반복적 pruning이 어려울 때