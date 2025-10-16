# OOV(Out of Vocabulary)

**“어휘 사전에 없는 단어”**

---

## 1. 기본 정의

**OOV (Out-of-Vocabulary)**: “모델이 학습 과정에서 한 번도 본 적 없는 단어(혹은 토큰)”, 모델이 학습할 때 사용된 **어휘집(vocabulary)** 에 포함되지 않은 단어를 의미한다.

예를 들어, 모델의 학습 어휘가 {apple, banana, orange} 라면 테스트 문장에서 “grape”이 등장할 경우 → **OOV 단어**

---

## 2. 왜 OOV 문제가 생길까?

자연어는 **무한한 단어 조합**을 가집니다.
- 새 단어가 계속 만들어짐 (예: 신조어, 이름, 브랜드명 등)
- 오탈자, 줄임말, 다른 언어 혼용 등  → 학습 데이터에 없는 단어가 새롭게 등장할 수밖에 없습니다.

따라서, 모델이 학습할 때 정의된 **고정된 어휘집(vocabulary)** 밖의 단어가 나타나면 그 단어를 인식하거나 의미를 이해하지 못하게 됩니다.

---

## 3. 예시

### 3.1. 예시 문장

```
학습 어휘: {I, love, cats}
테스트 문장: I love dogs
```

- “dogs”는 학습 중 등장하지 않았기 때문에 **OOV 단어**
- 전통적인 모델은 이 단어를 **UNK (unknown)** 으로 대체
	- `I love UNK`

---

## 4. OOV가 문제가 되는 이유

|문제|설명|
|---|---|
|**의미 손실**|“UNK”로 대체되면 문장의 의미가 흐려짐|
|**번역 오류**|번역 모델에서는 OOV 단어가 빠지거나 잘못 번역됨|
|**정확도 저하**|텍스트 분류, 감정 분석 등에서 성능 저하|
|**단어 표현 한계**|새로운 단어의 의미를 기존 단어로부터 유추 불가|

---

## 5. OOV 문제 해결 방법

### 5.1. UNK 토큰 사용

- OOV 단어를 **“UNK”(unknown)** 으로 통일
- 가장 단순하지만 정보 손실 큼

### 5.2. 서브워드(Subword) 분해

- 단어를 더 작은 단위로 쪼개서 표현 → **WordPiece, BPE(Byte Pair Encoding)**
- 예: 
	- `"unhappiness" → "un" + "happy" + "ness"`
	- `"grapefruit"  → "grape" + "fruit"`
- 새로운 단어도 구성요소(subword) 단위로 이해 가능

### 5.3. 문자(Character) 또는 음절 기반 모델

- 단어 단위가 아닌 **문자 단위로 학습**
- 완전한 OOV 없음
- 예: CNN-char, CharRNN 등

### 5.4. 임베딩 확장 (Pre-trained Embeddings)

- Word2Vec, GloVe, FastText 등 **대규모 사전 학습 임베딩** 사용
- 학습에 없던 단어도 의미 공간에서 근사값으로 표현 가능

### 5.5. 최근 방법: SentencePiece, BERT 토크나이저

- BERT, GPT 등은 단어를 **WordPiece 단위**로 분절(tokenize)
- 사실상 **OOV가 거의 사라짐**

---

## 6. OOV 관련 예시 — BLEU 평가에서의 영향

기계 번역 시스템에서 모델의 출력 중 **OOV 단어가 “UNK”로 표시**되면, 참조 번역(reference)과 일치하지 않아 BLEU 점수 ↓
```
Reference: I love dogs
Output:    I love UNK   → BLEU 낮음
```
