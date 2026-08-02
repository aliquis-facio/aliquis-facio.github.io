---
layout: post
comments: true
sitemap:

title: "[AI] Decision Tree Regression"
excerpt: "의사결정나무 회귀 개념과 코드"

date: 2026-08-02
last_modified_at: 2026-08-02

categories:
  - AI
tags:
  - AI
  - DEEP_LEARNING
  - CART
---

<!-- markdownlint-disable MD025 MD060 -->

# Decision Tree Regression 의사결정나무 회귀

> Decision tree regression(의사결정나무 회귀): 입력 특성에 관한 조건을 기준으로 데이터를 반복해서 나누고, 최종 구역에 속한 학습 데이터의 대표값으로 연속적인 값을 예측하는 지도학습 알고리즘이다.

## 1. 개요

**Decision Tree(의사결정나무)**: 일련의 질문을 통해 예측 결과를 찾아가는 트리 구조의 머신러닝 모델이다.

다음과 같은 형태의 질문을 반복한다고 생각할 수 있다.

* 주택 면적이 100㎡ 이하인가?
* 건축 연도가 2010년 이전인가?
* 지하철역과의 거리가 1km 이하인가?

각 질문에 따라 데이터가 두 집단으로 나뉘며, 더 이상 분할하지 않는 마지막 노드에서 예측값이 결정된다.

Decision Tree는 다음 두 가지 문제에 모두 사용할 수 있다.

| 구분 | 모델                       | 예측 대상   |
| -- | ------------------------ | ------- |
| 분류 | `DecisionTreeClassifier` | 범주형 값   |
| 회귀 | `DecisionTreeRegressor`  | 연속적인 수치 |

