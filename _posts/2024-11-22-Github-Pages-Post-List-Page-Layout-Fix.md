---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[GITHUB PAGES] Github Blog 포스트 리스트 레이아웃 깨짐"
excerpt: ""

date: 2024-11-22
last_modified_at: 2024-12-19

categories: [BLOG]
tags: [BLOG]
---

# sitemap 수정하고 나서 post-list에서 이상하게 보임
<img src = "https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-22-3.png?raw=true">  
-> 근데 또 모든 포스트가 저리 보이는 건 아님  

1. 머릿말(Front-Matter)이 제대로 작성돼 있지 않는 포스트들인가?
<img src = "https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-22-5.png?raw=true">  
-> 머릿말 부분을 채워넣어봄.  
-> google search 등록하기, github blog 수정한 것들/할 것들만 이상하게 나옴  

2. 머릿말의 excerpt 안 쓴 것들인가?  
아예 머릿말(Front-Matter)을 작성 안 해놓은 포스트들은 파일 제목이랑 내용 첫 줄이 합져져서 표시됨  
<img src = "https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-22-4.png?raw=true">  
-> 머릿말 채워넣고 excerpt를 ""로 넣어봄  
-> 해결 완료  