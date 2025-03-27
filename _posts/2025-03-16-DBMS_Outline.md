---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[DATABASE] DBMS(Database Management System)란?"
excerpt: "DBMS(Database Management System)의 개요"

date: 2025-03-16
last_modified_at: 2025-03-28

categories: [DATABASE]
tags: [DATABASE, TIL]
---

# 목차
1. [DBMS의 발전 배경: 파일 시스템(File System)](#1-dbms의-발전-배경-파일-시스템file-system)
    1. [파일 시스템의 문제점](#11-파일-시스템의-문제점)
1. [DBMS(Database Management System)](#2-dbmsdatabase-management-system)
1. [데이터 독립성(Data Independency)](#3-데이터-독립성data-independency)
    1. [데이터 구조 간의 사상과 데이터 독립성](#31-데이터-구조-간의-사상과-데이터-독립성)
1. [DBMS의 필수 기능](#4-dbms의-필수-기능)
1. [DBMS의 장단점](#5-dbms의-장단점)

# DBMS(Database Management System)
## 1. DBMS의 발전 배경: 파일 시스템(File System)
**파일 시스템(File System)**: 데이터의 입출력을 전담하는 별도의 시스템. 데이터의 공용이 가능하지만 데이터 파일의 내용을 제어하지 않았음.
![그림](https://github.com/aliquis-facio/aliquis-facio.github.io/blob/master/_image/2025-03-17-1.png?raw=true)  

### 1.1. 파일 시스템의 문제점
* **데이터 종속성(Data Dependency)**: 응용 프로그램과 데이터 사이의 의존관계로 인해 데이터의 포맷, 접근 방법 변경 시에 관련된 응용 프로그램 또한 변경해야 함.
* **데이터 중복성(Data Redundancy)**: 한 시스템 내에 내용이 같은 데이터가 중복되게 저장, 관리 되는 것.
    * **무결성(Integrity)**: 저장된 데이터 간의 관계에서 모순이 없도록 정확성 유지
    * **일관성(Consistency)**: 다수 사용자가 특정 데이터를 동시에 변경할 때 데이터의 일관성 유지  
-> 일반적으로, 무결성은 위의 무결성 및 일관성 모두 포함한 개념이다.

## 2. DBMS(Database Management System)
**DBMS(Data Base Management System)**: 관련 데이터를 통합하여, 데이터를 공용할 수 있도록 관리하는 소프트웨어로, 파일 시스템의 데이터 종속성과 중복성 문제를 해결했다.  
데이터베이스를 운영 및 관리. 계층형, 망형, 관계형 등 다양한 종류의 DBMS가 존재하지만 <mark>대부분 관계형 DBMS(RDMBS)의 형태로 사용</mark>되고 있다. RDBMS의 데이터베이스는 하나 이상의 행(row)과 열(column)로 이루어진 <mark>테이블 형식</mark>을 데이터를 제공한다.  
-> DBMS는 엑셀 프로그램 그 자체로 예를 들 수 있겠다.
아래는 데이터베이스 테이블 구조 예시
![그림](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-12-10-1.png?raw=true)  

## 3. 데이터 독립성(Data Independency)
* **논리적 데이터 독립성(Logical Data Independency)**: 응용 프로그램에 영향을 주지 않고, 데이터베이스의 논리적 구조를 변경시킬 수 있는 능력
* **물리적 데이터 독립성(Physical Data Independency)**: 데이터베이스의 논리적 구조에 영향을 주지 않고, 데이터의 물리적 구조를 변경시킬 수 있는 능력

![그림](https://github.com/aliquis-facio/aliquis-facio.github.io/blob/master/_image/2025-03-17-2.png?raw=true)  

## 4. DBMS의 필수 기능
총 3개의 기능(데이터 정의(Data Definition) 기능, 데이터 조작(Data Manipulation) 기능, 데이터 제어(Data Control) 기능)이 필수적으로 존재한다.

### 4.1. 데이터 정의(Data Definition) 기능
다양한 형태의 데이터 처리 요구를 지원할 수 있도록, 적절한 데이터베이스 구조(테이블)를 정의할 수 있는 기능이다. 주로 데이터베이스 설계자가 사용한다.

데이터 구조 정의 시 고려사항
* 목표 DBMS가 지원하는 데이터 모델에 맞게 기술할 수 있어야 한다.
* 물리적 저장 장치에 저장하는 데 필요한 명세 포함해야 한다.
* 데이터의 논리적 구조와 물리적 구조 사이의 사상(mapping)을 명세해야 한다.

### 4.2. 데이터 조작(Data Manipulation) 기능
사용자의 요구에 따라, 체계적으로 데이터베이스를 접근하고 조작하는 기능이다. 데이터 처리 언어로써, 주로 DBMS 응용 프로그래머가 사용한다.
* 데이터 검색(retrieval, query)
* 데이터 갱신(update): 삽입(insert), 삭제(delete), 수정(modify)

조작 기능(데이터 처리 언어)의 요건
* 조작 방법이 쉽고 자연스러워야 한다.
* 명확하고 완전하게, 데이터 조작의 명세가 가능해야 한다.
* 효율적인 데이터 접근, 처리가 가능해야 한다.

### 4.3. 데이터 제어(Data Control) 기능
저장된 데이터의 무결성과 보안성을 유지하는 기능이다. 주로 DBA(Database Administrator)가 사용한다.

제어 기능의 요건
* 무결성 유지
* 보안, 권한 검사
* 병행 수행 제어(Concurrency Control)

## 5. DBMS의 장단점
### 5.1. 장점
* 데이터 통합을 통한 데이터 중복의 최소화
* 데이터의 공용
* 데이터의 무결성 유지
* 데이터의 보안 보장
* 전체 데이터 요구의 조정, 표준화

### 5.2. 단점
* 운영비 증대
* 자료 처리의 복잡화
* 복잡한 백업(backup)과 복구(recovery)
* 시스템의 취약성

# 참고
* [파일 시스템](https://ko.wikipedia.org/wiki/%ED%8C%8C%EC%9D%BC_%EC%8B%9C%EC%8A%A4%ED%85%9C)
* [[데이터베이스 기본] 외부/개념/내부 스키마와 데이터 독립성](https://blog.naver.com/jvioonpe/220353582460)