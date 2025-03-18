---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[WEB HACKING] SQL Injection 정리"
excerpt: "모의해킹 취업반 스터디 7기 5주차"

date: 2024-11-13
last_modified_at: 2024-12-21

categories: [SECURITY]
tags: [TIL, WEB, DATABASE, SECURITY]
---

# SQL(Structured Query Language) Injection
## 개요
설계된 쿼리문에 의도하지 않은 미상의 쿼리를 임의로 삽입하려 악의적인 SQL 구문을 실행하는 공격이다.
공격자는 데이터베이스에 직접적으로 접근해 중요 정보를 조회, 탈취할 수 있다.

## 기본 개념
[DATABASE와 SQL문 설명](./Database_and_SQL.md)

## 작동 방식
사용자 ID와 PW를 입력받으면 SQL 쿼리는 아래와 같이 작동한다.

``` js
"SELECT * FROM member WHERE UserId = '" +
InputId + "' AND UserPw = '" +
InputPw + "'";
```

만약 사용자가 ID를 admin, PW를 1234로 입력한다고 한다면
SQL 쿼리는 다음과 같이 실행된다.
``` 
"SELECT * FROM member WHERE UserId = '
admin' AND UserPw = '1234'";
```

ID: admin
PW: blabla'or1=1

``` 
"SELECT * FROM member WHERE UserId = '
admin' AND UserPw = 'blabla'or1=1'";
```
비밀번호가 blabla는 아니기 때문에 False
test' and '1'='1
test' or '1' = '1
test' # -> 뒤 주석처리

or와 and 연산자
연산자끼리의 우선순위: and 먼저, or 뒤

-> 로그인 페이지에서 실습해보기

## 공격 유형에 따른 분류
### Union SQL Injection
[Union SQL Injection](./Union_SQL_Injection.md)

### Error Based SQL Injection
[Error Based SQL Injection](./Error_Based_SQL_Injection.md)

### Blind SQL Injection
[Blind SQL Injection](./Blind_SQL_Injection.md)

# sqli
## SQL Injection Exploit

## 
웹페이지
-> SQL 질의문을 사용하는 곳
-> 서버 측 SQL 질의문 추론 후 공격 시도

## 모의해킹 할 때 주의할 점
1. insert, delete, update 지양
    이 구문들에서는 or, 주석 지양
2. 주석 남용 금지
3. 데이터 변조 금지

## 
`65/**/and/**/1=1`

order by title desc '___'
`sotingAD=, (case+when+ascii(substr((select+user+from+dual),1,1))=0+then+1+else+(1/0)+end)`
1/0 -> oracle error

Time Based Blind SQLi
waitfor delay
order by ___
`sotingAD=ASC;if+substring((select%20user_name()),1,1)=%27a%27+waitfor+delay+%270:0:1%27&startDt=&endDt=&keyword=`

# 인증 우회
* brute force: 무작위 대입 공격
* 사전 대입 공격
-> 인증 횟수 제한

# 인증 건너뛰기
* 이전 페이지에서 건너뛰지 않았는지 확인하기

## 대응 방안
prepared statement
white list filtering

# 참고
* [SQL Injection](https://developer.mozilla.org/ko/docs/Glossary/SQL_Injection)
