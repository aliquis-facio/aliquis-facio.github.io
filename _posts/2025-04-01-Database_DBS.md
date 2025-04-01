---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[DATABASE] DBS(DataBase System)란?"
excerpt: "DBS(DataBase System)"

date: 2025-04-01
last_modified_at: 

categories: [DATABASE]
tags: [DATABASE, TIL]
---

# 목차

# DBS(Database System)
## 1. DBS란?
DBS: 기업 혹은 조직이 DBMS를 사용해 개발한 응용 프로그램을 통해 관련 데이터를 관리하고 있는 시스템이다.

## 2. DBS의 구성요소
데이터 스키마(Data Schema), 데이터 언어(Data Language), 사용자(User), 데이터베이스 관리시스템(DBMS), 데이터베이스 관리자(DBA)로 구성되어 있다.

### 2.1. 데이터 스키마(Data Schema)
스키마(Schema): 데이터베이스의 구조(테이블의 포맷)와 제약조건의 명세한다.

데이터 스키마의 종류 - 3단계 스키마
* 개념 스키마(Conceptual -)
* 외부 스키마(External -)
* 내부 스키마(Internal -)

개념 스키마
: 기관 전체의 데이터베이스 정의한다.
: 기관의 모든 응용에 대한 통합된 데이터 구조를 나타낸다.
: schema

외부 스키마
: 개념 스키마의 부분 집합이다.
: 개개 부서의 데이터베이스 정의한다.
: 전체 데이터베이스의 논리적인 부분이다.
: subschema

내부 스키마
: 저장 장치 관점에서 표현한다.
: 개념 스키마의 저장 구조를 정의한다.

-> 일반적으로 스키마는 개념 스키마를 지칭한다.
스키마 다이어그램: 스키마를 그래픽 형태로 표현한다. e.g. E-R Diagram

스키마는 컴파일되어 데이터 사전(시스템 카탈로그)에 저장된다.

데이터 사전(Data Dictionary)
: 시스템 내의 모든 객체들에 대한 정의나 명세에 관한 정보를 수록한다.(시스템 데이터베이스)
: 시스템 카탈로그(System Catalog)라고도 한다.
: 데이터베이스 관리자(DBA)의 도구이다.

#### 3단계 스키마의 도입 이유
DBMS에서 데이터 독립성(Data Independency)의 구현 방법을 제공한다.
3단계 스키마 사이의 사상(Mapping)을 통해 데이터 독립성을 제공한다.

* 외부 <-> 개념 단계 간의 사상
외부 스키마와 개념 스키마 간의 대응 관계 정의한다.
응용 인터페이스(Application Interface)
논리적 데이터 독립성 제공한다. * 새로운 것을 추가할 때만
스키마를 바꿔도 응용 프로그램을 바꾸지 않아도 된다.

* 개념 <-> 내부 단계 간의 사상
개념 스키마와 내부 스키마 간의 대응 관계 정의한다.
저장 인터페이스(Storage Interface)
물리적 데이터 독립성 제공한다.
저장구조를 바꿔도 개념스키마를 바꾸지 않아도 된다.

### 2.2. 데이터 언어(Data Language)
DBMS의 필수 기능
: 데이터 정의(Data Definition)
: 데이터 조작(Data Manipulation)
: 데이터 제어(Data Control)

데이터 언어(Data Language): 데이터베이스의 정의, 조작, 제어를 위한 언어이다.

데이터 언어의 종류
: 데이터 정의어(DDL, Data Definition Language)
: 데이터 조작어(DML, Data Manipulation Language)
: 데이터 제어어(DCL, Data Control Language)

#### 2.2.1. 데이터 정의어(DDL, Data Definition Language)
데이터 정의어(DDL): 데이터베이스(테이블)의 정의 및 수정
e.g. CREATE

요소
논리적 데이터 구조의 정의
: 외부 스키마, 개념 스키마의 기술
: Subschema DDL, Schema DDL
물리적 데이터 구조의 저으이
: 내부 스키마의 기술
: 데이터 저장 정의어(DSDL, Data Storage Definition Language)

#### 2.2.2. 데이터 조작어(DML, Data Manipulation Language)
데이터 조작어(DML): 사용자(응용 프로그램)와 DBMS 사이의 통신 수단, 데이터 처리 연산(데이터의 검색과 갱신(삽입, 삭제, 수정) 연산) 수행

특징
    비절차적(Non-Procedural) 언어
    두 가지 방식으로 사용
        독자적, 대화식 사용 가능(커맨드 타입)
        응용 프로그램 속에 삽입(embedded)되어 사용 가능

프로그래밍 언어
: 절차적(Procedural) 언어: How to Do를 명세, 저급어
: 비절차적(Non-Procedural) 언어: What to Do만 명세, 고급어

데이터 부속어(DSL, Data SubLanguage): Jaba, C++, Python 등과 같은 호스트 언어(Host Language)로 작성된 호스트 프로그램(Host Program) 속에 삽입(embedded)되어 사용되는 DML

#### 2.2.3. 데이터 제어어(DCL, Data Control Language)
데이터 제어어(DCL): 데이터베이스 관리를 위해, 데이터 제어 요구를 정의하고 기술하는 언어이다.

데이터 관리를 위한 도구
: 데이터 보안(Security)
: 데이터 무결성(Integrity)
: 데이터 회복(Recovery)
: 병행 수행(Concurrency)

### 2.3. 사용자(User)
일반 사용자(End User): DML을 통해서 데이터베이스를 접근한다. 실제로는 menu, form, graphics 등을 통해 DML을 간접적으로 사용한다.
응용 프로그래머(Application Programmer): 호스트 언어(Java/Python 등) + DML을 사용하여 응용 프로그램을 작성한다. -> DSL을 통해서 데이터베이스에 접근한다.
데이터베이스 설계자: DDL을 통해 DB 스키마를 정의하는 사람이다.
데이터베이스 관리자(DBA): DCL을 통해 DBMS를 운영하고 제어하는 사람이다.

### 2.4. 데이터베이스 관리시스템(DBMS)

### 2.5. 데이터베이스 관리자(DBA)