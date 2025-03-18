---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[GITHUB PAGES] Date Format 변경하기"
excerpt: ""

date: 2024-10-26
last_modified_at: 2025-02-25

categories: [BLOG]
tags: [BLOG]
---

# 1. date 문구 추적
`scripts.html`, `compress.html`, `post.html` 3군데에서 date랑 관련된 부분이 나옴

~~`git push --set-upstream origin header`~~

# 2. scripts.html 추적
`home.html`, `page.html`, `post-list.html`, `post.html`, `project.html` 5군데에서 나옴

# 3. post.html
블로그 글이랑 가장 직접적인 연관이 많은 post.html 먼저 수정해보기로 함.  
date 관련된 code 원본: `<h4>Date: {{ page.date | date_to_string }}</h4>`
1. `<h4>Date: {{ page.date | %Y.%m.%d }}</h4>`
-> Date: 2024-10-17 00:00:00 +0000
1. `<h4>Date: {{ page.date | "%Y.%m.%d" }}</h4>`
-> Date: 2024-10-17 00:00:00 +0000
1. `<h4>Date: {{ page.date | %Y %m %d %a }}</h4>`
-> Date: 2024-10-17 00:00:00 +0000
1. `<h4>Date: {{ page.date | date: "%Y %m %d %a" }}</h4>`
-> Date: 2024 10 17 Thu

# 4. 'updated date' 추가
각각의 파일에 코드 추가  
1. Gemfile  
```
group :jekyll_plugins do
  gem "jekyll-last-modified-at"
end
```

1. _config.yml  
```
plugins:
  - jekyll-last-modified-at
# Optional. The default date format, used if none is specified in the tag.
last-modified-at:
​    date-format: '%d-%b-%y' #(like "04-Jan-14").
```

1. post.html  
`<h4>Updated: {{ page.last_modified_at | date: "%Y.%m.%d %a" }}</h4>`
-> 
```
Created: 2024.10.17 Thu
Updated:
```

`last_modified_at` 값이 존재할 때만 블로그 글에 created_date와 modified_date가 함께 보이길 바란다.

1. post.html  
<img src = "https://github.com/aliquis-facio/aliquis-facio.github.io/blob/master/_image/2024-10-27-6.png?raw=true">
->
<img src = "https://github.com/aliquis-facio/aliquis-facio.github.io/blob/master/_image/2024-10-27-7.png?raw=true">

# 5. CSS 수정
## 목표: created date랑 updated date랑 가로로 배치하고 싶다
`post.html` 바로 밑에 `p class="reading-time"` 있는데 요거 css 쫓아가보겠습니다
-> `elements.scss`, `print.scss`

h4 태그로 감싸져있기 때문에  
-1. h4를 다른 태그로 바꾼다  
-2. 그 위에 div로 묶어서 inline으로 변경한다  
2번째 방법부터 시도해보겠습니다  

1. post.html - 코드 수정
<img src = "https://github.com/aliquis-facio/aliquis-facio.github.io/blob/master/_image/2024-10-27-1.png?raw=true">
->
<img src = "https://github.com/aliquis-facio/aliquis-facio.github.io/blob/master/_image/2024-10-27-2.png?raw=true">

1. elements.scss - 코드 추가
<img src = "https://github.com/aliquis-facio/aliquis-facio.github.io/blob/master/_image/2024-10-27-3.png?raw=true">
-> `Created: 2024.10.17 Thu           Updated: 2024.10.24 Thu`  
가로로 배치 성공했는데 위치가 살짝 맘에 안 들어서
정렬을 바꿔봅시다

## 목표: updated date 생성 안 했을 때 grid 없애기
<img src = "https://github.com/aliquis-facio/aliquis-facio.github.io/blob/master/_image/2024-10-27-4.png?raw=true">
<img src = "https://github.com/aliquis-facio/aliquis-facio.github.io/blob/master/_image/2024-10-27-5.png?raw=true">

# 6. 궁금한 거
post 작성할 때 last_modified_at 부분을 작성하고 날짜만 기입하지 않는다면?  
-> updated date 안 생김

# 7. home 버튼을 눌렀는데 home/index.html이 아니라 2024-10-23.md가 왜 불러와지는거죠??
github.io 홈에 들어가면 정상적으로 홈으로 가는 게 아니라 가장 최근에 포스팅한 포스트로 연결이 되는 것이 문제였다.
_layout 파일에 있던 `post.html`에서 코드를 변경하고 있었기 때문에 그쪽을 건드려서 뭔가 발생하는 건가 생각했다.

