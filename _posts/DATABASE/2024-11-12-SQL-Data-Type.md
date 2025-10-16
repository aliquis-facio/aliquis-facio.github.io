---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[MySQL] DATA TYPE"
excerpt: "모의해킹 취업반 스터디 7기 4주차"

date: 2024-11-13
last_modified_at: 

categories: [DATABASE]
tags: [DATABASE]
---

# 목차

1. [숫자형](#1-숫자형)
    1. [정수형](#11-정수형)
    1. [실수형(고정 소수점)](#12-실수형고정-소수점)
    1. [BIT형](#14-bit형)
1. [문자형](#2-문자형)
1. [날짜형](#3-날짜형)
1. [참고](#참고)

# 1. 숫자형
## 1.1. 정수형

<table>
    <thead>
        <tr>
            <th>타입</th>
            <th>BYTE</th>
            <th>부호 O(SIGNED) 범위</th>
            <th>부호 X(UNSIGNED) 범위</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>TINYINT</td>
            <td>1</td>
            <td>-2^7 ~ 2^7 - 1<br>
            -128 ~ 127</td>
            <td>0 ~ 2^8 - 1<br>
            0 ~ 255</td>
        </tr>
        <tr>
            <td>SMALLINT</td>
            <td>2</td>
            <td>-2^15 ~ 2^15 - 1<br>
            -32,768 ~ 32,767</td>
            <td>0 ~ 2^16 - 1<br>
            0 ~ 65,535</td>
        </tr>
        <tr>
            <td>MEDIUMINT</td>
            <td>3</td>
            <td>-2^23 ~ 2^23 - 1<br>
            -8,388,608 ~ 8,388,607</td>
            <td>0 ~ 2^24 - 1<br>
            0 ~ 16,777,215</td>
        </tr>
        <tr>
            <td>INT/INTEGER</td>
            <td>4</td>
            <td>-2^31 ~ 2^31 - 1<br>
            -2,147,483,648 ~ 2,147,483,647</td>
            <td>0 ~ 2^32 - 1<br>
            0 ~ 4,294,967,295</td>
        </tr>
        <tr>
            <td>BIGINT</td>
            <td>8</td>
            <td>-2^63 ~ 2^63 - 1<br>
            -9,223,372,036,854,775,808 ~ 9,223,372,036,854,775,807</td>
            <td>0 ~ 2^64 - 1<br>
            0 ~ 18,446,744,073,709,551,615</td>
        </tr>
    </tbody>
</table>

## 1.2. 실수형(고정 소수점)

<table>
    <thead>
        <tr>
            <th>데이터 타입</th>
            <th>BYTE</th>
            <th>범위</th>
            <th>설명</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>DECIMAL(M, D)<br>
            NUMERIC(M, D)</td>
            <td>5 ~ 17</td>
            <td>-1038+1 ~ +1038-1</td>
            <td>전체 자릿수(M)와 소수점 이하 자릿수(D)를 가진 숫자형<br>
            e.g. DECIMAL(5, 2): -999.99 ~ 999.99<br>
            DECIMAL(M) = DECIMAL(M, 0)<br>
            DEFAULT M값: 10<br>
            최대 65자리까지 표현할 수 있다.
            </td>
        </tr>
    </tbody>
</table>

## 1.3. 실수형(부동 소수점)

<table>
    <thead>
        <tr>
            <th>데이터 타입</th>
            <th>BYTE</th>
            <th>숫자 범위</th>
            <th>설명</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>FLOAT(M, D)</td>
            <td>4</td>
            <td>-3.40E+38 ~ -1.17E-38</td>
            <td>실수, 소수점 아래 7자리까지 표현</td>
        </tr>
        <tr>
            <td>DOUBLE(M, D)<br>
            REAL(M, D)</td>
            <td>8</td>
            <td>1.22E-308 ~ 1.79E+308</td>
            <td>실수, 소수점 아래 15자리까지 표현</td>
        </tr>
    </tbody>
</table>
FLOAT, DOUBLE 등의 부동 소수점 유형은 MySQL 8.0.17 이후 버전부터 사용되지 않는다.

# 1.4. BIT형

<table>
    <thead>
        <tr>
            <th>타입</th>
            <th>BYTE</th>
            <th>설명</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>BIT(M)</td>
            <td>N / 8</td>
            <td>1 ~ 64bit 표현<br>
            e.g. b'0000'</td>
        </tr>
    </tbody>
</table>

# 2. 문자형

<table>
    <thead>
        <tr>
            <th>데이터 타입</th>
            <th>BYTE</th>
            <th>설명</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>CHAR</td>
            <td></td>
            <td>고정 길이 문자열</td>
        </tr>
        <tr>
            <td>VARCHAR()</td>
            <td></td>
            <td>가변 길이 문자열, 후행 공백 제거X
            </td>
        </tr>
        <tr>
            <td>TINYBLOB<br>
            TINYTEXT</td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td>BLOB<br>
            TEXT</td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td>MEDIUMBLOB<br>
            MEDIUMTEXT</td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td>LONGBLOB<br>
            LONGTEXT</td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td>ENUM</td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td>SET</td>
            <td></td>
            <td></td>
        </tr>
    </tbody>
</table>

# 3. 날짜형

<table>
    <thead>
        <tr>
            <th>데이터 타입</th>
            <th>BYTE</th>
            <th>표현 범위</th>
            <th>설명</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>DATE</td>
            <td>3</td>
            <td>1000-01-01 ~ 9999-12-31</td>
            <td>날짜 표현</td>
        </tr>
        <tr>
            <td>DATETIME</td>
            <td>8</td>
            <td>1000-01-01 00:00:00 ~ 9999-12-31 23:59:59</td>
            <td>날짜와 시간 표현</td>
        </tr>
        <tr>
            <td>TIMESTAMP</td>
            <td>4</td>
            <td>1970-01-01 00:00:00 ~ 2037-01-19 03:14:07</td>
            <td>INSERT, UPDATE 연산에 유리</td>
        </tr>
        <tr>
            <td>TIME</td>
            <td>3</td>
            <td>-838:59:59 ~ 838:59:59</td>
            <td>시간 표현</td>
        </tr>
        <tr>
            <td>YEAR</td>
            <td>1</td>
            <td>1901 ~ 2155, 70 ~ 69 (1970~2069)</td>
            <td>연도 표현</td>
        </tr>
    </tbody>
</table>
YEAR(4) 와 같이 명시적인 길이를 표기한 데이터 유형은 MySQL 8.0.19 이후 버전부터 사용되지 않습니다.  
YEAR(2) 와 같이 두 자리로 표기하는 데이터 유형은 MySQL 5.7 이후 버전부터 지원하지 않습니다.

# 참고

* [MySQL 자료형 종류 정리 1](https://devdhjo.github.io/mysql/2020/01/30/database-mysql-003.html)
* [MySQL 자료형 종류 정리 2](https://inpa.tistory.com/entry/MYSQL-%F0%9F%93%9A-%EC%9E%90%EB%A3%8C%ED%98%95-%ED%83%80%EC%9E%85-%EC%A2%85%EB%A5%98-%EC%A0%95%EB%A6%AC)