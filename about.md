---
layout: page
title: About
sidebar_link: true
---

# Created
1. [Github Pages 만들기 1](/Github_Pages_Making_1)
2. [Github Pages 만들기 2](/Github_Pages_Making_2)
3. [Github Pages 만들기 3](/Github_Pages_Making_3)
4. [Google Analytics 등록하기](/Github_Pages_Google_Analytics)
5. [Post 작성하기 위한 Markdown 문법 공부 일지](/Markdown_Syntax)
6. [Post 작성하기 위한 Image 등록 테스트](/Github_Pages_Image_Test)
  
# Modified
1. ~~2022-10-23-응용통계학 정리 클릭하면 2022-10-31-응용통계학 기댓값, 분산, 표준편차 포스트로 이동함.~~  
    -> 파일 제목이 같으면 가장 최신 파일 쪽으로 이동하는 듯.
2. [포스트 만든 날짜, 수정 날짜 구분해서 올리고 싶음](/Github_Pages_Header_Date_Format_Changing)
3. [github.io 블로그 구글 검색에 개시하기](/github_google_search_등록)
4. [sitemap 수정하고 나서 post-list에서 이상하게 보임](/github_blog_post_list_layout_fix)
5. category
6. pagination
7. ~~Google Search Console에 적용이 끝나면 모든 포스트에다가 sitemap 적용시켜줘야 함~~
 
# Update List
## Functional
- [x] 카테고리 기능
    - [ ] 카테고리 메뉴바 디자인
    - [ ] 2단계 카테고리
    - [X] 1단계 카테고리
- [ ] 조회수 표시
    - [ ] hits
    - [ ] 구글 애널리틱스
- [ ] pagination 적용
- [ ] ~~last_modified_at을 xml과 동일하게 last_mod로 바꾸기~~
- [ ] post 정렬 순서 설정: CREATED_TIME -> POST FILE NAME
- [ ] tag와 category의 기능 구분

## Design
- [ ] POST LIST: LOAD 애니메이션 수정
- [ ] 글씨 보여지는 곳, 가운데 화면이차지하는 부분이 너무 적음. 양 옆 여백이 너무 넓음.
- [ ] 포스트 만든 날짜, 수정 날짜가 창의 width가 줄어들면 updated date가 두 줄로 변하는 데 차라리 글씨 크기가 줄어들거나 created랑 updated가 가로로 나열되는 게 아니라 세로로 나열되게끔 바꾸고 싶음.
```
width < x:
    created, updated -> 세로로 나열
    or
    created, updated -> 폰트 사이즈 줄이기
```
- [ ] h1 ... h6 태그 글자 최소 크기 설정하기
- [ ] pre 태그 내부는 글씨체를 \\(역슬래시)가 한국통화로 안 나오게 바꿔야겠다.

1. Jekyll download
https://jekyllrb.com/docs/installation/
밑에 있는 guides를 따라서 -> windows

1.1. installing ruby and Jekyll
installation via rubyinstaller
https://rubyinstaller.org/downloads/
-> Ruby+Devkit 3.4.4-2 (x64) 다운로드

* ruby 3.4.4-2
* Jekyll 4.4.1
* bundler 2.6.9

* [https://github.com/fongandrew/hydeout/tree/master]
* [https://wikidocs.net/278188]