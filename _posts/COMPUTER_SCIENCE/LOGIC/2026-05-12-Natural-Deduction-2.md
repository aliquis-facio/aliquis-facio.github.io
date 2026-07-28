---
layout: post
comments: true
sitemap:

title: "[LOGIC] 자연 연역 2"
excerpt: "대치 규칙 10가지"

date: 2026-05-19
last_modified_at: 2026-05-19

categories: [LOGIC]
tags: [LOGIC]
---

<!-- markdownlint-disable MD007 MD010 MD025 MD033 -->

# 자연 연역 2

자연 연역: **정해진 추론 규칙을 사용해 논증의 타당성을 단계적으로 증명하는 방법**이다.

## 목차

1. [대치 규칙의 의미](#1-대치-규칙의-의미)
1. [10가지 대치 규칙](#2-10가지-대치-규칙)
    1. [드 모르간의 규칙 (De Morgan’s Rule, DM)](#21-드-모르간의-규칙-de-morgans-rule-dm)
    1. [교환법칙 (Commutativity, Com)](#22-교환법칙-commutativity-com)
    1. [결합법칙 (Associativity, Assoc)](#23-결합법칙-associativity-assoc)
    1. [배분법칙 (Distribution, Dist)](#24-배분법칙-distribution-dist)
    1. [이중 부정 (Double Negation, DN)](#25-이중-부정-double-negation-dn)
    1. [대우 규칙 (Transposition, Trans)](#26-대우-규칙-transposition-trans)
    1. [단순 함축 (Material Implication, Impl)](#27-단순-함축-material-implication-impl)
    1. [단순 동치 (Material Equivalence, Equiv)](#28-단순-동치-material-equivalence-equiv)
    1. [수출입 규칙 (Exportation, Exp)](#29-수출입-규칙-exportation-exp)
    1. [동어반복 (Tautology, Taut)](#210-동어반복-tautology-taut)

## 1. 대치 규칙의 의미

대치 규칙: **논리적 동치(logical equivalence)** 인 두 식을 서로 바꾸어 쓸 수 있게 해 주는 규칙이다.

## 2. 10가지 대치 규칙

### 2.1. 드 모르간의 규칙 (De Morgan’s Rule, DM)

- `~(p∙q) ∷ (~p∨~q)`
- `~(p∨q) ∷ (~p∙~q)`

의미:

- “p와 q가 모두 참인 것은 아니다”는 “p가 거짓이거나 q가 거짓이다”와 같다.
- “p 또는 q가 참인 것은 아니다”는 “p도 거짓이고 q도 거짓이다”와 같다.

### 2.2. 교환법칙 (Commutativity, Com)

- `(p∨q) ∷ (q∨p)`
- `(p∙q) ∷ (q∙p)`

의미:

- 선언문과 연언문은 순서를 바꾸어도 뜻이 변하지 않는다.

예시:

- `A∨B` 에서 `B∨A` 로 바꾼 뒤 선언적 삼단논법을 적용해 결론 `A`를 도출할 수 있다.

### 2.3. 결합법칙 (Associativity, Assoc)

- `p∨(q∨r) ∷ (p∨q)∨r`
- `p∙(q∙r) ∷ (p∙q)∙r`

의미:

- 괄호의 묶는 방식이 달라져도 진리값은 달라지지 않는다.

### 2.4. 배분법칙 (Distribution, Dist)

- `p∙(q∨r) ∷ (p∙q)∨(p∙r)`
- `p∨(q∙r) ∷ (p∨q)∙(p∨r)`

의미:

- 연언과 선언이 서로 분배될 수 있다.  
- 복합 명제를 다른 형태로 변형하여 추론 규칙을 적용하기 쉽게 만든다.

### 2.5. 이중 부정 (Double Negation, DN)

- `p ∷ ~~p`

의미:

- 어떤 명제가 참이라는 것은 그것이 거짓이 아님과 동치이다.

### 2.6. 대우 규칙 (Transposition, Trans)

- `(p⊃q) ∷ (~q⊃~p)`

의미:

- “p이면 q이다”는 “q가 거짓이면 p가 거짓이다”와 동치이다.

### 2.7. 단순 함축 (Material Implication, Impl)

- `(p⊃q) ∷ (~p∨q)`

의미:

- 조건문을 선언문 형태로 바꾸는 규칙이다.
- “p이면 q이다”는 “p가 거짓이거나 q가 참이다”와 같다.

### 2.8. 단순 동치 (Material Equivalence, Equiv)

- `(p≡q) ∷ (p⊃q)∙(q⊃p)`
- `(p≡q) ∷ (p∙q)∨(~p∙~q)`

의미:

- 동치문은 두 조건문의 결합으로도, 두 명제가 함께 참이거나 함께 거짓인 경우의 선언으로도 바꿀 수 있다.

### 2.9. 수출입 규칙 (Exportation, Exp)

- `[(p∙q)⊃r] ∷ [p⊃(q⊃r)]`

의미:

- 조건문의 전건에 연언이 있을 때, 이를 중첩 조건문으로 바꿀 수 있다.

### 2.10. 동어반복 (Tautology, Taut)

- `p ∷ (p∨p)`
- `p ∷ (p∙p)`

의미:

- 같은 명제를 반복한 선언 또는 연언은 원래 명제와 동치이다.
