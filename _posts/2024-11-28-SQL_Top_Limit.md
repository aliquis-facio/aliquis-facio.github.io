---
layout: post
comments: true
sitemap:
    changefreq: daily
    priority: 0.5

title: "[MySQL] 특정 개수의 값 출력 "
excerpt: "모의해킹 취업반 스터디 7기 7주차"

date: 2024-11-28
last_modified_at: 

tags: [TIL, WEB]
---

# TOP
`SELECT TOP [N(개수)/N%(비율)] ~ FROM ~`  
e.g. `SELECT TOP 3 * FROM TABLE ORDER BY SCORE
TOP N% WITH TIES`

# LIMIT
`SELECT ~ FROM ~ LIMIT N(시작할 위치), M(개수)`
e.g. `SELECT * FROM TABLE ORDER BY SCORE LIMIT 3`

# 참고
* [SQL 특정 개수의 값 출력](https://lcs1245.tistory.com/entry/SQL-%ED%8A%B9%EC%A0%95-%EA%B0%9C%EC%88%98%EC%9D%98-%EA%B0%92-%EC%B6%9C%EB%A0%A5-SELECT-TOP-N-TOP-LIMIT-ROWNUM?category=348747)