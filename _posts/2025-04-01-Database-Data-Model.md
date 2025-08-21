---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[DATABASE] Data Model이란?"
excerpt: "Data Model이란?"

date: 2025-04-01
last_modified_at: 

categories: [DATABASE]
tags: [DATABASE, TIL]
---

# 목차

# 관계 데이터 구조
## 데이터 모델(Data Model)이란?
Data Model: 사용자에게 데이터에 대한 개념적 표현(Conceptual Representation)을 제공하는 데 이용되는 추상화의 한 형태이다. 컴퓨터 기억 장소의 개념보다 사용자가 더 이해하기 쉬운 개체, 성질, 개체 간의 관련성과 같은 논리적 개념을 사용한다.

데이터 모델은 다음 3가지 요소를 수학적으로 정의해야 한다.
`D = <S, O, C>`
* 데이터 구조(Data Structure): 정적 성질로, 개체와 이들 간의 관계를 추상적으로 명세한다.
* 제약 조건(Constraints): 개체 인스턴스에 대한 논리적 혹은 의미상 제약을 명세한다.
* 연산(Operations): 동적 성질로, 개체 인스턴스를 처리하는 작업(검색과 갱신 등)을 명세한다.

-> 데이터 구조에 특정 연산을 적용한 전후에도 제약 조건이 유지될 수 있을 때, 해당 연산의 실행이 허용된다. DBMS 구현의 논리적 기반을 제공한다.

## 관계 데이터 모델(Relational -)
관계형 DBMS(RDBMS, Relational DBMS) 소프트웨어 개발의 이론적 증거로 데이터베이스의 논리적 설계에 적용한다.

관계 데이터 모델의 정의
S: 관계 데이터 구조(Relational Data Structure)
O: 관계 제약(Relational Constraints)
C: 관계 연산(Relational Operations)

## 관계 데이터 구조(Relational Data Structure)