아직 포스팅을 완벽하게 작성해놓은 게 아니여서 `2024-10-23-.md`으로 저장해놓고 있었다.
포스트 이름을 완벽하게 채웠더니 블로그 리스트 페이지가 원상 복귀했다.

그러면 이름을 완벽하게 안 적어놨을 때마다 발생하려나??
나중에 한 번 확인해봐야겠다.

이렇게 수정하고 push 했는데 build 오류남
html 코드 내부에 있는 riquid 코드에서 오류가 발생한 듯 하다.
pre 태그를 사용하지 않고 캡처해서 이미지로 업로드하니 정상적으로 push가 됐다.

# 참고
* [Easy date formatting with Liquid](https://learn.customer.io/personalization/easy-date-formatting-with-liquid)
* [Liquid Date Format](https://shopify.github.io/liquid/filters/date/)
* [jekyll 깃허브 블로그에 파일의 마지막 수정 날짜 자동으로 넣는 방법](https://moeun2.github.io/blog/jekyll-last-modified-at)
* [Adding last modified date to Jekyll](https://tomkadwill.com/adding-last-modified-date-to-jekyll)
* [[HTML/CSS] div 가로로 나란히 정렬하는 4가지 방법](https://hianna.tistory.com/865)
* [2023년이지만 여전히 CSS의 중첩 스타일에 대해 이야기해야 합니다](https://hackernoon.com/lang/ko/2023%EB%85%84%EC%9D%B4%EC%A7%80%EB%A7%8C-%EC%97%AC%EC%A0%84%ED%9E%88-CSS%EC%9D%98-%EC%A4%91%EC%B2%A9-%EC%8A%A4%ED%83%80%EC%9D%BC%EC%97%90-%EB%8C%80%ED%95%B4-%EC%9D%B4%EC%95%BC%EA%B8%B0%ED%95%B4%EC%95%BC-%ED%95%A9%EB%8B%88%EB%8B%A4.)
* [[CSS] length > 0 해당 요소가 있을 때만 동작하는 코드 만들기](https://zinna.tistory.com/4)
* [[SCSS] 조건문 if, 다중조건문 @if, @else if, @else](https://velog.io/@mjieun/SCSS-%EC%A1%B0%EA%B1%B4%EB%AC%B8)
* [[SassㆍSCSS] SASS 문법 4편 - 조건문(@if), 반복문(@for)](https://www.biew.co.kr/entry/Sass%E3%86%8DSCSS-SASS-%EB%AC%B8%EB%B2%95-3%ED%8E%B8-%EC%A1%B0%EA%B1%B4%EB%AC%B8if-%EB%B0%98%EB%B3%B5%EB%AC%B8for)
* [[SCSS] SCSS 문법5 - @mixin & @include](https://velog.io/@bami/SCSS-SCSS-%EB%AC%B8%EB%B2%955-mixin-inclue)
* [scss if](https://blog.naver.com/youngchanmm/221901012095)
* [[SCSS] 조건문 (@if / @else if / @else)](https://mine-it-record.tistory.com/607)
* [[CSS]:nth-of-type 가상 클래스 선택자 사용 방법](https://codingeverybody.kr/css-nth-of-type-%EA%B0%80%EC%83%81-%ED%81%B4%EB%9E%98%EC%8A%A4-%EC%82%AC%EC%9A%A9-%EB%B0%A9%EB%B2%95/)
* [CSS에서 하위 요소 조건에 따른 요소 선택 :has() 선택자](https://minzcode.tistory.com/entry/CSS%EC%97%90%EC%84%9C-%ED%95%98%EC%9C%84-%EC%9A%94%EC%86%8C-%EC%A1%B0%EA%B1%B4%EC%97%90-%EB%94%B0%EB%A5%B8-%EC%9A%94%EC%86%8C-%EC%84%A0%ED%83%9D-has-%EC%84%A0%ED%83%9D%EC%9E%90)
* [Using CSS to detect if child exists](https://stackoverflow.com/questions/18482718/using-css-to-detect-if-child-exists)
* [[Blog] github 블로그 포스팅 게시 안되는 오류 해결](https://sehooni.github.io/blog/github_blog_not_shown/)
* [Github 블로그 page build error 해결 후기](https://roadtos7.github.io/android/2021/06/10/Jekyll-FixBuildError.html)