분류와 회귀를 모두 처리하는 대표적인 트리 알고리즘을 **CART(Classification and Regression Trees)** 라고 한다. scikit-learn의 Decision Tree도 최적화된 CART 알고리즘을 기반으로 구현되어 있다. CART는 하나의 노드에서 데이터를 두 집단으로 분할하는 **이진 트리**를 만든다. [scikit-learn Decision Trees User Guide](https://scikit-learn.org/stable/modules/tree.html)

## 2. Decision Tree의 구조

Decision Tree는 다음 요소로 구성된다.

| 구성 요소 | 설명                        |
| ----- | ------------------------- |
| 루트 노드 | 모든 학습 데이터가 들어 있는 최상위 노드   |
| 내부 노드 | 특성과 임계값을 이용해 데이터를 나누는 노드  |
| 가지    | 조건의 결과에 따라 다음 노드로 연결되는 경로 |
| 리프 노드 | 추가 분할 없이 최종 예측값을 반환하는 노드  |
| 서브 트리 | 특정 노드 아래에서 다시 형성되는 작은 트리  |

예를 들어 주택 가격을 예측하는 트리는 다음처럼 동작할 수 있다.

```mermaid
flowchart TD
    A{"주택 면적 ≤ 100㎡?"}
    B{"건축 연도 ≤ 2010년?"}
    C["예측 가격: 6억 원"]
    D["예측 가격: 3억 원"]
    E["예측 가격: 4억 원"]
    A -->|예| B
    A -->|아니요| C
    B -->|예| D
    B -->|아니요| E
```

새로운 주택의 특성을 루트 노드부터 조건과 비교하면서 이동하고, 도착한 리프 노드의 값이 최종 예측값이 된다.

## 3. 회귀 트리의 핵심 원리

### 3.1 데이터 공간 분할

현재 노드의 데이터에 대해 다음과 같은 조건을 만든다.

$$
x_j \le t
$$

* $x_j$: $j$번째 특성
* $t$: 데이터를 나누는 임계값

조건을 만족하면 왼쪽 노드로, 만족하지 않으면 오른쪽 노드로 이동한다.

$$
Q_{\text{left}}={(x,y)\mid x_j\le t}
$$

$$
Q_{\text{right}}={(x,y)\mid x_j>t}
$$

알고리즘은 여러 특성과 임계값을 검토한 후, 분할된 두 집단의 오차가 가장 작아지는 조건을 선택한다.

### 3.2 리프 노드의 예측값

기본적인 회귀 트리에서 리프 노드의 예측값은 해당 노드에 속한 목표값의 평균이다.

리프 노드 (R_m)에 다음 가격이 포함되어 있다고 가정하자.

$$
    [3.0,\ 3.5,\ 4.0,\ 4.5]
$$

이 노드의 예측값은 다음과 같다.

$$
\hat{y}_{R_m}
=\frac{3.0+3.5+4.0+4.5}{4}
=3.75
$$

따라서 새로운 데이터가 이 리프 노드에 도착하면 `3.75`를 예측한다.

`criterion="absolute_error"`를 사용하면 평균이 아니라 **중앙값**을 이용한다. [scikit-learn DecisionTreeRegressor](https://scikit-learn.org/stable/modules/generated/sklearn.tree.DecisionTreeRegressor.html)

## 4. 최적 분할 기준

### 4.1 평균제곱오차

`DecisionTreeRegressor`의 기본 분할 기준은 `squared_error`이다.

현재 노드에 속한 목표값의 평균을 (\bar{y})라고 하면 평균제곱오차는 다음과 같다.

$$
MSE=\frac{1}{n}\sum_{i=1}^{n}(y_i-\bar{y})^2
$$

후보 분할로 만들어진 왼쪽과 오른쪽 노드의 가중 오차는 다음과 같다.

$$
G(Q,\theta)
=
\frac{n_L}{n}H(Q_L)
+
\frac{n_R}{n}H(Q_R)
$$

* $n$: 현재 노드의 샘플 수
* $n_L, n_R$: 왼쪽과 오른쪽 노드의 샘플 수
* $H(Q_L), H(Q_R)$: 각 노드의 오차
* $\theta$: 특성과 임계값으로 구성된 분할 조건

Decision Tree는 이 값이 가장 작은 분할을 선택한다.

$$
\theta^*=\arg\min_{\theta}G(Q,\theta)
$$

즉, **분할 후 각 집단 내부의 목표값들이 최대한 비슷해지도록** 데이터를 나눈다.

### 주의

분류 트리에서 사용하는 지니 불순도와 엔트로피는 회귀 트리의 기본 분할 기준이 아니다.

* 분류 트리: 지니 불순도, 엔트로피 등
* 회귀 트리: 평균제곱오차, 평균절대오차, 포아송 편차 등

두 설명을 혼동하지 않아야 한다.

## 5. 간단한 분할 예시

다음과 같은 데이터가 있다고 가정한다.

| 면적 (X) | 가격 (y) |
| -----: | -----: |
|     50 |     2억 |
|     60 |     3억 |
|     80 |     4억 |
|    120 |     8억 |
|    150 |     9억 |

면적 `100㎡`를 기준으로 나누면 다음 두 집단이 만들어진다.

* 왼쪽: `[2, 3, 4]`
* 오른쪽: `[8, 9]`

각 노드의 예측값은 다음과 같다.

$$
\hat{y}_{left}=3
$$

$$
\hat{y}_{right}=8.5
$$

따라서 학습된 모델은 대략 다음과 같이 예측한다.

$$
\hat{y}=
\begin{cases}
3 & x\le100\\
8.5 & x>100
\end{cases}
$$

회귀 트리는 데이터를 여러 구간으로 나누고 각 구간에서 일정한 값을 반환하므로, 예측 결과가 부드러운 곡선이 아니라 **계단 형태**로 나타난다.

## 6. 학습 과정

Decision Tree 회귀 모델은 다음 과정으로 학습된다.

1. 모든 데이터를 루트 노드에 배치한다.
2. 각 특성에서 가능한 분할 임계값을 탐색한다.
3. 분할 후 오차가 가장 작아지는 조건을 선택한다.
4. 데이터를 왼쪽과 오른쪽 노드로 나눈다.
5. 만들어진 자식 노드에서도 같은 과정을 반복한다.
6. 정지 조건을 만족하면 해당 노드를 리프 노드로 만든다.
7. 리프 노드에 속한 목표값의 대표값을 예측값으로 저장한다.

정지 조건에는 다음과 같은 것들이 있다.

* 최대 깊이에 도달한 경우
* 노드를 나누기 위한 샘플이 부족한 경우
* 리프 노드가 가져야 할 최소 샘플 수를 충족하지 못하는 경우
* 분할로 얻는 오차 감소량이 충분하지 않은 경우
* 최대 리프 노드 수에 도달한 경우

## 7. 주요 하이퍼파라미터

```python
DecisionTreeRegressor(
    criterion="squared_error",
    splitter="best",
    max_depth=None,
    min_samples_split=2,
    min_samples_leaf=1,
    max_features=None,
    max_leaf_nodes=None,
    min_impurity_decrease=0.0,
    ccp_alpha=0.0,
    random_state=None,
)
```

### `criterion`

분할의 품질을 평가하는 기준이다.

| 값                | 설명               | 리프 예측값 |
| ---------------- | ---------------- | ------ |
| `squared_error`  | 평균제곱오차를 감소시키는 분할 | 평균     |
| `absolute_error` | 평균절대오차를 감소시키는 분할 | 중앙값    |
| `poisson`        | 포아송 편차를 감소시키는 분할 | 평균     |

일반적인 연속형 목표값에는 `squared_error`를 가장 많이 사용한다.

### `splitter`

분할 조건을 선택하는 방식이다.

| 값        | 설명                     |
| -------- | ---------------------- |
| `best`   | 검토한 후보 중 가장 좋은 분할 선택   |
| `random` | 무작위 후보 가운데 가장 좋은 분할 선택 |

기본값은 `best`이다.

### `max_depth`

트리의 최대 깊이를 제한한다.

```python
DecisionTreeRegressor(max_depth=4)
```

값이 작으면 모델이 단순해지고, 값이 크면 복잡한 관계를 학습할 수 있다. 지나치게 크면 과적합될 가능성이 높다.

### `min_samples_split`

내부 노드를 분할하기 위해 필요한 최소 샘플 수다.

```python
DecisionTreeRegressor(min_samples_split=10)
```

현재 노드의 샘플 수가 이 값보다 작으면 더 이상 분할하지 않는다.

### `min_samples_leaf`

하나의 리프 노드가 가져야 하는 최소 샘플 수다.

```python
DecisionTreeRegressor(min_samples_leaf=5)
```

값을 크게 설정하면 소수의 데이터만 포함하는 리프가 만들어지는 것을 막아 예측을 부드럽게 하고 과적합을 줄일 수 있다.

### `max_leaf_nodes`

리프 노드의 최대 개수를 제한한다.

```python
DecisionTreeRegressor(max_leaf_nodes=20)
```

### `min_impurity_decrease`

분할에 따른 오차 감소량이 설정값 이상일 때만 노드를 분할한다.

```python
DecisionTreeRegressor(min_impurity_decrease=0.01)
```

### `ccp_alpha`

비용 복잡도 가지치기(Cost Complexity Pruning)의 강도를 지정한다.

```python
DecisionTreeRegressor(ccp_alpha=0.01)
```

값이 커질수록 더 많은 가지가 제거되어 단순한 트리가 만들어진다. 이전 자료 중에는 scikit-learn이 사전 가지치기만 지원한다고 설명하는 글도 있지만, 현재는 `ccp_alpha`를 이용한 최소 비용 복잡도 가지치기도 지원한다.

### `random_state`

동일한 학습 결과를 재현하기 위한 난수 시드다.

```python
DecisionTreeRegressor(random_state=42)
```

`splitter="best"`를 사용하더라도 동일한 품질의 분할 후보가 여러 개 존재하거나 특성 순서가 무작위로 섞일 수 있으므로, 재현이 필요하면 설정하는 것이 좋다.

## 8. 과적합과 가지치기

Decision Tree는 제한하지 않으면 학습 데이터에 존재하는 작은 변화와 잡음까지 학습할 수 있다.

### 과적합 상태

* 학습 데이터 성능은 매우 높다.
* 테스트 데이터 성능은 낮다.
* 트리의 깊이가 지나치게 깊다.
* 소수의 데이터만 포함하는 리프 노드가 많다.
* 데이터가 조금만 바뀌어도 트리 구조가 크게 달라진다.

### 사전 가지치기

트리가 성장하는 과정에서 복잡도를 미리 제한한다.

* `max_depth` 감소
* `min_samples_split` 증가
* `min_samples_leaf` 증가
* `max_leaf_nodes` 감소
* `min_impurity_decrease` 증가

### 비용 복잡도 가지치기

먼저 성장한 트리에서 성능 개선 효과가 작은 가지를 제거한다.

* `ccp_alpha` 증가

일반적으로 교차 검증을 이용해 적절한 가지치기 수준을 선택한다.

## 9. Python 예제

기존 참고 글 일부는 현재 scikit-learn에서 제거된 `load_boston()`을 사용한다. 다음 예제에서는 현재 사용할 수 있는 당뇨병 회귀 데이터셋을 사용한다.

```python
import matplotlib.pyplot as plt

from sklearn.datasets import load_diabetes
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score,
)
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeRegressor, plot_tree

# 데이터 불러오기
data = load_diabetes(as_frame=True)

X = data.data
y = data.target

# 학습 데이터와 테스트 데이터 분리
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
)

# 모델 생성
model = DecisionTreeRegressor(
    criterion="squared_error",
    max_depth=4,
    min_samples_leaf=5,
    random_state=42,
)

# 모델 학습
model.fit(X_train, y_train)

# 예측
y_pred = model.predict(X_test)

# 평가
mse = mean_squared_error(y_test, y_pred)
rmse = mse ** 0.5
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"MSE  : {mse:.3f}")
print(f"RMSE : {rmse:.3f}")
print(f"MAE  : {mae:.3f}")
print(f"R²   : {r2:.3f}")
```

## 10. 트리 시각화

```python
plt.figure(figsize=(24, 12))

plot_tree(
    model,
    feature_names=X.columns,
    filled=True,
    rounded=True,
    fontsize=8,
)

plt.title("Decision Tree Regressor")
plt.show()
```

회귀 트리의 각 노드에는 일반적으로 다음 정보가 표시된다.

| 항목              | 의미                   |
| --------------- | -------------------- |
| 분할 조건           | 해당 노드에서 사용하는 특성과 임계값 |
| `squared_error` | 노드 내부 목표값의 오차 또는 불순도 |
| `samples`       | 노드에 도달한 학습 샘플 수      |
| `value`         | 해당 노드의 예측값           |

## 11. 하이퍼파라미터 튜닝

```python
from sklearn.model_selection import GridSearchCV

model = DecisionTreeRegressor(random_state=42)

param_grid = {
    "max_depth": [2, 3, 4, 5, 6, None],
    "min_samples_split": [2, 5, 10, 20],
    "min_samples_leaf": [1, 3, 5, 10],
    "ccp_alpha": [0.0, 0.001, 0.01, 0.1],
}

grid_search = GridSearchCV(
    estimator=model,
    param_grid=param_grid,
    scoring="neg_root_mean_squared_error",
    cv=5,
    n_jobs=-1,
)

grid_search.fit(X_train, y_train)

best_model = grid_search.best_estimator_

print("최적 파라미터:", grid_search.best_params_)
print("교차 검증 RMSE:", -grid_search.best_score_)
```

교차 검증 없이 테스트 데이터에 맞춰 하이퍼파라미터를 반복해서 조정하면 테스트 데이터에도 과적합될 수 있다. 따라서 다음과 같이 역할을 구분하는 것이 좋다.

* 학습 데이터: 모델 학습
* 검증 데이터 또는 교차 검증: 하이퍼파라미터 선택
* 테스트 데이터: 최종 성능 평가

## 12. 특성 중요도

Decision Tree에서는 `feature_importances_`를 통해 각 특성이 분할 과정에 얼마나 기여했는지 확인할 수 있다.

```python
import pandas as pd

importance = pd.Series(
    best_model.feature_importances_,
    index=X.columns,
).sort_values(ascending=False)

print(importance)
```

```python
importance.sort_values().plot(
    kind="barh",
    figsize=(8, 6),
)

plt.xlabel("Feature Importance")
plt.ylabel("Feature")
plt.title("Decision Tree Feature Importance")
plt.show()
```

다만 불순도 감소 기반 중요도는 다음 특성을 과대평가할 수 있다.

* 값의 종류가 많은 특성
* 연속형 특성
* 서로 강하게 상관된 특성

따라서 변수의 실제 영향력을 해석하려면 permutation importance나 SHAP 같은 방법도 함께 확인하는 것이 좋다.

## 13. 장점

- 해석하기 쉽다: 트리 구조와 분할 조건을 시각화할 수 있어 예측 과정을 비교적 직관적으로 설명할 수 있다.
- 비선형 관계를 학습할 수 있다: 선형 회귀와 달리 독립 변수와 종속 변수의 관계가 직선일 필요가 없다.
- 특성 간 상호작용을 자동으로 학습한다: 한 특성으로 분할한 후 다른 특성을 사용하는 방식으로 조건부 관계를 표현할 수 있다.
- 스케일링이 거의 필요하지 않다: 특성의 상대적 크기보다 임계값을 기준으로 데이터를 나누므로 표준화나 정규화가 필수적이지 않다.
- 이상치의 영향이 비교적 국소적이다: 선형 회귀처럼 하나의 이상치가 전체 회귀식에 직접 영향을 주기보다는 특정 분할이나 리프 노드에 영향을 준다. 그러나 이상치에 완전히 강한 모델이라는 뜻은 아니다.

## 14. 단점

- 과적합되기 쉽다: 트리의 깊이나 리프의 샘플 수를 제한하지 않으면 학습 데이터에 지나치게 맞춰질 수 있다.
- 분산이 크고 불안정하다: 학습 데이터가 조금만 달라져도 선택되는 분할 조건과 전체 트리 구조가 크게 바뀔 수 있다.
- 구간별 상수값을 예측한다: 같은 리프 노드에 속한 데이터에는 모두 동일한 값을 반환한다. 따라서 부드러운 함수 관계를 표현하는 데 한계가 있다.
- 외삽 능력이 부족하다: 학습 데이터의 목표값 범위를 벗어난 값을 예측하기 어렵다. 예를 들어 학습 데이터의 최고 가격이 10억 원이면 단일 회귀 트리가 15억 원과 같은 값을 자연스럽게 외삽하기 어렵다.
- 탐욕적 학습을 사용한다: 각 노드에서 당장 가장 좋은 분할을 선택하므로, 만들어진 전체 트리가 전역적으로 최적인지는 보장되지 않는다.

## 15. 선형 회귀와 비교

| 항목         | 선형 회귀       | Decision Tree 회귀    |
| ---------- | ----------- | ------------ |
| 관계 형태      | 선형 관계 가정    | 비선형 관계 학습 가능 |
| 예측 형태      | 직선 또는 초평면   | 구간별 상수       |
| 스케일링       | 상황에 따라 필요   | 일반적으로 불필요    |
| 특성 상호작용    | 직접 추가해야 함   | 자동 학습 가능     |
| 해석 방식      | 회귀계수        | 트리의 분할 규칙    |
| 외삽         | 가능하지만 주의 필요 | 매우 취약        |
| 과적합 위험     | 상대적으로 낮음    | 높음           |
| 데이터 변화 안정성 | 비교적 안정적     | 불안정          |

## 16. 앙상블 모델과의 관계

단일 Decision Tree의 과적합과 불안정성을 보완하기 위해 여러 트리를 결합한 앙상블 모델을 사용한다.

| 모델                | 핵심 방식                      |
| ----------------- | -------------------------- |
| Random Forest     | 여러 트리를 독립적으로 학습하고 예측값을 평균  |
| Gradient Boosting | 이전 트리의 오차를 다음 트리가 순차적으로 보완 |
| XGBoost           | 정규화와 최적화가 적용된 부스팅          |
| LightGBM          | 효율적인 트리 성장 방식으로 대규모 데이터 처리 |
| CatBoost          | 범주형 특성 처리에 강점을 가진 부스팅      |

단일 트리는 설명 가능성이 중요할 때 유용하고, 예측 성능이 더 중요하다면 랜덤 포레스트나 부스팅 계열 모델을 함께 비교하는 것이 좋다.

---

### 참고 자료

* [Tistory: Decision Tree Regression 개념과 Python 예제](https://riverzayden.tistory.com/6)
* [Towards Data Science: Decision Tree Regressor Explained](https://towardsdatascience.com/decision-tree-regressor-explained-a-visual-guide-with-code-examples-fbd2836c3bef/)
* [Tistory: DecisionTreeRegressor 회귀 트리 모델](https://everyday-joyful.tistory.com/entry/DecisionTreeRegressor-%ED%9A%8C%EA%B7%80-%ED%8A%B8%EB%A6%AC-%EB%AA%A8%EB%8D%B8)
* [Tistory: DecisionTreeClassifier와 DecisionTreeRegressor](https://zephyrus1111.tistory.com/227)
* [scikit-learn docs: DecisionTreeRegressor](https://scikit-learn.org/stable/modules/generated/sklearn.tree.DecisionTreeRegressor.html)
* [scikit-learn docs: Decision Trees](https://scikit-learn.org/stable/modules/tree.html)
