---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[MySQL] 간단한 SQL Query문"
excerpt: "모의해킹 취업반 스터디 7기 2주차"

date: 2024-10-23
last_modified_at: 2025-03-17

categories: [DATABASE]
tags: [WEB, DATABASE]
---

# SQL(Structed Query Language)
SQL: 데이터베이스에서 질의, 수정, 삭제 등의 작업을 하는 데이터베이스 관리용 언어이다.  
~~WAS가 DB한테 Query를 통해 명령을 알아서 하도록 만든다.~~

## 언어적 특성
1. 대소문자를 가리지 않는다
1. SQL 쿼리문은 반드시 세미콜론(;)으로 끝나야 한다
1. 고유값을 가지는 문자열의 경우 홑따옴표(')로 감싸준다
4. 주석은 한 줄 주석의 경우 --로 나타내고 여러 줄 주석은 /* */로 감싸서 표현한다.

## SQL 문법 구분
<table>
    <thead>
        <tr>
            <td>종류</td>
            <td>명령어</td>
            <td>설명</td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>데이터 정의어</td>
            <td>* CREATE<br>
            * ALTER<br>
            * DROP<br>
            * TRUNCATE</td>
            <td>스키마, 테이블, 도메인, 뷰, 인덱스 생성/변경/삭제할 때 사용</td>
        </tr>
        <tr>
            <td>데이터 제어어</td>
            <td>* COMMIT<br>
            * ROLLBACK<br>
            * GRANT<br>
            * REVOKE</td>
            <td>데이터에 대한 접근 권한 부여 등 관리 목적으로 사용</td>
        </tr>
        <tr>
            <td>데이터 조작어</td>
            <td>* SELECT<br>
            * INSERT<br>
            * UPDATE<br>
            * DELETE</td>
            <td>데이터베이스에 저장된 데이터를 실질적으로 처리하는 데 사용<br>
            (데이터 조회/추가/수정/삭제 등)</td>
        </tr>
    </tbody>
</table>

데이터베이스를 조회하고 관리하는 데이터 조작어가 가장 많이 쓰이며, 공격자의 주요 공격 포인트가 된다.

## 데이터 조작어 사용법
### SELECT: 데이터베이스의 데이터를 조회하거나 검색하기 위한 명령어
`SELECT [column] FROM [table] WHERE [condition];`
e.g. `SELECT * FROM 고객 WHERE 고객명 = '임꺽정';`

### INSERT INTO: 데이터베이스에 데이터를 추가하기 위한 명령어
`INSERT INTO [table] VALUES [(data1, data2, ...)];`
e.g. `INSERT INTO 고객 VALUES (6, '배트맨', '조커', '고담', '고담', 'DC', '미국');`

### UPDATE: 데이터베이스의 데이터 수정을 위한 명령어
`UPDATE [table] SET [field1 = data1, field2 = data2...];`
e.g. `UPDATE 고객  SET 고객명 = '조커', 관리인 = '배트맨' WHERE 고객명 = '배트맨';`

### DELETE: 데이터베이스의 데이터 삭제를 위한 명령어
`DELETE FROM [table] WHERE [filed = data];`
e.g. `DELETE FROM * WHERE 고객명 = '배트맨';`

# 참고
* [SQL이란?](https://ko.wikipedia.org/wiki/SQL)
* [What is an index in SQL?](https://stackoverflow.com/questions/2955459/what-is-an-index-in-sql)
* [SK 쉴더스 인사이트 리포트](https://www.skshieldus.com/kor/media/newsletter/insight.do) 2022년 4월호 - 웹 취약점과 해킹 매커니즘 #2 SQL Injection 개요