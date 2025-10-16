# [논문 리뷰] Sequence to Sequence Learning with Neural Networks

논문 링크: <https://arxiv.org/abs/1409.3215>
## Abstract 초록

[심층 신경망(DNN, Deep Neural Networks)](AIM/Deep_Neural_Network.md)은 강력한 모델로서 어려운 학습 과제들에서 탁월한 성능을 보여왔다. 하지만 DNN은 대규모의 라벨링된 학습 데이터가 있을 때에만 잘 작동하며, **[시퀀스](AIM/Sequence.md)를 시퀀스로 직접 매핑하는 문제**는 그대로 적용하기 어렵다.

이 논문에서는 **시퀀스 학습을 위한 일반적인 [엔드 투 엔드 접근법](AIM/End_to_End_Approach.md)** 을 제안한다. 이 접근법은 시퀀스 구조에 대해 최소한의 가정만 한다. 구체적으로, 입력 시퀀스를 고정 차원의 벡터로 변환하기 위해 다층 [LSTM(Long Short-Term Memory)](AIM/Long_Short_Term_Memory.md)을 사용하고, 그 벡터로부터 목표 시퀀스를 디코딩하기 위해 또 다른 심층 LSTM을 사용한다.

주요 결과는 다음과 같다. **영어–프랑스어 번역(WMT’14 데이터셋)** 에서 LSTM이 생성한 번역은 [BLEU 점수](AIM/BLEU_Score.md) 34.8을 기록했다. 이는 [OOV(Out-of-Vocabulary)](AIM/Out_of_Vocabulary.md) 단어에 대해 불이익을 받은 점수를 포함한 결과이며, 동시에 LSTM은 긴 문장에서도 큰 어려움을 겪지 않았다. 비교를 위해, 구문 기반 SMT 시스템은 같은 데이터셋에서 BLEU 33.3을 기록했다. 또한 LSTM을 사용해 기존 SMT 시스템의 1,000개 후보를 리랭킹하였을 때 BLEU 점수는 36.5로 향상되어, 이 과제에서 이전 최고 성능에 근접했다.

아울러, LSTM은 **단어 순서에 민감하면서도 능동태/수동태 변환에는 비교적 불변한 문구 및 문장 표현**을 학습했다. 마지막으로, 입력 문장의 단어 순서를 모두 반대로 뒤집는 간단한 기법(단, 출력 문장은 뒤집지 않음)이 성능을 크게 향상시켰는데, 이는 소스와 타깃 문장 사이의 단기 의존성을 증가시켜 최적화 문제를 더 쉽게 만들었기 때문이다.

<font color="#ff0000"><b>엔드투엔드 LSTM 기반 Seq2Seq 모델</b>을 제안하고, 기계 번역에서 SMT보다 우수하거나 경쟁력 있는 성능을 보여주었으며, <b>긴 문장 처리와 표현 학습의 강점</b>을 입증</font>

---
## 1. Introduction 서론

**심층 신경망(DNN, Deep Neural Networks) 은 음성 인식, 시각 객체 인식 등과 같은 어려운 문제들에서 뛰어난 성능을 달성한 매우 강력한 기계 학습 모델이다.** DNN이 강력한 이유는 소수의 단계에서 임의의 병렬 연산을 수행할 수 있기 때문이다. DNN의 강력함을 보여주는 놀라운 예는, 단지 2개의 은닉층(각각은 이차적 크기)을 사용해 [N-비트 숫자](AIM/N_bit_Number.md)들을 정렬할 수 있다는 점이다. 따라서 신경망은 전통적인 통계 모델과 관련이 있지만, 매우 정교한 계산을 학습한다. 게다가 충분한 라벨이 있는 훈련 데이터셋이 존재한다면, 대규모 DNN을 지도학습 역전파로 훈련시킬 수 있다. 즉, 만약 어떤 대규모 DNN의 파라미터 설정이 좋은 결과를 낼 수 있다면(예를 들어 인간이 해당 작업을 매우 빠르게 해결할 수 있기 때문에), 지도 역전파는 이러한 파라미터를 찾아내고 문제를 해결할 수 있다.

그러나 이러한 유연성과 강력함에도 불구하고, **DNN은 입력과 출력이 고정 차원의 벡터로 합리적으로 인코딩될 수 있는 문제에만 적용될 수 있다.** 이는 중요한 제약이다. **왜냐하면 많은 중요한 문제들이 사전에 길이를 알 수 없는 시퀀스로 가장 잘 표현되기 때문이다.** 예를 들어, 음성 인식과 기계 번역은 대표적인 순차적 문제다. 마찬가지로, 질문 응답 또한 질문을 나타내는 단어 시퀀스를 답변을 나타내는 단어 시퀀스로 매핑하는 문제로 볼 수 있다. 따라서 도메인에 독립적인, 시퀀스를 시퀀스로 매핑하는 방법을 학습하는 기법이 분명히 유용할 것이다.

<font color="#ff0000">1. 배경</font>
	- <font color="#ff0000"><b>심층 신경망(DNN)</b> 은 음성 인식, 이미지 인식 등에서 뛰어난 성능 입증.</font>
	- <font color="#ff0000">그러나 <b>고정된 차원의 입력·출력 벡터</b> 필요로 하는 제약이 있어, 길이가 가변적인 <b>시퀀스 데이터(예: 기계 번역, 음성 인식, 질의응답)</b> 처리에는 한계.</font>

2. <font color="#ff0000">문제 정의</font>
	- <font color="#ff0000">시퀀스를 시퀀스로 매핑하는 <b>일반적인 방법</b>이 필요.</font>
	- <font color="#ff0000">핵심 어려움: 입력 시퀀스와 출력 시퀀스의 길이가 다르며, 길이를 사전에 알 수 없음.</font>

시퀀스는 DNN에게 도전적인 문제다. 왜냐하면 입력과 출력의 차원이 알려져 있고 고정되어 있어야 하기 때문이다. 본 논문에서는 **LSTM(Long Short-Term Memory) 아키텍처를 직접 적용**함으로써 일반적인 시퀀스-투-시퀀스 문제를 해결할 수 있음을 보인다. 핵심 아이디어는 **하나의 LSTM을 사용해 입력 시퀀스를 한 시점씩 읽어 고차원 고정 벡터 표현을 얻고, 또 다른 LSTM을 사용해 그 벡터로부터 출력 시퀀스를 추출하는 것**이다 (그림 1 참고). **두 번째 LSTM은 본질적으로 입력 시퀀스에 조건화된 순환 신경망 언어 모델**이다. LSTM이 **[장기 의존성](AIM/Long_Term_Dependency.md)을 가진 데이터에서 성공적으로 학습할 수 있는 능력**은 입력과 출력 사이에 상당한 시간 지연이 존재하는 본 응용에 자연스럽게 적합하다 (그림 1 참고).

![[2025-10-01-2.png]]
> 그림1

