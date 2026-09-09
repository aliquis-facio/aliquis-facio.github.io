---
layout: post
comments: true
sitemap:

title: "[MySQL] DATA TYPE"
excerpt: "모의해킹 취업반 스터디 7기 4주차"

date: 2024-11-13
last_modified_at: 

categories: [DATABASE]
tags: [DATABASE]
---

<!-- markdownlint-disable MD004 MD025 MD033 -->

# MySQL Data Type

MySQL의 자료형은 크게 다음과 같이 구분할 수 있다.

1. 숫자형
2. 문자형
3. 날짜 및 시간형
4. JSON형
5. 공간 자료형

## 목차

1. [숫자형](#1-숫자형)
    1. [정수형](#11-정수형)
    2. [실수형](#12-실수형)
        1. [고정 소수점형](#121-고정-소수점)
        2. [부정 소수점형](#122-부동-소수점)
    3. [BIT형](#13-bit형)
2. [문자형](#2-문자형)
    1. [CHAR와 VARCHAR](#21-char와-varchar)
    2. [BINARY와 VARBINARY](#22-binary와-varbinary)
    3. [TEXT와 BLOB](#23-text와-blob)
    4. [ENUM과 SET](#24-enum과-set)
3. [날짜 및 시간형](#3-날짜-및-시간)
    1. [DATETIME과 TIMESTAMP의 차이](#31-datetime과-timestamp의-차이)
4. [JSON형](#4-json형)
5. [공간 자료형](#5-공간-자료형)
6. [참고](#참고)

---

## 1. 숫자형

### 1.1. 정수형

| 데이터 타입 | 크기 | SIGNED 범위 | UNSIGNED 범위 |
| --- | ---: | ---: | ---: |
| `TINYINT` | 1바이트 | -128 ~ 127 | 0 ~ 255 |
| `SMALLINT` | 2바이트 | -32,768 ~ 32,767 | 0 ~ 65,535 |
| `MEDIUMINT` | 3바이트 | -8,388,608 ~ 8,388,607 | 0 ~ 16,777,215 |
| `INT`, `INTEGER` | 4바이트 | -2,147,483,648 ~ 2,147,483,647 | 0 ~ 4,294,967,295 |
| `BIGINT` | 8바이트 | -2^63 ~ 2^63−1 | 0 ~ 2^64−1 |

정수형은 기본적으로 `SIGNED`이고, 음수가 필요하지 않다면 `UNSIGNED`를 지정해 양수 범위를 넓힐 수 있다.

### 1.2. 실수형

실수형은 저장하는 방식에 따라 고정 소수점 방식, 부동 소수점 방식으로 나눠진다.

#### 1.2.1. 고정 소수점

| 데이터 타입 | 저장 크기 | 설명 |
| --- | ---: | --- |
| `DECIMAL(M,D)` | 자릿수에 따라 달라짐 | 정확한 고정 소수점 숫자 |
| `NUMERIC(M,D)` | `DECIMAL`과 동일 | `DECIMAL`의 동의어 |

- M: 전체 자릿수
- D: 소수점 이하 자릿수
- 정수부 자릿수: M-D
- M의 최댓값: 65
- D의 최댓값: 30
- D는 M보다 클 수 없음
- M을 생략하면 기본값은 10
- D를 생략하면 기본값은 0

`DECIMAL(M,D)`의 범위는 다음과 같이 표현할 수 있다.

$$
K = 10^{M-D}-10^{-D} \quad \Rightarrow \quad 
-K \sim K
$$

예를 들어 `DECIMAL(5,2)`의 범위는 다음과 같다.

```text
-999.99 ~ 999.99
```

#### 1.2.2. 부동 소수점

| 데이터 타입 | 크기 | 특징 |
| --- | ---: | --- |
| `FLOAT` | 4바이트 | 단정밀도 부동 소수점 |
| `DOUBLE`, `DOUBLE PRECISION`, `REAL` | 8바이트 | 배정밀도 부동 소수점 |

부동 소수점형은 값을 근삿값으로 저장한다. 따라서 정확한 값을 찾기 보다는 오차 범위를 사용하는 방식이 적절하다.

FLOAT, DOUBLE 등의 부동 소수점 유형은 MySQL 8.0.17 이후 버전부터 사용되지 않는다.

### 1.3. BIT형

| 데이터 타입 | 크기 | 설명 |
| --- | ---: | --- |
| `BIT(M)` | 약 `CEIL(M / 8)`바이트 | 1~64개의 비트 저장 |

`M`을 생략하면 기본값은 1이다.

## 2. 문자형

### 2.1. CHAR와 VARCHAR

| 데이터 타입 | 최대 길이 | 저장 방식 | 주요 용도 |
| --- | ---: | --- | --- |
| `CHAR(M)` | 255문자 | 고정 길이 | 국가 코드, 고정 길이 코드 |
| `VARCHAR(M)` | 최대 65,535바이트의 행 크기 제한 | 가변 길이 | 이름, 이메일, 제목 |
| `TINYTEXT` | 255바이트 | 가변 길이 | 짧은 텍스트 |
| `TEXT` | 65,535바이트 | 가변 길이 | 일반 본문 |
| `MEDIUMTEXT` | 16,777,215바이트 | 가변 길이 | 긴 문서 |
| `LONGTEXT` | 4,294,967,295바이트 | 가변 길이 | 매우 큰 텍스트 |

- `CHAR(M)`은 지정된 길이에 맞춰 오른쪽에 공백을 채워 저장한다. 일반적으로 조회할 때 후행 공백은 제거된다.
- `VARCHAR(M)`은 실제 문자열 길이만큼 저장하고, 길이를 나타내는 1~2바이트 정보를 추가한다. 저장 및 조회 시 후행 공백을 유지한다.

### 2.2. BINARY와 VARBINARY

| 데이터 타입 | 설명 |
| --- | --- |
| `BINARY(M)` | 고정 길이 바이트 문자열 |
| `VARBINARY(M)` | 가변 길이 바이트 문자열 |

`BINARY`와 `VARBINARY`는 바이트 단위로 비교된다.

### 2.3. TEXT와 BLOB

| 데이터 타입 | 텍스트 | 바이너리 | 최대 크기 |
| --- | --- | --- | --- |
| Tiny | `TINYTEXT` | `TINYBLOB` | 255바이트 |
| 일반 | `TEXT` | `BLOB` | 65,535바이트 |
| Medium | `MEDIUMTEXT` | `MEDIUMBLOB` | 16,777,215바이트 |
| Long | `LONGTEXT` | `LONGBLOB` | 4,294,967,295바이트 |

* `TEXT`: 문자 데이터 저장
* `BLOB`: 바이너리 데이터 저장
* `TEXT`는 문자 집합과 Collation의 영향을 받음
* `BLOB`은 바이트 값으로 비교
* 저장 크기는 실제 데이터 크기와 길이 정보에 따라 결정됨

`TEXT`와 `BLOB`에 인덱스를 생성할 때는 보통 인덱스 접두 길이를 지정해야 한다.

### 2.4. ENUM과 SET

|데이터 타입|설명|제한|
|---|---|--:|
|`ENUM`|목록 중 하나의 값 선택|최대 65,535개|
|`SET`|목록 중 여러 값 선택|최대 64개|

- `ENUM`: 값 종류가 자주 변경되거나 별도 속성이 필요하다면 참조 테이블을 사용하는 것이 유용하다.
- `SET`: RDBMS 정규화 관점에서는 다대다 관계 테이블로 분리하는 방식이 일반적으로 관리하기 쉽다.

## 3. 날짜 및 시간

| 데이터 타입 | 기본 크기 | 표현 범위 | 설명 |
| --- | ---: | --- | --- |
| `DATE` | 3바이트 | 1000-01-01 ~ 9999-12-31 | 날짜 |
| `DATETIME` | 5바이트 | 1000-01-01 00:00:00 ~ 9999-12-31 23:59:59 | 날짜와 시간 |
| `TIMESTAMP` | 4바이트 | 1970-01-01 00:00:01 UTC ~ 2038-01-19 03:14:07 UTC | Unix Epoch 기반 날짜와 시간 |
| `TIME` | 3바이트 | -838:59:59 ~ 838:59:59 | 시각 또는 시간 간격 |
| `YEAR` | 1바이트 | 1901 ~ 2155 및 0000 | 연도 |

MySQL 5.6.4 이후 `DATETIME`의 기본 저장 크기는 8바이트가 아니라 5바이트다.
`YEAR(2)` 와 같이 두 자리로 표기하는 데이터 유형은 MySQL 5.7 이후 버전부터 지원하지 않는다.
`YEAR(4)` 와 같이 명시적인 길이를 표기한 데이터 유형은 MySQL 8.0.19 이후 버전부터 사용되지 않는다.  

### 3.1. DATETIME과 TIMESTAMP의 차이

| 구분 | `DATETIME` | `TIMESTAMP` |
| --- | --- | --- |
| 기본 크기 | 5바이트 | 4바이트 |
| 표현 범위 | 1000년~9999년 | 1970년~2038년 |
| 시간대 변환 | 수행하지 않음 | 세션 시간대에 따라 변환 |
| 주요 용도 | 예약일, 생년월일, 현지 시각 | 생성·수정 시각, 시스템 이벤트 |

`TIMESTAMP`는 UTC 기준으로 저장되고, 저장하거나 조회할 때 현재 세션의 시간대에 따라 변환된다. 반면 `DATETIME`은 입력된 날짜와 시간을 그대로 저장한다.

## 4. JSON형

MySQL은 네이티브 `JSON` 자료형을 지원한다.

`JSON` 자료형의 주요 특징은 다음과 같다.

* 저장 시 JSON 문법 자동 검증
* 내부적으로 최적화된 바이너리 형식 사용
* JSON 경로를 이용한 검색 및 수정 지원
* 객체, 배열, 문자열, 숫자, Boolean, `null` 저장 가능
* 일반 인덱스를 JSON 열 자체에 직접 생성하기보다 생성 열 또는 다중값 인덱스를 활용

## 5. 공간 자료형

MySQL은 위치와 도형 정보를 저장하는 공간 자료형을 지원한다.

| 데이터 타입 | 설명 |
| --- | --- |
| `GEOMETRY` | 모든 공간 객체의 기본 자료형 |
| `POINT` | 하나의 좌표 |
| `LINESTRING` | 여러 점을 연결한 선 |
| `POLYGON` | 다각형 영역 |
| `MULTIPOINT` | 여러 점 |
| `MULTILINESTRING` | 여러 선 |
| `MULTIPOLYGON` | 여러 다각형 |
| `GEOMETRYCOLLECTION` | 여러 종류의 공간 객체 집합 |

---

## 참고

* [MySQL 자료형 종류 정리 1](https://devdhjo.github.io/mysql/2020/01/30/database-mysql-003.html)
* [MySQL 자료형 종류 정리 2](https://inpa.tistory.com/entry/MYSQL-%F0%9F%93%9A-%EC%9E%90%EB%A3%8C%ED%98%95-%ED%83%80%EC%9E%85-%EC%A2%85%EB%A5%98-%EC%A0%95%EB%A6%AC)
* [MySQL 8.4 공식 문서: Data Types](https://dev.mysql.com/doc/refman/8.4/en/data-types.html)
* [MySQL 8.4 공식 문서: 저장 공간](https://dev.mysql.com/doc/refman/8.4/en/storage-requirements.html)
* [MySQL 8.4 공식 문서: 숫자형 문법](https://dev.mysql.com/doc/refman/8.4/en/numeric-type-syntax.html)
* [MySQL 8.4 공식 문서: 날짜 및 시간형](https://dev.mysql.com/doc/refman/8.4/en/date-and-time-types.html)
* [MySQL 8.4 공식 문서: 문자형](https://dev.mysql.com/doc/refman/8.4/en/string-types.html)
* [MySQL 8.4 공식 문서: JSON](https://dev.mysql.com/doc/refman/8.4/en/json.html)

<div class="obsidian-links" style="display: none;">

[\[MySQL\] 간단한 SQL Query문](2024-10-23-MySQL-SQL.md)
[\[MySQL\] 특정 개수의 값 출력](2024-11-28-SQL-Top-Limit.md)

</div>
