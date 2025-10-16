---
layout: post
comments: true
sitemap:
    changefreq: daily
    priority: 0.5

title: "[CTF] CTF 문제 풀이: SQL Injection"
excerpt: "모의해킹 취업반 스터디 7기 8주차"

date: 2024-12-09
last_modified_at: 

tags: [TIL, WEB]
---

# login.php
# mypage.php
# notice_list.php
## request
1. option_val: username, title, content
2. board_result: var
select col from table
where '1' = '1' and 'content' like '%board_result%'

a%' and '1%' = '1
option_val=title
board_result=
board_search=%F0%9F%94%8D
date_from=
date_to=