3. <font color="#ff0000">제안 방법</font>
	- <font color="#ff0000"><b>LSTM(Long Short-Term Memory)</b> 기반 모델 제안.</font>
	    - <font color="#ff0000">첫 번째 LSTM: 입력 시퀀스를 읽어 <b>고정 길이 벡터</b>로 인코딩.</font>
	    - <font color="#ff0000">두 번째 LSTM: 그 벡터로부터 <b>출력 시퀀스를 생성</b>.</font>
	- <font color="#ff0000">두 번째 LSTM은 사실상 <b>조건부 RNN 언어 모델</b>처럼 동작.</font>
	- <font color="#ff0000">LSTM의 장점: 장기 의존성(Long-term dependency)을 학습할 수 있어 시퀀스 번역에 적합.</font>

시퀀스-투-시퀀스 학습 문제를 신경망으로 해결하려는 시도가 이미 여러 차례 있었다. 본 연구는 **Kalchbrenner와 Blunsom**의 연구와 밀접하게 관련되어 있는데, 이들은 처음으로 전체 입력 문장을 벡터로 매핑하였다. 또한 **Cho et al.** 의 연구와도 관련이 있는데, 그들의 방법은 구문 기반 시스템이 생성한 가설을 다시 점수화하는 데에만 사용되었다. **Graves** 는 신경망이 입력의 여러 부분에 집중할 수 있도록 하는 새로운 미분 가능 어텐션 메커니즘을 도입했으며, 이 아이디어의 우아한 변형이 **Bahdanau et al.** 에 의해 기계 번역에 성공적으로 적용되었다. 또 다른 인기 있는 방법으로는 **Connectionist Sequence Classification**이 있는데, 이는 신경망으로 시퀀스를 시퀀스로 매핑할 수 있지만 입력과 출력 사이의 단조로운 정렬을 가정한다.

4. <font color="#ff0000">관련 연구와 차별성</font>
	- <font color="#ff0000"><b>Kalchbrenner & Blunsom (2013)</b>: 문장을 벡터로 매핑하는 시도.</font>
	- <font color="#ff0000"><b>Cho et al. (2014)</b>: 구문 기반 번역 시스템 가설 재점수화에 활용.</font>
	- <font color="#ff0000"><b>Graves (2013)</b>: 신경망에 <b>어텐션 메커니즘</b> 도입.</font>
	- <font color="#ff0000"><b>Bahdanau et al. (2014)</b>: 어텐션 기반 번역 적용.</font>
	- <font color="#ff0000"><b>Connectionist Sequence Classification (CTC)</b>: 시퀀스 매핑 가능하지만 단조 정렬(monotonic alignment) 가정 필요.</font>

---
## 2. The model 모델

**[순환 신경망(Recurrent Neural Network, RNN)](AIM/Recurrent_Neural_Network.md)은 피드포워드 신경망을 시퀀스로 일반화한 자연스러운 확장**이다. **입력 시퀀스 $(x_1, \ldots, x_T)$가 주어졌을 때, 표준 RNN은 다음의 식을 반복함으로써 출력 시퀀스 $(y_1, \ldots, y_T)$를 계산**한다:

$h_t = \sigma(W_{hx} x_t + W_{hh} h_{t-1})$
$y_t = W_{yh} h_t$​

RNN은 **입력과 출력의 정렬이 미리 알려져 있는 경우에는 시퀀스를 시퀀스로 쉽게 매핑**할 수 있다. 그러나 **입력 시퀀스와 출력 시퀀스의 길이가 다르거나 복잡하고 비단조(non-monotonic)적인 관계를 가질 때, RNN을 어떻게 적용할지는 명확하지 않다**.

1. <font color="#ff0000">RNN 기본 개념</font>
	- <font color="#ff0000"><b>RNN</b>은 피드포워드 신경망을 <b>시퀀스 처리</b>로 확장한 형태</font>
	- <font color="#ff0000">입력 시퀀스 <code>(x<sub>1</sub>, …, x<sub>T</sub>)</code> → 은닉 상태 업데이트 → 출력 시퀀스 <code>(y<sub>1</sub>, …, y<sub>T</sub>)</code></font>
	- <font color="#ff0000">입력과 출력이 <b>1:1 정렬</b>된 경우에는 잘 동작</font>

일반적인 시퀀스 학습을 위한 가장 단순한 전략은 하나의 RNN을 사용하여 **입력 시퀀스를 고정 크기 벡터로 매핑**하고, **또 다른 RNN을 사용하여 그 벡터를 목표 시퀀스로 매핑**하는 것이다(이 접근은 Cho et al. 에서도 사용되었다). 이 방식은 이론적으로는 동작할 수 있는데, RNN에 모든 관련 정보를 제공하기 때문이다. 하지만 이렇게 하면 <b><font color="#245bdb">장기 의존성(long-term dependency) 문제</font>가 발생</b>해 RNN 학습이 어렵다(그림 1 참조). 그러나 **LSTM(Long Short-Term Memory)** 은 장기적 시간 의존성을 가진 문제를 학습할 수 있는 것으로 알려져 있으므로, 이 환경에서 성공할 수 있다.

2. <font color="#ff0000">문제점</font>
	- <font color="#ff0000">입력과 출력의 길이가 다르거나 <b>복잡한 비단조(non-monotonic) 관계</b>일 경우 처리 어려움.</font>
	- <font color="#ff0000">일반 전략:</font>
	    - <font color="#ff0000">입력 시퀀스를 RNN으로 <b>고정 벡터</b>로 변환</font>
	    - <font color="#ff0000">또 다른 RNN으로 출력 시퀀스 생성</font>
	- <font color="#ff0000">그러나 이 경우 <b>장기 의존성(long-term dependency)</b> 문제가 커서 학습이 어렵다.</font>

**LSTM의 목표는 [조건부 확률](AIM/Conditional_Probability.md) $p(y_1, \ldots, y_{T'} | x_1, \ldots, x_T)$을 추정**하는 것이다. 여기서 $(x_1, \ldots, x_T)$는 입력 시퀀스이고, $(y_1, \ldots, y_{T'})$는 그에 대응하는 출력 시퀀스로 길이 $T'$는 $T$와 다를 수 있다. LSTM은 입력 시퀀스 $(x_1, \ldots, x_T)$)의 **마지막 은닉 상태**로 표현되는 고정 차원의 표현 $v$를 얻은 뒤, 초기 은닉 상태를 $v$로 설정한 표준 LSTM-LM 공식에 따라 $(y_1, \ldots, y_{T'})$의 확률을 계산한다:

