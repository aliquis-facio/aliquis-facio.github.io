---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[WEB HACKING] Error-Based SQL Injection (MySQL)"
excerpt: "모의해킹 취업반 스터디 7기 7주차"

date: 2024-11-28
last_modified_at: 

categories: [SECURITY]
tags: [TIL, WEB, DATABASE, SECURITY]
---

# Error-Based SQL Injection
## Error-Based SQL Injection란?
: SQL 에러메시지를 활용해 DB에 관한 정보를 획득하는 공격 기법이다.

보통 개발자는 개발을 할 때 어떤 코드에 오류가 있는 지 확인하기 위해 일부러 에러메시지가 출력되게 설정한다. 이것이 서버를 운영할 때 그대로 이어지는 경우가 많은데, 공격자는 이 에러 메시지를 악용한다.

DB의 종류에 따라 문법과 SQL구문, 함수 등이 다른 부분이 존재하기 때문에 공격 방식이 조금씩 다르다.

## 에러 반환 종류
1. 단순 에러 메시지: 일반적으로 출력되는 에러 메시지로 단순히 문법이 잘못되었다는 에러 정보
2. 정보 획득이 가능한 에러 메시지: 서브쿼리의 실행 결과를 보여주는 함수로 공격에 활용 가능  
-> 문법 에러 X, 로직 에러이면서 DBMS 에러
* 서브쿼리는 기존의 쿼리문 안에 쿼리문이 삽입되는 것으로, 정보 획득이 가능한 함수를 사용할 때 서브쿼리에 에러 정보를 추출하고 싶은 쿼리를 삽입하면 된다.

## 공격 진행 과정
1. SQL Injection 취약점 존재 여부 확인
2. Error Based SQL Injection 진행
3. 원하는 데이터 탈취

### 1. SQL Injection 취약점 존재 여부 확인
', " 등 특수문자 또는 AND, OR, NOT 등 SQL 연산자 등을 시도한다. 이에 따른 결과로 에러가 보이느냐? 성공

### 2. Error Based SQL Injection 진행
1. 테이블 정보 추출
    1. 테이블 개수 확인
    2. 테이블 1개씩 추출
    3. 모든 테이블 추출
    4. 테이블 이름 확인
2. 컬럼 정보 추출
    1. 컬럼 개수 확인
    2. 컬럼 1개씩 추출
    3. 모든 컬럼 추출
    4. 컬럼 이름 확인

### 3. 원하는 데이터 탈취
3. 데이터 정보 추출
    1. 데이터 정보 추출
    2. 데이터 1개씩 추출
    3. 모든 데이터 추출
    4. 데이터 이름 확인

## MySQL에서 공격
### XPath
extractvalue() 함수 활용하는 기법으로 MySQL 5.1 이상의 버전에서만 유효하다.

* 문법: `extractvalue(xml_frag, xpath_expr)`
extractvalue()는 XML(xml_frag 인수)과 XPath 표현식(xpath_expr 인수), 두 개의 인수가 필요하고, 두 개의 인수를 통해 XML에서 XPath 표현식에 일치하는 데이터를 추출하여 반환한다.

이 함수는 xpath_expr이라는 두 번째 인수에 유효하지 않은 XPath 표현식이 사용된다면 다음과 같은 오류가 발생한다.
`ERROR 1105 (HY000): XPATH syntax error: 'xpath_expr 인수의 값'`
한 가지 재미있는 점은 xpath_expr 인수로 임의의 SQL 쿼리를 지정했을 때 이 쿼리의 실행 결과가 오류 메시지에 포함된다는 것이다. 우리는 이 점을 이용해 오류 기반의 SQL Injection 공격을 수행할 수 있다.
두 번째 인수가 항상 유효하지 않은 XPath 표현식이 되도록 하기 위해 concat() 함수를 이용해 콜론(:)을 앞에 추가한다.
-> 왜 콜론이냐?
0x3a는 콜론의 16진수 표기법입니다.
첫 번째 인수는 임의의 값을 지정하기 위해 rand() 함수를 사용합니다.  
그리고 마지막으로 후속 쿼리를 무효화하기 위해 가장 끝에 주석 문자(--)와 공백 문자(스페이스)를 추가합니다.
주석 문자 뒤에 공백 문자(스페이스)를 추가하는 것을 잊지마세요.

최종적으로는 아래와 같은 형태가 되겠군요. 

`AND extractvalue(rand(), concat(0x3a, 실행할-SQL-쿼리))-- `

위의 extractvalue() 함수의 오류 메시지는 단일 행(한 줄)으로 반환되므로 LIMIT을 사용하여 한 번에 하나의 행만 출력될 수 있도록 하였습니다.
계속해서 다음 행의 데이터를 추출하기 위해서는 아래와 같이 반복하여 실행하면 됩니다.

```
...LIMIT 0, 1)))--      (SQL 쿼리에서 반환된 레코드셋의 첫번째 행 반환)
...LIMIT 1, 1)))--      (SQL 쿼리에서 반환된 레코드셋의 두번째 행 반환) 
...LIMIT 2, 1)))--      (SQL 쿼리에서 반환된 레코드셋의 세번째 행 반환)
...LIMIT 3, 1)))--      (SQL 쿼리에서 반환된 레코드셋의 네번째 행 반환)
...생략...
```

위의 방식과 유사한 기법으로 updatexml() 함수를 이용할 수도 있습니다.
기본형은 아래와 같으며 추출하고자 하는 데이터에 따라 "실행할-SQL-쿼리" 부분만 위의 방식대로 변경해주면 됩니다.

`AND updatexml(null, 실행할-SQL-쿼리, null)-- `

# 참고
* [Error-Based SQL Injection: Examples and 5 Tips for Prevention](https://brightsec.com/blog/error-based-sql-injection/)
* [SQL Injection Payloads: How SQLi exploits work](https://brightsec.com/blog/sql-injection-payloads/)
* [웹 취약점과 해킹 매커니즘 #4 Error Based SQL Injection](https://www.skshieldus.com/download/files/download.do?o_fname=EQST%20insight_Special%20Report_202207.pdf&r_fname=20220718162542886.pdf)
* **[오류 기반 SQL Injection이란?](https://www.bugbountyclub.com/pentestgym/view/53)**
* [https://blog.naver.com/crehacktive3/222187681939](https://blog.naver.com/crehacktive3/222187681939)