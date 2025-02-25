---
layout: post
comments: true
sitemap:
    changefreq: daily
    priority: 0.5

title: "[DISCRETE MATHEMATICS] 이산수학 논리"
excerpt: ""

date: 2022-10-07
last_modified_at: 

tags: [DISCRETE MATHEMATICS]
---

# 목차
* [명제와 진릿값](#명제와-진릿값)
* [논리연산자](#논리연산자)
* [합성명제](#합성명제)
* [조건명제](#조건명제)
* [논리연산자의 우선순위](#논리연산자의-우선순위)
* [논리적 동치](#논리적-동치)
* [명제함수](#명제함수)
* [한정자](#한정자)
* [한정자와 논리 연산자](#한정자와-논리-연산자)
* [추론](#추론)
* [유효추론과 허위추론](#유효추론과-허위추론)
* [논리적 추론법칙](#논리적-추론법칙)

# 명제와 진릿값
1. 명제(Proposition): 객관적인 기준으로 진릿값을 구분할 수 있는 문장이나 수식: 영어 소문자 p, q, r ...로 표현
2. 진릿값(Truth Value): 참(true: T)이나 거짓(false: F)을 가리키는 값

# 논리연산자
1. 부정(NOT): **~p** 또는 **¬p**
<table>
    <thead>
        <tr>
            <th>p</th>
            <th>~p</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>T</td>
            <td>F</td>
        </tr>
        <tr>
            <td>F</td>
            <td>T</td>
        </tr>
    </tbody>
</table>

2. 논리곱(AND): **p ∧ q**
<table>
    <thead>
        <tr>
            <th>p</th>
            <th>q</th>
            <th>p ∧ q</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>T</td>
            <td>T</td>
            <td>T</td>
        </tr>
        <tr>
            <td>T</td>
            <td>F</td>
            <td>F</td>
        </tr>
        <tr>
            <td>F</td>
            <td>T</td>
            <td>F</td>
        </tr>
        <tr>
            <td>F</td>
            <td>F</td>
            <td>F</td>
        </tr>
    </tbody>
</table>

3. 논리합(OR): **p ∨ q**
<table>
    <thead>
        <tr>
            <th>p</th>
            <th>q</th>
            <th>p ∨ q</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>T</td>
            <td>T</td>
            <td>T</td>
        </tr>
        <tr>
            <td>T</td>
            <td>F</td>
            <td>T</td>
        </tr>
        <tr>
            <td>F</td>
            <td>T</td>
            <td>T</td>
        </tr>
        <tr>
            <td>F</td>
            <td>F</td>
            <td>F</td>
        </tr>
    </tbody>
</table>

4. 배차적 논리합(Exclusive OR: XOR): **p ⊕ q ≡ (~p ∧ q) ∨ (p ∧ ~q)**
<table>
    <thead>
        <tr>
            <th>p</th>
            <th>q</th>
            <th>p ⊕ q</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>T</td>
            <td>T</td>
            <td>F</td>
        </tr>
        <tr>
            <td>T</td>
            <td>F</td>
            <td>T</td>
        </tr>
        <tr>
            <td>F</td>
            <td>T</td>
            <td>T</td>
        </tr>
        <tr>
            <td>F</td>
            <td>F</td>
            <td>F</td>
        </tr>
    </tbody>
</table>

# 합성명제
합성명제(Compound Proposition): 하나 이상의 명제들이 논리연산자에 의해 결합된 명제
1. 항진명제(Tautology): **T**
    - 합성명제를 구성하는 단일명제의 진리값에 상관없이 __합성명제의 진릿값이 항상 참(T)인 명제__
2. 모순명제(Contradiction): **F**
    - 합성명제를 구성하는 단일명제의 진리값에 상관없이 __합성명제의 진릿값이 항상 거짓(F)인 명제__
3. 사건명제(Contigency)
    - __항진명제도 모순명제도 아닌 합성명제__

# 조건명제
1. 조건명제(Conditional Proposition) / 함축(Implication): **p → q ≡ ~p ∨ q**
<table>
    <thead>
        <tr>
            <th>p</th>
            <th>q</th>
            <th>p → q</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>T</td>
            <td>T</td>
            <td>T</td>
        </tr>
        <tr>
            <td>T</td>
            <td>F</td>
            <td>F</td>
        </tr>
        <tr>
            <td>F</td>
            <td>T</td>
            <td>T</td>
        </tr>
        <tr>
            <td>F</td>
            <td>F</td>
            <td>T</td>
        </tr>
    </tbody>
</table>

2. 쌍방조건명제(Biconditional Proposition): **p ↔ q ≡ (p → q) ∧ (q → p) ≡ ~(p ⊕ q)**
<table>
    <thead>
        <tr>
            <th>p</th>
            <th>q</th>
            <th>p ↔ q</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>T</td>
            <td>T</td>
            <td>T</td>
        </tr>
        <tr>
            <td>T</td>
            <td>F</td>
            <td>F</td>
        </tr>
        <tr>
            <td>F</td>
            <td>T</td>
            <td>F</td>
        </tr>
        <tr>
            <td>F</td>
            <td>F</td>
            <td>T</td>
        </tr>
    </tbody>
</table>

3. 역(Converse), 이(Inverse), 대우(Contraposition)
<table>
    <thead>
    <tr>
        <th>p</th>
        <th>q</th>
        <th>p → q<br>조건명제</th>
        <th>q → p<br>역</th>
        <th>~p → ~q<br>이</th>
        <th>~q → ~p<br>≡ p → q<br>대우</th>
    </tr>
    </thead>
    <tbody>
        <tr>
            <td>T</td>
            <td>T</td>
            <td>T</td>
            <td>T</td>
            <td>T</td>
            <td>T</td>
        </tr>
        <tr>
            <td>T</td>
            <td>F</td>
            <td>F</td>
            <td>T</td>
            <td>T</td>
            <td>F</td>
        </tr>
        <tr>
            <td>F</td>
            <td>T</td>
            <td>F</td>
            <td>F</td>
            <td>F</td>
            <td>T</td>
        </tr>
        <tr>
            <td>F</td>
            <td>F</td>
            <td>T</td>
            <td>T</td>
            <td>T</td>
            <td>T</td>
        </tr>
    </tbody>
</table>

# 논리연산자의 우선순위
<table>
    <thead>
        <tr>
            <th>우선순위</th>
            <th>연산자</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>1</td>
            <td>()</td>
        </tr>
        <tr>
            <td>2</td>
            <td>~</td>
        </tr>
        <tr>
            <td>3</td>
            <td>∧</td>
        </tr>
        <tr>
            <td>4</td>
            <td>∨</td>
        </tr>
        <tr>
            <td>5</td>
            <td>⊕</td>
        </tr>
        <tr>
            <td>6</td>
            <td>→</td>
        </tr>
        <tr>
            <td>7</td>
            <td>↔</td>
        </tr>
    </tbody>
</table>

# 논리적 동치
논리적 동치(Logically Equivalence): **P ≡ Q**
- __두 개의 합성명제 P와 Q의 진릿값이 서로 같은 경우__
<table>
    <thead>
        <tr>
            <th>법칙</th>
            <th colspan = "2">논리적 동치</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>항등법칙(Identity Law)</td>
            <td>p ∧ T ≡ p</td>
            <td>p ∨ F ≡ p</td>
        </tr>
        <tr>
            <td>지배법칙(Domination Law)</td>
            <td>p ∨ T ≡ T</td>
            <td>p ∧ F ≡ F</td>
        </tr>
        <tr>
            <td>부정법칙(Negation Law)</td>
            <td>p ∧ ~p ≡ F</td>
            <td>p ∨ ~p ≡ T</td>
        </tr>
        <tr>
            <td>이중 부정법칙(Double Negation Law)</td>
            <td colspan="2">~(~p) ≡ p</td>
        </tr>
        <tr>
            <td>멱등법칙(Idempotent Law)</td>
            <td>p ∧ p ≡ p</td>
            <td>p ∨ p ≡ p</td>
        </tr>
        <tr>
            <td>교환법칙(Commutative Law)</td>
            <td>p ∧ q ≡ q ∧ p</td>
            <td>p ∨ q ≡ q ∨ p</td>
        </tr>
        <tr>
            <td>결합법칙(Associative Law)</td>
            <td>(p ∧ q) ∧ r ≡ p ∧ (q ∧ r)</td>
            <td>(p ∨ q) ∨ r ≡ p ∨ (q ∨ r)</td>
        </tr>
        <tr>
            <td>분배법칙(Distributive Law)</td>
            <td>p ∨ (q ∧ r) ≡ (p ∨ q) ∧ (p ∨ r)</td>
            <td>p ∧ (q ∨ r) ≡ (p ∧ q) ∨ (p ∧ r)</td>
        </tr>
        <tr>
            <td>드모르간의 법칙(De Morgan's Law)</td>
            <td>~(p ∧ q) ≡ ~p ∨ ~q</td>
            <td>~(p ∨ q) ≡ ~p ∧ ~q</td>
        </tr>
        <tr>
            <td>흡수법칙(Absorption Law)</td>
            <td>p ∧ (p ∨ q) ≡ p</td>
            <td>p ∨ (p ∧ q) ≡ p</td>
        </tr>
        <tr>
            <td>함축법칙(Implication Law)</td>
            <td colspan="2">p → q ≡ ~p ∨ q</td>
        </tr>
    </tbody>
</table>

# 명제함수
1. 명제함수(Propositional Function): **P(x)**
    - 논의영역이 주어진 변수 x를 포함하여 진릿값을 판별할 수 있는 문장이나 수식
2. 논의영역(Domain of Discourse): **D**
    - 명제함수에 포함된 변수 x의 범위이나 값

# 한정자
1. 전체/전칭한정자(Universal Quantifier): **∀**
    - __논의영역의 모든 값__ ex) 논의영역 D에 속하는 모든 x에 대한 명제 P(x): ∀xP(x)
2. 존재한정자(Existential Quantifier): **∃**
    - __논의영역 중 어떤 값__ ex) 논의영역 D에 속하는 원소 중 어떤 x에 대한 명제 P(x): ∃xP(x)

# 한정자와 논리 연산자
<table>
    <thead>
        <tr>
            <th>∀</th>
            <th>∃</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>∀x(P(x) ∧ Q(x)) ≡ ∀xP(x) ∧ ∀xQ(x)</td>
            <td>∃x(P(x) ∧ Q(x)) ≡ ∃xP(x) ∧ ∃xQ(x)</td>
        </tr>
        <tr>
            <td>∀x(P(x) ∨ Q(x)) ≡ ∀xP(x) ∨ ∀xQ(x)</td>
            <td>∃x(P(x) ∨ Q(x)) ≡ ∃xP(x) ∨ ∃xQ(x)</td>
        </tr>
        <tr>
            <td>~(∀xP(x)) ≡ ∃x(~P(x))</td>
            <td>~(∃xP(x)) ≡ ∀x(~P(x))</td>
        </tr>
    </tbody>
</table>

# 추론
1. 추론(Inference)/논증(Argument)
    - 참(T)인 명제를 근거로 하여 다른 명제가 참(T)임을 유도하는 방식
2. 가정/전제(Hypothesis), 결론(Conclusion)
    - 가정/전제: __결론의 근거가 되는 최종 결론을 제외한 명제, 진릿값이 참(T)으로 간주되는 명제__
    - 결론: 주어진 전제에 의해 유도된 명제

# 유효추론과 허위추론
1. 유효(정당한)추론
    - 주어진 전제를 이용해 유도된 결론이 정확한 추론, __전제가 참(T)일 때 결론이 모두 참(T)인 추론__
2. 허위(부당한)추론
    - 주어진 전제를 이용해 유도된 결론이 틀린 추론, __전제가 참(T)인 경우, 결론이 거짓(F)인 경우가 하나라도 있는 추론__
  
* 유효추론 예: 전제가 모두 참(T)인 경우에 결론인 q의 진릿값 역시 참(T)이므로 이 추론은 유효추론이다.
<table>
    <thead>
        <tr>
            <th>전제</th>
            <th>결론</th>
            <th>전제</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>p</td>
            <td>q</td>
            <td>p → q</td>
        </tr>
        <tr>
            <td style = "color: red">T</td>
            <td style = "color: red">T</td>
            <td style = "color: red">T</td>
        </tr>
        <tr>
            <td>T</td>
            <td>F</td>
            <td>F</td>
        </tr>
        <tr>
            <td>F</td>
            <td>T</td>
            <td>T</td>
        </tr>
        <tr>
            <td>F</td>
            <td>F</td>
            <td>T</td>
        </tr>
    </tbody>
</table>

* 허위추론 예: 전제가 모두 참(T)인 경우에 결론인 p의 진리값 중 거짓(F)이 존재하므로 이 추론은 허위추론이다.
<table>
    <thead>
        <tr>
            <th>결론</th>
            <th>전제</th>
            <th>전제</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>p</td>
            <td>q</td>
            <td>p → q</td>
        </tr>
        <tr>
            <td style = "color: red">T</td>
            <td style = "color: red">T</td>
            <td style = "color: red">T</td>
        </tr>
        <tr>
            <td>T</td>
            <td>F</td>
            <td>F</td>
        </tr>
        <tr>
            <td style = "color: red">F</td>
            <td style = "color: red">T</td>
            <td style = "color: red">T</td>
        </tr>
        <tr>
            <td>F</td>
            <td>F</td>
            <td>T</td>
        </tr>
    </tbody>
</table>

# 논리적 추론법칙
<table>
    <thead>
        <tr>
            <th>법칙 이름</th>
            <th>추론법칙</th>
            <th>항진명제</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>논리곱<br>(Conjunction)</td>
            <td>p<br>q<br>∴ p ∧ q</td>
            <td>None</td>
        </tr>
        <tr>
            <td>선언적 부가<br>(Disjunctive Addition)</td>
            <td>p<br>∴ p ∨ q</td>
            <td>p → (p ∨ q)</td>
        </tr>
        <tr>
            <td>단순화<br>(Simplication)</td>
            <td>p ∧ q<br>∴ p(or q)</td>
            <td>(p ∧ q) → p(or q)</td>
        </tr>
        <tr>
            <td>긍정논법<br>(Modus Ponens)</td>
            <td>p<br>p → q<br>∴ q</td>
            <td>{p ∧ (p → q)} → q</td>
        </tr>
        <tr>
            <td>부정논법<br>(Modus Tollens)</td>
            <td>~p<br>p → q<br>∴ p ∨ q</td>
            <td>{~p ∧ (p → q)} → ~p</td>
        </tr>
        <tr>
            <td>선언적 삼단논법 / 소거<br>(Disjunctive Syllogism)</td>
            <td>p ∨ q<br>~q<br>∴ p</td>
            <td>{(p ∨ q) ∧ ~q} → p</td>
        </tr>
        <tr>
            <td>가설적 삼단논법 / 추이<br> (Hypothetical Syllogism)</td>
            <td>p → q<br>q → r<br>∴ p → r</td>
            <td>{(p → q) ∧ (q → r)} → (p → r)</td>
        </tr>
    </tbody>
</table>