$p(y_1, \ldots, y_{T'} | x_1, \ldots, x_T) = \prod_{t=1}^{T'} p(y_t | v, y_1, \ldots, y_{t-1})$

이 식에서, 각 분포 $p(y_t | v, y_1, \ldots, y_{t-1})$는 어휘 전체에 대한 **[소프트맥스](AIM/Softmax_Function.md)로 표현**된다. 우리는 Graves 의 LSTM 공식을 사용한다. 또한 **각 문장이 특별한 문장 종료 심볼 “`<EOS>`”로 끝나도록 요구**하는데, 이것은 모델이 가능한 모든 길이의 시퀀스에 대한 분포를 정의할 수 있게 한다. 전체 구조는 그림 1에 개략적으로 나타나 있으며, 여기서 LSTM은 “A”, “B”, “C”, “`<EOS>`”의 표현을 계산한 후, 이를 사용해 “W”, “X”, “Y”, “Z”, “`<EOS>`”의 확률을 계산한다.

3. <font color="#ff0000">LSTM 도입</font>
	- <font color="#ff0000"><b>LSTM</b>은 장기 의존성을 다룰 수 있어 이 문제를 해결할 수 있음.</font>
	- <font color="#ff0000">목표: 조건부 확률조건부 확률 <code>p(y<sub>1</sub>, …, y<sub>T'</sub> | x<sub>1</sub>, …, x<sub>T</sub>)</code>)을 추정**하는 것</font>
	- <font color="#ff0000">방법:</font>
	    - <font color="#ff0000">인코더 LSTM → 입력 시퀀스를 <b>마지막 은닉 상태 v</b>로 요약.</font>
	    - <font color="#ff0000">디코더 LSTM → v와 이전 출력 단어들을 조건으로 다음 단어 확률을 softmax로 계산.</font>
	    - <font color="#ff0000">모든 문장은 “&lt;EOS&gt;”로 종료 → 다양한 길이의 시퀀스를 다룰 수 있음.</font>

우리의 실제 모델은 위 설명과 세 가지 중요한 면에서 다르다.  
첫째, 우리는 **서로 다른 두 개의 LSTM을 사용**하였다. 하나는 **입력 시퀀스를 처리**하고, 다른 하나는 **출력 시퀀스를 처리**한다. 이렇게 하면 계산 비용은 거의 증가하지 않으면서 모델 파라미터 수를 늘릴 수 있고, 여러 언어 쌍을 동시에 학습하는 것이 자연스러워진다.  
둘째, 우리는 **심층 LSTM(deep LSTM)** 이 얕은 LSTM보다 훨씬 더 좋은 성능을 낸다는 것을 발견했기 때문에, **4층 구조의 LSTM**을 선택했다.  
셋째, 우리는 입력 문장의 단어 순서를 **역순(reverse)** 으로 바꾸는 것이 매우 유용하다는 것을 발견했다. 예를 들어, 문장 $a,b,c$를 번역 $α,β,γ$에 매핑하는 대신, LSTM은 $c,b,a$를 입력으로 받아 $α,β,γ$를 출력하도록 학습한다. 이렇게 하면 **$a$는 $α$와 가깝게, $b$는 $β$와 비교적 가깝게 위치**하게 된다. 이런 사실은 SGD가 입력과 출력 사이의 “소통(communication)”을 더 쉽게 확립할 수 있게 한다. 우리는 이 단순한 데이터 변환이 **LSTM 성능을 크게 향상**시킨다는 것을 발견했다.

4. <font color="#ff0000">실제 모델 차별점</font>
	- <font color="#ff0000"><b>인코더–디코더 분리</b>: 입력용 LSTM과 출력용 LSTM을 별도로 사용.</font>
	    - <font color="#ff0000">파라미터 증가(모델 용량 확대)</font>
	    - <font color="#ff0000">다국어 학습에도 유리.</font>
	- <font color="#ff0000"><b>심층 LSTM</b>: 얕은 LSTM보다 <b>깊은 구조(4층)</b>가 성능 우수.</font>
	- <font color="#ff0000"><b>입력 역순(reverse input)</b>:</font>
	    - <font color="#ff0000">입력 문장을 거꾸로 주면, 대응되는 단어들이 <b>출력과 더 가까운 위치</b>에 놓임.</font>
	    - <font color="#ff0000">SGD 최적화가 쉬워지고 성능 크게 향상.</font>

---

## 3. Experiments 실험

우리는 우리의 방법을 **WMT’14 영어→프랑스어 기계 번역 과제**에 두 가지 방식으로 적용하였다. 첫째, **기존 SMT 시스템을 참조하지 않고** 입력 문장을 직접 번역하는 데 사용하였다. 둘째, SMT baseline이 생성한 **n-best 후보 리스트를 다시 점수화(rescoring)** 하는 데 사용하였다. 우리는 이러한 번역 방법들의 정확도를 보고하고, 예시 번역들을 제시하며, 그 결과로 얻어진 문장 표현(sentence representation)을 시각화한다.

<font color="#ff0000"><b>적용 방식</b></font>
1. <font color="#ff0000"><b>직접 번역 (Direct Translation)</b></font>
    - <font color="#ff0000">Seq2Seq 모델만을 사용해 입력 문장을 직접 프랑스어로 번역.</font>
    - <font color="#ff0000">기존 SMT(통계적 기계 번역) 시스템에 의존하지 않음.</font>
2. <font color="#ff0000"><b>재점수화 (Rescoring)</b></font>
    - <font color="#ff0000">SMT baseline이 생성한 <b>n-best 후보 리스트</b>(여러 번역 후보)를 Seq2Seq 모델로 다시 평가.</font>
    - <font color="#ff0000">더 적절한 번역을 선택하도록 보완.</font>

### 3.1. Dataset details 데이터셋

우리는 **WMT’14 영어–프랑스어 데이터셋**을 사용하였다.  
모델은 1,200만 문장으로 이루어진 서브셋(subset)에서 학습되었으며, 이 서브셋은 총 **프랑스어 단어 3억 4,800만 개**, **영어 단어 3억 400만 개**로 구성된, [29]에서 제공한 “선별된(clean selected)” 데이터셋이다.
이 번역 과제와 해당 학습 데이터 서브셋을 선택한 이유는, **토큰화된 학습·테스트 세트**와 함께 baseline SMT [29]에서 생성한 **1000-best 리스트**가 공개되어 있기 때문이다.

일반적인 신경망 언어 모델은 각 단어를 벡터 표현으로 다루기 때문에, 우리는 양쪽 언어 모두에 대해 **고정된 어휘 집합**을 사용했다.
- 소스 언어(영어): 가장 빈도 높은 **16만 단어**
- 타깃 언어(프랑스어): 가장 빈도 높은 **8만 단어**
어휘 집합에 포함되지 않은 모든 단어는 특별한 **“UNK” 토큰**으로 대체하였다.

### 3.2. Decoding and Rescoring 디코딩과 재점수화

우리 실험의 핵심은 많은 문장 쌍에 대해 **대규모 심층 LSTM**을 학습하는 것이었다.  
학습은 소스 문장 S가 주어졌을 때 올바른 번역 T의 로그 확률을 최대화하는 방식으로 진행되었으며, 학습 목표 함수는 다음과 같다:
$$\frac{1}{|S|} \sum_{(T,S) \in \mathcal{S}} log_p(T|S)$$
여기서 $S$는 학습 데이터셋이다.

1. <font color="#ff0000">학습 (Training)</font>
	- <font color="#ff0000"><b>대규모 심층 LSTM</b>을 문장 쌍에 대해 학습.</font>
	- <font color="#ff0000">학습 목표:</font>
	    - <font color="#ff0000">주어진 소스 문장 S → 올바른 번역 T의 <b>로그 확률 최대화</b></font>
	    - <font color="#ff0000">수식:</font> ![[2025-10-01-3.png]]

학습이 완료된 후에는, LSTM이 계산한 확률에 따라 **가장 가능성이 높은 번역**을 찾는다:
$$\hat{T} = \arg\max_T p(T|S)$$

우리는 **좌→우 [빔 서치 디코더(beam search decoder)](AIM/Beam_Search_Decoder.md)** 를 사용해 가장 가능성이 높은 번역을 탐색한다. 이 디코더는 **소수의 부분 가설(partial hypotheses) 집합 $B$를 유지**하는데, **부분 가설이란 어떤 번역의 접두(prefix)를 의미**한다.
각 타임스텝에서, 빔 안의 각 부분 가설은 어휘 내의 가능한 모든 단어로 확장된다. 이 과정에서 가설의 수가 기하급수적으로 늘어나므로, 모델의 로그 확률에 따라 **상위 $B$개의 가장 가능성 높은 가설만 유지**한다. **“`<EOS>`” 심볼이 가설에 추가되는 즉시, 해당 가설은 빔에서 제거되고 완성된 가설 집합에 추가**된다.
이 디코더는 근사적이긴 하지만 구현이 단순하다. 흥미롭게도, 우리의 시스템은 **빔 크기 1**만으로도 좋은 성능을 보였으며, **빔 크기 2**만 되어도 빔 서치의 대부분 장점을 얻을 수 있었다(표 1 참고).

2. <font color="#ff0000">번역 생성 (Decoding)</font>
	- <font color="#ff0000">학습 완료 후 번역:</font>
	    - <font color="#ff0000">가장 가능성 높은 번역</font>
	    - ![[2025-10-01-4.png]]
	- <font color="#ff0000">탐색 방식: <b>좌→우 빔 서치 디코더</b></font>
	    - <font color="#ff0000">빔 안에는 <b>B개의 부분 가설(partial hypotheses)</b> 유지.</font>
	    - <font color="#ff0000">각 단계에서 가능한 모든 단어로 확장 후, <b>상위 B개만 유지</b>.</font>
	    - <font color="#ff0000">“&lt;EOS&gt;”가 붙으면 완성된 가설로 이동.</font>
	- <font color="#ff0000">특징:</font>
	    - <font color="#ff0000">빔 크기 1에서도 성능 양호.</font>
	    - <font color="#ff0000">빔 크기 2면 대부분의 빔 서치 장점 확보.</font>

또한 우리는 baseline 시스템이 생성한 **1000-best 후보 리스트**를 다시 점수화(rescore)하는 데 LSTM을 사용하였다. n-best 리스트를 다시 점수화하기 위해, 우리는 LSTM으로 각 가설의 로그 확률을 계산하고, 원래 점수와 LSTM 점수를 **단순 평균**하였다.

3. <font color="#ff0000">재점수화 (Rescoring)</font>
	- <font color="#ff0000"><b>SMT baseline의 1000-best 후보 리스트</b>를 LSTM으로 다시 점수화.</font>
	- <font color="#ff0000">방법:</font>
	    - <font color="#ff0000">각 후보의 로그 확률을 LSTM으로 계산.</font>
	    - <font color="#ff0000">기존 SMT 점수와 <b>단순 평균</b>하여 최종 점수 산출.</font>

### 3.3. Reversing the Source Sentences 소스 문장의 역순

LSTM은 장기 의존성을 가진 문제를 해결할 수 있지만, 우리는 **소스 문장을 역순으로 바꾸었을 때**(타깃 문장은 역순으로 하지 않음) LSTM이 훨씬 더 잘 학습한다는 사실을 발견했다. 이때 LSTM의 테스트 퍼플렉시티(perplexity)는 **5.8에서 4.7로 감소**했고, 디코딩된 번역의 테스트 BLEU 점수는 **25.9에서 30.6으로 증가**하였다.

- <font color="#ff0000"><b>입력 문장을 뒤집으면(reverse)</b>, LSTM의 <b>테스트 퍼플렉서티(perplexity)</b> 가 <b>5.8 → 4.7로 감소</b>, <b>BLEU 점수</b>는 <b>25.9 → 30.6</b>으로 상승했다.</font>
- <font color="#ff0000">즉, <b>입력 단어 순서를 반대로 바꾸는 단순한 전처리</b>만으로 번역 품질이 크게 개선되었다.</font>

이 현상에 대해 완벽한 설명을 제공할 수는 없지만, 우리는 이것이 데이터셋에 많은 **단기 의존성(short-term dependencies)** 이 도입되었기 때문이라고 생각한다. 일반적으로, 소스 문장을 타깃 문장과 연결하면, 소스 문장의 각 단어는 대응되는 타깃 단어와 멀리 떨어져 있다. 그 결과 이 문제는 큰 “<font color="#245bdb">최소 시간 지연(minimal time lag)</font>”을 갖게 된다.

하지만 소스 문장의 단어들을 역순으로 뒤집으면, 소스 언어와 타깃 언어의 대응 단어들 간의 **평균 거리**는 변하지 않는다. 그러나 소스 문장의 처음 몇 단어가 이제 타깃 문장의 처음 몇 단어와 매우 가까워져서, 문제의 최소 시간 지연이 크게 줄어든다. 따라서 역전파(backpropagation)가 소스 문장과 타깃 문장 간의 “의사소통”을 더 쉽게 확립할 수 있고, 그 결과 전체 성능이 크게 향상된다.

- <font color="#ff0000">원래 입력 문장과 출력 문장은 단어 위치가 멀리 떨어져 있어서, 모델이 양자 간의 관계를 학습하기 어렵다.  → 즉, <b>“최소 시간 지연(minimal time lag)”</b> 이 크다.</font>
- <font color="#ff0000">문장을 뒤집으면, 원래 문장의 첫 단어가 목표 문장의 첫 단어와 <b>가까운 위치 관계</b>를 갖게 되어 <b>시간 지연이 줄어들고(backpropagation 경로가 짧아짐)</b> 학습이 훨씬 수월해진다.</font>
- <font color="#ff0000">결과적으로 <b>단기 의존(short-term dependency)</b> 가 강화되어, LSTM이 <b>장기 의존(long-term dependency)</b> 문제를 더 잘 처리하게 된다.</font>

처음에는 입력 문장을 역순으로 바꾸면 타깃 문장의 초반 부분에서는 예측이 더 확신 있게 나오고, 후반 부분에서는 예측이 덜 확신 있게 나올 것이라고 생각했다. 그러나 실제로 **역순 소스 문장으로 학습된 LSTM은 원래 소스 문장으로 학습된 LSTM보다 긴 문장에서 훨씬 더 좋은 성능**을 보였다(섹션 3.7 참조). 이는 입력 문장을 역순으로 만드는 것이 LSTM의 **메모리 활용(memory utilization)** 을 더 잘하게 만든다는 것을 시사한다.

* <font color="#ff0000">처음에는 연구진이 “문장을 뒤집으면 초반 단어 예측만 좋아질 것”이라고 예측했다. 하지만 <b>긴 문장(long sentences)</b> 에서조차 성능이 향상되어, 이는 LSTM이 <b>더 효율적으로 메모리를 활용(memory utilization)</b> 한다는 것을 시사했다.</font>

### 3.4. Training details 학습 세부 내용

우리는 **LSTM 모델이 비교적 학습하기 쉽다**는 것을 발견했다. 우리는 4개의 층을 가진 심층 LSTM을 사용했으며, 각 층에는 1000개의 셀이 있었고, 단어 임베딩의 차원은 1000이었다. 입력 어휘는 160,000, 출력 어휘는 80,000이었다. 따라서 심층 LSTM은 하나의 문장을 표현하기 위해 8,000개의 실수(real numbers)를 사용한다. 우리는 **심층 LSTM이 얕은 LSTM보다 훨씬 뛰어난 성능**을 내는 것을 발견했는데, 각 층이 추가될 때마다 퍼플렉시티(perplexity)가 거의 10%씩 감소했다. 이는 아마도 훨씬 더 큰 은닉 상태(hidden state) 때문일 것이다. 우리는 각 출력에서 80,000 단어에 대해 단순 소프트맥스(naive softmax)를 사용했다. 그 결과 LSTM은 총 3억 8천 4백만 개의 파라미터를 가지며, 이 중 6천 4백만 개는 순수한 순환 연결(recurrent connections)이다(인코더 LSTM 3천 2백만, 디코더 LSTM 3천 2백만).

- <font color="#ff0000"><b>모델 유형:</b> 4층(4-layer) 심층 LSTM</font>
- <font color="#ff0000"><b>각 층 구성:</b></font>
    - <font color="#ff0000">LSTM 셀 수: 1000개</font>
    - <font color="#ff0000">단어 임베딩 차원: 1000</font>
- <font color="#ff0000"><b>입력 어휘 크기:</b> 160,000 단어</font>
- <font color="#ff0000"><b>출력 어휘 크기:</b> 80,000 단어</font>
- <font color="#ff0000"><b>문장 표현:</b> 문장 하나는 총 <b>8,000개의 실수값(real numbers)</b> 로 표현됨</font>
- <font color="#ff0000"><b>파라미터 수:</b> 약 <b>3억 8천4백만 개 (384M)</b></font>
    - <font color="#ff0000">그중 <b>순환 연결(recurrent connections): 6천4백만 개 (64M)</b></font>
        - <font color="#ff0000">인코더 LSTM: 32M</font>
        - <font color="#ff0000">디코더 LSTM: 32M</font>
- <font color="#ff0000"><b>Softmax 구조:</b> 출력 시 <b>80,000 단어 전체에 대해 naive softmax</b> 적용</font>
>  <font color="#ff0000"><b>심층 LSTM의 장점:</b> 얕은 LSTM 대비 월등히 우수 → 층을 하나 추가할 때마다 perplexity가 약 10% 감소 (더 큰 hidden state 덕분에 표현력 향상)</font>

완전한 학습 세부 사항은 다음과 같다:
- LSTM의 모든 파라미터를 −0.08에서 0.08 사이의 균등 분포로 초기화했다.
- [모멘텀(momentum)](Momentum) 없이 [확률적 경사 하강법(SGD)](AIM/Stochastic_Gradient_Descent.md)을 사용했으며, 초기 학습률은 0.7로 고정했다. 5 에폭(epoch) 후에는, 학습률을 매 절반 에폭마다 절반으로 줄였다. 우리는 총 7.5 에폭 동안 모델을 학습했다.
- 그래디언트 계산에는 128개의 시퀀스로 구성된 배치를 사용했고, 이를 배치 크기(즉, 128)로 나누었다.
- LSTM은 소실된 그래디언트(vanishing gradient) 문제에는 잘 버티지만, <b>폭발하는 그래디언트(exploding gradient)</b>문제가 발생할 수 있다. 따라서 우리는 그래디언트의 노름(norm)에 강한 제약을 두었다. 즉, 그래디언트의 노름이 임계값을 초과하면 스케일링했다. 각 학습 배치마다, g를 그래디언트를 128로 나눈 값이라고 할 때, $s = ||g||_2$를 계산했다. 만약 $s>5$ 라면, $g = \frac{5g}{s}$​로 설정했다.
- 문장은 길이가 제각각이다. 대부분의 문장은 짧은 편(예: 길이 20~30)이고, 일부는 긴 편(예: 길이 100 이상)이다. 따라서 128개의 문장을 무작위로 선택해 미니배치를 구성하면 짧은 문장이 대부분이고 긴 문장은 몇 개만 포함되므로, 계산의 많은 부분이 낭비된다. 이 문제를 해결하기 위해, 우리는 미니배치 안의 모든 문장이 **대략 비슷한 길이**가 되도록 구성했다. 이로 인해 약 2배의 속도 향상을 얻을 수 있었다.

| 항목                                 | 설정 내용                                                                                 |
| ---------------------------------- | ------------------------------------------------------------------------------------- |
| **파라미터 초기화**                       | -0.08 ~ 0.08 사이의 균등분포                                                                 |
| **최적화 알고리즘**                       | 확률적 경사 하강법 (SGD), **모멘텀 없음**                                                          |
| **학습률 (Learning Rate)**            | 초기값 0.7 → 5 epoch 이후, **매 half-epoch마다 절반으로 감소**                                      |
| **총 학습 epoch**                     | 7.5 epoch                                                                             |
| **배치 크기 (Batch Size)**             | 128개 시퀀스                                                                              |
| **그래디언트 스케일링**                     | 그래디언트 ( g ) 의 norm ( $s = \|\|g\|\|_2$)                                               |
| **Gradient Vanishing / Exploding** | 소실 문제는 적지만, 폭발 방지 위해 **[gradient clipping](AIM/Gradient_Clipping.md) 적용**             |
| **문장 길이 처리**                       | 문장 길이 다양 (20~100+ 단어). 짧은 문장이 많아 비효율 발생 → **비슷한 길이의 문장끼리 묶어서 미니배치 구성** → **2배 속도 향상** |

### 3.5. Parallelization 병렬화

단일 GPU에서 앞 절의 구성으로 구현한 **C++ 기반 심층 LSTM**은 초당 약 **1,700 단어**를 처리한다. 이는 우리의 목적에 비해 너무 느렸기 때문에, 우리는 **8-GPU 머신**을 사용해 모델을 **병렬화**하였다. LSTM의 **각 층(layer)** 을 서로 다른 GPU에서 실행하고, 각 층의 **활성값(activations)** 이 계산되는 즉시 다음 GPU/층으로 전달되도록 했다. 우리의 모델은 **4개 층의 LSTM**으로 구성되어 있으며, 각 층이 **별도의 GPU**에 상주한다. 나머지 **4개의 GPU**는 **소프트맥스(softmax)** 를 병렬화하는 데 사용되었으며, 각 GPU가 **1000×20000** 행렬 곱셈 하나를 담당했다. 이러한 구현을 통해 **미니배치 크기 128**에서 **초당 6,300 단어(영어와 프랑스어 합산)** 의 속도를 달성하였다. 이 구현으로 학습에는 **약 10일**이 소요되었다.

| 항목             | 내용                      |
| -------------- | ----------------------- |
| **구현 언어**      | C++                     |
| **GPU 수**      | 8개                      |
| **LSTM 계층 수**  | 4층 (각 층별 GPU 1개)        |
| **Softmax 분산** | 4개 GPU에서 행렬 곱 분할        |
| **처리 속도 향상**   | 1,700 → 6,300 words/sec |
| **미니배치 크기**    | 128                     |
| **학습 기간**      | 약 10일                   |

### 3.6. Experimental Results 실험 결과

우리는 번역의 품질을 평가하기 위해 **대소문자를 구분한 BLEU 점수(cased BLEU score)** 를 사용하였다.  BLEU 점수는 <font color="#245bdb"><b>multi-bleu.pl</b></font>¹ 스크립트를 사용하여, 토큰화된 예측 결과(tokenized predictions)와 실제 정답(ground truth)을 기반으로 계산하였다.  이러한 BLEU 점수 평가 방식은 [5] 및 [2]의 방식과 일치하며, [29]에서 보고된 **33.3 점수**를 재현(reproduce)할 수 있다. 그러나 **최고 성능의 WMT(국제 기계 번역 경진대회 & 학회 워크숍)’14 시스템** (그 예측 결과는 statmt.org\matrix에서 다운로드 가능)을 동일한 방식으로 평가하면 **37.0 점수**를 얻게 되는데, 이는 statmt.org\matrix에 보고된 **35.8**보다 높은 값이다.

- <font color="#ff0000"><b>평가지표:</b></font>
    - <font color="#ff0000"><b>대소문자를 구분한 BLEU 점수(cased BLEU)</b> 사용</font>
    - <font color="#ff0000"><b>multi-bleu.pl</b> 스크립트를 사용해 토큰화된 예측(prediction)과 정답(ground truth)을 비교하여 계산</font>
- <font color="#ff0000"><b>평가 방식:</b></font>
    - <font color="#ff0000">[5], [2]의 방식과 동일 →  [29]에서 보고된 BLEU <b>33.3점</b>을 재현(reproduce) 가능</font>
- <font color="#ff0000"><b>참고 비교:</b></font>
    - <font color="#ff0000">동일한 방식으로 <b>최고 WMT’14 시스템 [9]</b> 을 평가하면 BLEU <b>37.0점</b></font>
    - <font color="#ff0000">이는 statmt.org\matrix에 보고된 <b>35.8점</b>보다 약간 높음</font>

![](2025-10-09-2.png)
> 표1: The performance of the LSTM on WMT’14 English to French test set (ntst14).

![](2025-10-09-1.png)
> 표2: Methods that use neural networks together with an SMT system on the WMT’14 English to French test set (ntst14).

결과는 **표 1과 표 2**에 제시되어 있다. 우리의 **최고 결과(best results)** 는 서로 다른 **무작위 초기화(random initialization)** 와 **미니배치의 무작위 순서(random order of minibatches)** 로 학습된 **여러 LSTM들의 앙상블(ensemble)** 에 의해 얻어졌다.

- <font color="#ff0000"><b>결과는 표 1, 표 2에 제시됨.</b></font>
- <font color="#ff0000"><b>최고 성능(best results):</b></font>
    - <font color="#ff0000">여러 LSTM을 <b>앙상블(ensemble)</b> 하여 얻음</font>
    - <font color="#ff0000">각 LSTM은 서로 다른</font>
        - <font color="#ff0000"><b>무작위 초기화(random initialization)</b> 와</font>
        - <font color="#ff0000"><b>미니배치 순서(random minibatch order)</b> 로 학습됨</font>

LSTM 앙상블의 디코딩된 번역 결과는 **최고의 WMT’14 시스템**을 능가하지는 못했지만, **대규모 기계 번역(MT) 과제에서 순수한 신경망 번역 시스템이 구문 기반 구절 통계적 기계 번역(phrase-based SMT) 기준선을 상당한 차이로 능가한 것은 이번이 처음이었다.** 이는 어휘 밖 단어(out-of-vocabulary words)를 처리할 수 없는 한계에도 불구하고 달성된 성과이다. 또한 LSTM을 baseline 시스템의 **1000-best 후보 리스트를 재점수화(rescore)** 하는 데 사용하면,  그 결과는 **최고의 WMT’14 결과보다 단지 0.5 BLEU 포인트 낮은 수준**에 도달한다.

- <font color="#ff0000"><b>순수 신경망 기반 번역 시스템(NMT)</b>이 <b>대규모 MT 과제에서 처음으로 구문 기반 SMT(baseline)를 명확히 능가</b>함.</font>
- <font color="#ff0000"><b>OOV(어휘 밖 단어)</b> 처리를 하지 못함에도 불구하고 의미 있는 성능 달성.</font>
- <font color="#ff0000"><b>앙상블 기법</b>과 <b>1000-best 재점수화(rescoring)</b>를 통해 <b>WMT’14 최고 시스템과 거의 동등한 수준</b>(BLEU 차이 0.5) 달성.</font>

### 3.7 Performance on long sentences 긴 문장에 대한 성능

우리는 **LSTM이 긴 문장에서도 좋은 성능을 보인다는 사실**에 놀랐다. 그 정량적인 결과는 **그림 3(Figure 3)** 에 제시되어 있다. 또한 **표 3(Table 3)** 은 **여러 개의 긴 문장 예시와 그 번역 결과**를 보여준다.

### 3.8 Model Analysis 모델 분석

![](2025-10-09-3.png)
> 그림2: The figure shows a 2-dimensional PCA projection of the LSTM hidden states that are obtained after processing the phrases in the figures.

![](2025-10-09-4.png)
> 표3: A few examples of long translations produced by the LSTM alongside the ground truth translations.

![](2025-10-09-5.png)
> 그림3: **문장 길이에 따른 시스템 성능** 과  **단어 희귀도에 따른 시스템 성능**

우리 모델의 매력적인 특징 중 하나는 **단어 시퀀스를 고정된 차원의 벡터로 변환할 수 있는 능력**이다.  **그림 2(Figure 2)** 는 학습된 표현 중 일부를 시각화한 것이다. 이 그림은 모델이 **단어의 순서(order of words)** 에 민감하면서도, **능동태(active voice)를 수동태(passive voice)** 로 바꾸는 것에는 거의 영향을 받지 않음을 명확히 보여준다. 그림에 사용된 **2차원 투영(two-dimensional projection)** 은 **[PCA(주성분 분석)]()** 를 통해 얻어진 것이다.

- <font color="#ff0000"><b>단어 시퀀스(sequence of words)</b> 를 <b>고정된 차원의 벡터(fixed-dimensional vector)</b> 로 변환할 수 있다.  </font>
	- <font color="#ff0000">즉, 문장의 길이와 상관없이 일정한 벡터 크기로 의미를 압축 표현 가능.</font>
	- <font color="#ff0000">인코더 LSTM의 마지막 은닉 상태가 문장의 의미를 요약한 벡터로 작용.</font>

| 구분                                | 설명                                                                              |
| --------------------------------- | ------------------------------------------------------------------------------- |
| **단어 순서 민감성 (Order Sensitivity)** | 단어의 순서가 바뀌면 표현 벡터가 크게 달라짐 → 문법적/의미적 순서 정보를 잘 보존.                                |
| **태 변환 불변성 (Voice Invariance)**   | 능동태(active voice) ↔ 수동태(passive voice) 변환에는 거의 영향을 받지 않음 → 동일한 의미를 가진 구조에는 강인함. |

## 4. Related work 관련 연구

신경망을 기계 번역(machine translation)에 적용한 연구는 매우 방대하다. 지금까지 **RNN 언어 모델(RNN-LM)** [23]이나 **[피드포워드 신경망 언어 모델(NNLM)](AIM/Feedforward_Neural_Network_Language_Model.md)** [3]을 기계 번역 과제(MT task)에 적용하는 가장 간단하고 효과적인 방법은, **강력한 기계 번역 기준선(baseline)** 의 **n-best 리스트를 다시 점수화(rescoring)** 하는 방식이었다 [22]. 이 접근법은 번역 품질을 신뢰성 있게 향상시킨다.

* <font color="#ff0000">초기 접근: Neural LM을 이용한 MT 성능 향상</font>
	- <font color="#ff0000"><b>RNNLM [23]</b> 또는 <b>Feedforward NNLM [3]</b> 을 <b>MT 시스템에 직접 적용하기 어려움</b> → 대신 <b>강력한 SMT baseline의 n-best 리스트를 재점수화(rescoring)</b> 하는 방식이 일반적</font>
	- <font color="#ff0000"><b>효과:</b> 단순하지만 번역 품질을 안정적으로 향상시킴</font>

최근에는 연구자들이 **원문 언어(source language)** 에 대한 정보를 NNLM에 포함시키는 다양한 방법을 탐구하기 시작했다. 그 예로, **Auli et al. [1]** 은 입력 문장의 **주제 모델(topic model)** 을 NNLM과 결합하여, 재점수화 성능을 개선했다. **Devlin et al. [8]** 역시 유사한 접근을 취했지만, 그들은 **NNLM을 MT 시스템의 디코더(decoder)** 에 직접 통합하고, **디코더의 정렬 정보(alignment information)** 를 활용하여 입력 문장에서 가장 유용한 단어들을 NNLM에 제공했다. 그들의 접근법은 매우 성공적이었으며, 기준선 시스템 대비 상당한 성능 향상을 이루었다.

* <font color="#ff0000">원문 언어(Source Language) 정보 통합 시도</font>
	- <font color="#ff0000">연구자들이 NNLM에 <b>소스 언어 정보를 포함하는 방법</b>을 탐색하기 시작함</font>
	- <font color="#ff0000">대표 연구:</font>
	    - <font color="#ff0000"><b>Auli et al. [1]</b> → NNLM + <b>입력 문장 토픽 모델(topic model)</b> 결합 → 재점수화 성능 향상</font>
	    - <font color="#ff0000"><b>Devlin et al. [8]</b> → NNLM을 <b>MT 디코더에 직접 통합</b>,</font>
	        - <font color="#ff0000">디코더의 <b>정렬 정보(alignment info)</b> 로 입력 문장의 중요한 단어를 선택</font>
	        - <font color="#ff0000"><b>성능 크게 향상</b>, 기존 baseline보다 현저한 개선 달성</font>

우리의 연구는 **Kalchbrenner와 Blunsom [18]** 의 연구와 밀접하게 관련되어 있다. 그들은 **입력 문장을 벡터로 매핑한 뒤 다시 문장으로 복원하는 방법**을 처음 제안했다. 다만, 그들은 문장을 벡터로 매핑할 때 **합성곱 신경망(Convolutional Neural Network, CNN)** 을 사용했는데, 이 방식은 **단어의 순서(ordering)** 정보를 잃게 된다.

이 연구와 유사하게, **Cho et al. [5]** 는 **LSTM 유사 구조(LSTM-like RNN architecture)** 를 사용하여 문장을 벡터로 변환하고 다시 복원하는 방식을 사용했다. 그러나 그들의 주요 초점은 **그들의 신경망을 통계적 기계 번역(SMT) 시스템에 통합하는 것**이었다.

**Bahdanau et al. [2]** 역시 신경망을 사용하여 **직접 번역(direct translation)** 을 시도했으며,  
그들의 모델은 **주의(attention) 메커니즘**을 도입하여 **Cho et al. [5]** 가 겪은 **긴 문장에서의 성능 저하 문제**를 해결하려 했다. 그 결과, **고무적인 성과(encouraging results)** 를 얻었다.

마찬가지로, **Pouget-Abadie et al. [26]** 도 **Cho et al. [5]의 메모리 문제(memory problem)** 를 해결하기 위해 소스 문장을 **여러 조각(piece)** 으로 나누어 번역하는 방식을 시도했으며, 이를 통해 **보다 매끄러운 번역(smooth translations)** 을 생성하였다. 이 접근법은 **구문 기반(phrase-based)** 접근법과 유사하다. 우리는 그들이 단순히 **소스 문장을 역순으로 학습(reverse source sentences)** 시켰다면 유사한 성능 향상을 얻을 수 있었을 것이라고 추측한다.

- <font color="#ff0000">Seq2Seq의 전신: “문장 → 벡터 → 문장” 시도들</font>

| 연구                              | 모델 구조                            | 한계 / 특징                                                                 |
| ------------------------------- | -------------------------------- | ----------------------------------------------------------------------- |
| **Kalchbrenner & Blunsom [18]** | CNN 기반 Encoder → 문장을 벡터로 매핑 후 복원 | CNN은 **단어 순서(order)** 를 잃음                                              |
| **Cho et al. [5]**              | LSTM 유사 RNN으로 인코딩–디코딩            | 주 목표: SMT 시스템에 통합                                                       |
| **Bahdanau et al. [2]**         | Attention 메커니즘 도입                | 긴 문장에서의 성능 저하 해결, 유망한 결과                                                |
| **Pouget-Abadie et al. [26]**   | 문장을 여러 조각으로 나누어 번역 (구문 기반 접근 유사) | **메모리 문제 해결** 시도, 그러나 저자들은 “역순 학습(reverse input)”으로도 유사한 개선 가능했을 것이라 언급 |

**Hermann et al. [12]** 의 연구 역시 **엔드투엔드 학습(end-to-end training)** 에 초점을 맞추었다. 그들의 모델은 입력과 출력을 피드포워드 네트워크로 표현하고, 이를 **공간 상의 유사한 지점(similar points in space)** 으로 매핑한다. 그러나 그들의 접근 방식은 **직접적으로 번역을 생성할 수는 없다.** 번역을 얻기 위해서는, 미리 계산된 문장 데이터베이스에서 **가장 가까운 벡터를 검색(lookup)** 하거나, 문장을 **다시 점수화(rescore)** 해야 한다.

* <font color="#ff0000">End-to-End 학습 연구</font>
	- <font color="#ff0000"><b>Hermann et al.</b></font>
	    - <font color="#ff0000">입력과 출력을 <b>Feedforward 네트워크로 표현</b></font>
	    - <font color="#ff0000">서로 유사한 <b>벡터 공간 상의 점으로 매핑</b></font>
	    - <font color="#ff0000">단점:</font>
	        - <font color="#ff0000"><b>직접 번역 생성 불가</b></font>
	        - <font color="#ff0000">미리 계산된 문장 데이터베이스에서 <b>가장 가까운 벡터 탐색(lookup)</b></font>
	        - <font color="#ff0000">또는 문장 <b>재점수화(rescoring)</b> 필요</font>

## 5. Conclusion 결론

이 연구에서 우리는 **어휘가 제한되어 있고**, **문제 구조에 대해 거의 아무런 가정도 하지 않는**, **대규모 심층 LSTM**이 **표준 SMT 기반 시스템**(어휘가 무제한인)을 **대규모 기계 번역(MT) 과제**에서 능가할 수 있음을 보였다. 이와 같은 단순한 LSTM 기반 접근법이 MT에서 성공을 거둔 것은, 충분한 학습 데이터가 주어진다면 이 방법이 **다른 여러 시퀀스 학습 문제(sequence learning problems)** 에서도 좋은 성능을 낼 것임을 시사한다.

- <font color="#ff0000"><b>대규모 심층 LSTM(Deep LSTM)</b> 모델이 어휘 크기가 제한되어 있음에도 불구하고, <b>무제한 어휘를 사용하는 표준 SMT(Statistical Machine Translation)</b> 시스템을 <b>대규모 번역 과제(MT task)</b> 에서 <b>능가(outperform)</b> 함을 입증.</font>
- <font color="#ff0000">즉, <b>단순한 신경망 기반 엔드투엔드(End-to-End) 접근법</b>이 복잡한 SMT보다 더 강력할 수 있음을 처음으로 보여줌.</font>

우리는 **소스 문장의 단어를 역순으로 뒤집었을 때 발생한 큰 개선 효과**에 놀랐다. 이 결과로부터 우리는 **짧은 기간 의존성(short-term dependency)** 을 가능한 한 많이 포함하는 문제 인코딩(problem encoding)을 찾는 것이 중요하다고 결론지었다. 이는 학습 문제를 훨씬 더 단순하게 만들기 때문이다. 특히, 우리는 **비역순 데이터셋(non-reversed translation problem)** 에 대해 표준 RNN을 학습시키는 데 실패했지만(그림 1에 제시됨), 소스 문장을 역순으로 바꾼다면 **표준 RNN도 쉽게 학습될 수 있을 것**이라고 생각한다 (비록 이를 실험적으로 검증하지는 않았지만).

- <font color="#ff0000"><b>소스 문장의 단어를 역순으로 입력</b>했을 때, <b>테스트 퍼플렉시티(perplexity) 감소</b>, <b>BLEU 점수 대폭 향상</b>.</font>
- <font color="#ff0000">이유:</font>
    - <font color="#ff0000">역순 입력은 <b>단기 의존성(short-term dependencies)</b> 을 많이 포함하게 만들어 역전파(backpropagation)와 학습이 훨씬 쉬워짐.</font>
    - <font color="#ff0000">즉, <b>학습 효율을 높이는 인코딩 구조</b>를 찾는 것이 중요하다는 통찰 제시.</font>
- <font color="#ff0000">연구진의 가설: “표준 RNN도 소스 문장이 역순이라면 학습 가능할 것” (실험 X).</font>

또한 우리는 **LSTM이 매우 긴 문장도 정확히 번역할 수 있는 능력**을 보여준 점에 놀랐다. 처음에는 LSTM이 **메모리 한계(memory limitation)** 때문에 긴 문장에서 실패할 것이라고 확신했으며, 다른 연구자들도 유사한 모델을 사용했을 때 **긴 문장에서 낮은 성능**을 보고한 바 있다 [5, 2, 26]. 그럼에도 불구하고, **역순 데이터셋(reversed dataset)** 에서 학습된 LSTM은 **긴 문장 번역에서도 거의 어려움을 보이지 않았다.**

- <font color="#ff0000">연구진은 LSTM이 긴 문장에서 실패할 것으로 예상했음 (메모리 한계 때문).</font>
- <font color="#ff0000">그러나 <b>역순 데이터셋으로 학습된 LSTM은 긴 문장도 안정적으로 번역</b>.</font>
- <font color="#ff0000">이는 LSTM이 <b>기억(memory utilization)</b> 을 훨씬 더 효율적으로 사용했음을 시사.</font>

무엇보다도, 우리는 **단순하고 직관적이며, 최적화조차 충분히 이루어지지 않은 접근법**이 SMT 시스템보다 더 나은 성능을 낼 수 있음을 입증했다. 따라서 **향후 추가 연구**는 훨씬 더 높은 번역 정확도를 달성할 가능성이 크다. 이러한 결과들은 우리의 접근법이 **다른 복잡한 시퀀스-투-시퀀스(sequence-to-sequence) 문제들**에도 매우 잘 작동할 것임을 시사한다.

- <font color="#ff0000">이 논문에서 사용한 접근법은:</font>
    - <font color="#ff0000"><b>단순(Simple)</b></font>
    - <font color="#ff0000"><b>직관적(Straightforward)</b></font>
    - <font color="#ff0000"><b>최적화가 충분하지 않음(Unoptimized)</b> 그럼에도 불구하고 SMT 시스템보다 우수한 성능 달성.</font>
- <font color="#ff0000">향후 모델 구조 및 학습 방법을 개선하면 <b>더 높은 번역 정확도(translation accuracy)</b> 를 얻을 수 있을 것으로 전망.</font>
* L<font color="#ff0000">STM 기반 Seq2Seq 접근법은 <b>기계 번역뿐 아니라, 다른 모든 시퀀스-투-시퀀스(sequence-to-sequence) 문제</b>에도 적용 가능.</font>

## 6. Acknowledgments

우리는 다음 분들께 유용한 의견과 토론에 대해 감사를 드립니다. **Samy Bengio, Jeff Dean, Matthieu Devin, Geoffrey Hinton, Nal Kalchbrenner, Thang Luong, Wolfgang Macherey, Rajat Monga, Vincent Vanhoucke, Peng Xu, Wojciech Zaremba**, 그리고 **Google Brain 팀**에게 감사드립니다.

---
# 참고

* [Github Pages: Sequence to Sequence Learning with Neural Networks](https://bhchoi.github.io/post/nlp/paper/sequence_to_sequence_learning_with_neural_networks/)
* [wikidocs: seq2seq](https://wikidocs.net/24996)
* [velog: seq2seq 모델에 대한 이해](https://velog.io/@lighthouse97/seq2seq-%EB%AA%A8%EB%8D%B8%EC%97%90-%EB%8C%80%ED%95%9C-%EC%9D%B4%ED%95%B4)
* [tistory: seq2seq(sequence-to-sequence)란 무엇인가?](https://ctkim.tistory.com/entry/RNN-seq2seq%EB%9E%80-%EB%AC%B4%EC%97%87%EC%9D%B8%EA%B0%80)