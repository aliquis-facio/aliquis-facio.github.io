# Bilingual_Evaluation_Understudy_Score(BLEU 점수)

**기계 번역(Machine Translation)** 또는 **텍스트 생성 모델**의 **출력 품질을 자동으로 평가하는 대표적인 지표**
기계가 번역한 문장이 사람(정답)이 번역한 문장과 얼마나 유사한지를 수치로 나타낸 점수”

## 1. 정의

**BLEU (Bilingual Evaluation Understudy)**: “기계 번역의 품질을 평가하기 위한 자동 평가 지표” (Papineni et al., 2002, IBM Research)

- BLEU는 사람이 번역한 **참조(reference) 문장**과 기계가 번역한 **후보(candidate) 문장**을 비교하여 **정확도(precision)** 기반으로 유사도를 계산합니다.
- 점수는 **0 ~ 1 (또는 0 ~ 100%)** 사이의 값이며, 높을수록 기계 번역이 사람 번역과 더 비슷하다는 뜻입니다.

---

## 2. 핵심 아이디어

BLEU는 단어 단위가 아닌 **n-그램(n-gram)** 기반으로 유사도를 계산합니다.

예를 들어,

```
Reference: the cat is on the mat  
Candidate: the cat sat on the mat
```

- **1-gram (단어 수준)**
    → 일치율: the, cat, on, the, mat → 5 중 4개 일치 → 0.8
- **2-gram (단어쌍 수준)**
    → (the cat), (cat is), (is on), (on the), (the mat) 중  
    후보 문장에는 (the cat), (on the), (the mat) → 3/5 일치 → 0.6
이처럼 여러 n-그램 단위(보통 1~4-gram)를 종합해 문맥 수준의 일치를 측정합니다.

---

## 3. 수식 표현

BLEU 점수는 다음과 같이 계산됩니다:
$$BLEU = BP \times \exp\left(\sum_{n=1}^N w_n \log p_n\right)$$

### 3.1. 구성 요소:

| 기호    | 의미                                  |
| ----- | ----------------------------------- |
| $p_n$ | n-그램 정밀도(precision): n-그램 단위에서의 일치율 |
| $w_n$ | 각 n-그램의 가중치 (보통 (w_n = 1/N))        |
| $BP$  | **Brevity Penalty (길이 보정항)**        |
| $N$   | 고려하는 n-그램 최대 길이 (보통 N=4)            |

---

### 🔸 Brevity Penalty (BP, 길이 보정)

짧은 번역이 높은 정밀도를 얻는 문제를 막기 위해 도입된 보정 항입니다.

$$BP = \begin{cases}
1 & \text{if } c > r \\
e^{(1 - \frac{r}{c})} & \text{if } c \le r
\end{cases}$$

- $c$: 후보 번역의 길이 (candidate length)
- $r$: 참조 번역의 길이 (reference length)
- 후보 문장이 너무 짧으면 패널티 부여

---

## 4. 점수 해석

| BLEU 점수   | 품질 해석                   |
| --------- | ----------------------- |
| **> 50**  | 사람 수준에 근접한 매우 좋은 번역     |
| **30–50** | 좋은 번역 (대체로 자연스러움)       |
| **10–30** | 중간 수준 (의미는 전달되나 부자연스러움) |
| **< 10**  | 품질 낮음 (잘못된 번역 다수)       |
| **0**     | 완전히 실패한 번역              |

BLEU는 절대적인 점수라기보다는 **“비교용 지표”** 로 사용된다.
즉, “모델 A가 모델 B보다 BLEU가 높다” → **A가 더 좋은 번역 품질을 보임**.

---

## 5. 특징 정리

|항목|설명|
|---|---|
|**장점**|계산이 빠르고, 사람이 평가한 품질과 상관관계가 높음|
|**단점**|의미적 유사도는 반영 못함 (단어 순서·동의어 무시)|
|**측정 단위**|보통 1~4-gram|
|**평가 기준**|n-그램 일치율 + 길이 보정(BP)|
|**대표 사용처**|기계 번역, 텍스트 요약, 대화 생성 등|

---

## 6. 예시로 보는 BLEU 점수 비교

|Reference|Candidate|BLEU 결과|
|---|---|---|
|“I love dogs.”|“I love dogs.”|100.0|
|“I love dogs.”|“I like dogs.”|약 70.0|
|“I love dogs.”|“Dogs are loved.”|약 30.0|
|“I love dogs.”|“Cats are great.”|0.0|
