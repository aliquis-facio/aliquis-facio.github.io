---
layout: post
comments: true
sitemap:
    changefreq: daily
    priority: 0.5

title: "[WEB HACKING] SQL Injection Tip"
excerpt: "모의해킹 취업반 스터디 7기 8주차"

date: 2024-12-04
last_modified_at: 

tags: [TIL, WEB, SECURITY, DATABASE]
---

공격기법을 공부할 때는 시나리오를 생각해봐라

---

한글 데이터
인코딩 종류: euc-kr, utf-8 -> 바이트/글자가 다름
-> 이진코드로 바꿔서 확인하는 게 빠름

---

sql injection 필터링 우회기법 알아보기

--

sql injection: data 추출
union
: sql 질의 결과가 화면에 출력되는 경우

error based
: sql error가 발생하는 경우

blind

---

sql injection point 찾기
db에게 sql 질의문을 사용하는 곳
파라미터

---

where column like '___'
order by table
case when _condition_ then _true_ else _false_ end

---

case when (1=1) then 1 else (select 1 union select 2) end
case when (1=2) then 1 else (select 1 union select 2) end
(select 1 union select 2 where 1 = 1)
(select 1 union select 2 where 1 = 2)
test' and (select 1 union select 2 where (1 = 1)) and '1' = '1'
test' and (select 1 union select 2 where (1 = 2)) and '1' = '1'

일부러 에러를 유발해서 sql injection point를 찾는 경우가 있다 -> ctf 문제로 나올 듯

---

1. 쿠키, http 요청 헤더
2. column
3. order by 절 sql injection

---

sql injection 대응 방법
1. prepared statement
2. white list filtering
블랙: 특정 단어를 못 쓰게 하는 것
화이트: 특정 단어만 쓸 수 있게 하는 것

---

prepared statement 적용된 코드 sql injection
1. 잘 못 쓴 경우
2. prepared statement 못 쓰는 경우
order by
table 이름, column 이름
e.g. where _column_ ~

-> 왜 적용할 수 없는 건가?