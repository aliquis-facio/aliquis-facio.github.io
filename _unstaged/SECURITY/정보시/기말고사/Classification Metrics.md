# Classification Metrics: Accuracy, Precision, Recall, F1, ROC, and PR Curves
## 1. Confusion Matrix (혼동 행렬)

![|404x264](2025-12-05-12-42-36.png)

이진 분류에서 실제/예측 결과를 표로 정리한 것
- **TP (True Positive)**: 실제 Positive, 예측도 Positive
- **TN (True Negative)**: 실제 Negative, 예측도 Negative
- **FP (False Positive)**: 실제는 Negative인데 Positive로 잘못 예측 (Type I error, False alarm)
- **FN (False Negative)**: 실제는 Positive인데 Negative로 잘못 예측 (Type II error, Missed detection) 
이 네 가지를 기반으로 Accuracy, Precision, Recall 등 여러 지표를 정의.

## 2. Accuracy, Precision, Recall
### (1) Accuracy (정확도)

![|404x264](2025-12-05-12-43-01.png)

- 정의: 전체 샘플 중 맞춘 비율
    - $Accuracy = \dfrac{TP + TN}{TP + FP + FN + TN}$ 
- 장점: 가장 직관적인 지표
- 단점: **클래스 불균형에 매우 취약**
    - 예: P:N = 2:8인데, 전부 Negative로만 찍어도 Accuracy = 80%
그래서 **불균형 데이터**에서는 Accuracy만 보면 안 됨.

### (2) Precision (정밀도)

![|398x258](2025-12-05-12-43-07.png)

- 정의: 모델이 Positive라고 예측한 것 중 실제로 Positive인 비율
    - $Precision = \dfrac{TP}{TP + FP}$ 
- 다른 이름: PPV(Positive Predictive Value)
- 해석: “**양성이라고 잡은 애들, 진짜 양성 맞는 비율**”
    - 스팸 필터에서 **스팸이라고 표시된 메일이 진짜 스팸인가?**를 중요시할 때 Precision이 중요.
	
### (3) Recall (재현율)

![|398x263](2025-12-05-12-43-13.png)

- 정의: 실제 Positive 중에서 모델이 Positive로 잘 찾아낸 비율
    - $Recall = \dfrac{TP}{TP + FN}$ 
- 다른 이름:
    - TPR(True Positive Rate), Sensitivity(민감도)
- 해석: “**빠뜨리지 않고 잘 찾아냈는가?**”
    - 암 환자 진단 모델처럼 놓치면 안 되는 경우 Recall이 중요.
	
## 3. Precision–Recall 관계 & F1-score
### (1) F1-score

- Precision과 Recall을 **동시에 고려**하는 지표
- 정의: 두 값의 **조화 평균**
    - $F1 = 2 \times \dfrac{Precision \times Recall}{Precision + Recall}$
- 범위: 0 ~ 1, 1에 가까울수록 좋음
- Precision, Recall 둘 중 하나라도 낮으면 F1도 같이 낮아짐 → **둘의 균형**을 보는 지표.

### (2) Precision–Recall Trade-off

![|398x153](2025-12-05-12-43-24.png)

- Threshold(결정 경계)를 조절하면 Precision과 Recall이 서로 **교환관계(trade-off)**:
    - Threshold ↑ → Positive라고 예측하는 경우 ↓  
        → **Precision ↑, Recall ↓** 경향
    - Threshold ↓ → Positive라고 예측하는 경우 ↑  
        → **Recall ↑, Precision ↓** 경향

![|398x149](2025-12-05-12-43-43.png)

이를 시각화한 것이:
- **Precision–Recall Curve**: x축 Recall, y축 Precision
- Threshold에 따라 Precision/Recall 값이 어떻게 변하는지 한눈에 보임.

### (3) AP, mAP

- **AP(Average Precision)**: Precision–Recall curve 아래 면적
- **mAP(mean Average Precision)**: 클래스가 여러 개 있을 때, 각 클래스의 AP를 평균낸 값
- 특히 **Object Detection**에서 성능 평가할 때 많이 사용.

## 4. 그 외 지표: TNR, FPR, ROC, AUC
### (1) TNR, FPR

- **TNR (True Negative Rate)** / 특이도(specificity)
    - 실제 Negative 중, Negative로 잘 맞춘 비율
    - $TNR = \dfrac{TN}{FP + TN}$ 
- **FPR (False Positive Rate)** / Fall-out
    - 실제 Negative 중, Positive로 잘못 예측한 비율
    - $FPR = \dfrac{FP}{FP + TN} = 1 - TNR$
	
Recall이 “양성을 얼마나 잘 맞추냐”면, TNR은 “음성을 얼마나 잘 맞추냐” 느낌.

### (2) ROC Curve & AUC

![|398x398](2025-12-05-12-43-58.png)

- **ROC Curve**
    - x축: FPR
    - y축: TPR(= Recall)
    - 대각선보다 **왼쪽 위로 붙을수록** 좋은 모델
- **AUC(ROC-AUC)**: ROC 곡선 아래 면적
    - 1에 가까울수록 좋음.
	
## 5. Precision–Recall vs ROC 언제 쓸까?

- **ROC Curve**
    - 클래스 비율이 비교적 **균형**인 데이터에서 괜찮음
    - 불균형 상황에서는 성능 저하를 잘 반영 못할 수 있음.
- **Precision–Recall Curve**
    - **클래스 불균형이 심한 데이터셋**에서 모델 성능 비교할 때 유리
    - 특히 Positive가 매우 적은 경우(희귀 이벤트 탐지 등) 자주 사용.

# 참고

- [Tistory: 분류 성능 지표: Precision(정밀도), Recall(재현율), F1-score](https://ai-com.tistory.com/entry/ML-%EB%B6%84%EB%A5%98-%EC%84%B1%EB%8A%A5-%EC%A7%80%ED%91%9C-Precision%EC%A0%95%EB%B0%80%EB%8F%84-Recall%EC%9E%AC%ED%98%84%EC%9C%A8)
- [Wikipedia: Confusion matrix](https://en.wikipedia.org/wiki/Confusion_matrix)
- [cosmiccoding: PR vs ROC Curves - Which to Use?](https://cosmiccoding.com.au/tutorials/pr_vs_roc_curves/)
- [Wikipedia: Receiver operating characteristic](https://en.wikipedia.org/wiki/Receiver_operating_characteristic)