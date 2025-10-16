---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[DATABASE] Database란?"
excerpt: ""

date: 2025-03-16
last_modified_at: 

categories: [DATABASE]
tags: [DATABASE, TIL]
---

# 목차

1. [Database의 정의](#1-database의-정의)
1. [Database의 특성](#2-database의-특성)
1. [Database의 구조](#3-database의-구조)
1. [Database의 구성요소](#4-database의-구성요소)
1. [참고](#참고)

# DB(Database)
## 1. Database의 정의

**Database**: 한 조직의 여러 응용 시스템들이 공용(shared)하기 위해, 통합(integrated), 저장(stored)한 운영(operational) 데이터의 집합이다.  
-> 예시를 들어 설명하자면 데이터베이스가 Excel 파일이라면 테이블은 Excel 시트다.  
* **공용 데이터(Shared Data)**: Database는 한 조직의 여러 응용 프로그램이 공동으로 소유, 유지, 사용하는 데이터이다.
* **통합 데이터(Integrated Data)**: Database는 중복된 데이터 제거한다. 그러나 실제로 중복성을 완전히 배제하는 것이 아니고 경우에 따라 효율성을 증진시키기 위해 불가피하게 일부 데이터의 중복을 허용하기도 한다.
    * 최소의 중복(Minimal Redundancy) or 통제된 중복(Controlled Redundancy)
* **저장 데이터(Stored Data)**: Database는 컴퓨터가 접근 가능한 저장 매체(e.g. 테이프, 디스크 등)에 저장한다.
* **운영 데이터(Operational Data)**: Database는 한 조직의 고유 기능을 수행하기 위해 필요한 데이터이다.

## 2. Database의 특성

* **실시간 접근성(Real-time Accessibilities)**: 질의에 대한 실시간 처리 및 응답
* **계속적인 변화(Continuous Evolution)**: 갱신(삽입, 삭제, 수정) - 동적 특성
* **동시 사용(Concurrent Sharing)**: 여러 사용자가 동시에 사용
* **내용에 의한 참조(Content Reference)**: 위치나 주소가 아닌 값에 따라 참조

## 3. Database의 구조

**(관계형) 데이터베이스**: 테이블(table)들의 집합
* **테이블(table)**: 같은 레코드 타입(record type)을 따르는 레코드 인스턴스(record instance)의 집합

![그림1](https://github.com/aliquis-facio/aliquis-facio.github.io/blob/master/_image/2025-03-16-1.jpg?raw=true)  

![그림2](https://github.com/aliquis-facio/aliquis-facio.github.io/blob/master/_image/2025-03-16-2.jpg?raw=true)  

## 4. Database의 구성요소

개념적(conceptual) 구성요소
: DB 설계자 관점
: 현실 세계의 데이터: {개체 인스턴스(entity instance), 관계 인스턴스(relationship instance)}

논리적(logical) 구성요소
: DB 사용자 관점
: 컴퓨터 세계의 데이터베이스: {테이블(table)}
: 테이블 = {레코드 인스턴스(record instance)}

물리적(physical) 구성요소
: 저장관치 관점
: 저장장치의 데이터베이스: {파일(file)}
: 파일 내의 데이터를 빠르게 검색할 수 있는 인덱스(index)의 집합

# 참고

* [[Database] 인덱스(index)란?](https://mangkyu.tistory.com/96)
* [What is a Database Index?](https://www.codecademy.com/article/sql-indexes)
* [데이터베이스의 개념](https://blog.naver.com/k97b1114/140153610388)
* [데이터베이스의 개념적 구성(개체, 속성, 관계)](https://kingnamji.tistory.com/34)