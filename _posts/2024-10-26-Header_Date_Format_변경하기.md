---
layout: post
title: "Header Date Format 변경하기"
date: 2024-10-26
last_modified_at:
excerpt: ""
categories: [test]
tags: [Post]
comments: true
---

# 1. date 문구 추적
scripts.html
compress.html
post.html
3군데에서 date랑 관련된 부분이 나옴

`git push --set-upstream origin header`

# 2. scripts.html 추적
home.html
page.html
post-list.html
post.html
project.html
5군데에서 나옴

# 3. post.html
블로그 글이랑 가장 직접적인 연관이 많은 post.html 먼저 수정해보기로 함.
date 관련된 code
원본: `<h4>Date: {{ page.date | date_to_string }}</h4>`

-> `<h4>Date: {{ page.date | %Y.%m.%d }}</h4>`
결과: Date: 2024-10-17 00:00:00 +0000

-> `<h4>Date: {{ page.date | "%Y.%m.%d" }}</h4>`
결과: Date: 2024-10-17 00:00:00 +0000

-> `<h4>Date: {{ page.date | %Y %m %d %a }}</h4>`
결과: Date: 2024-10-17 00:00:00 +0000

-> `<h4>Date: {{ page.date | date: "%Y %m %d %a" }}</h4>`
결과: Date: 2024 10 17 Thu

* 참고
https://learn.customer.io/personalization/easy-date-formatting-with-liquid
https://shopify.github.io/liquid/filters/date/

# 4. 지금 있는 건 created date니까 updated date를 추가하기로 함
참고: https://moeun2.github.io/blog/jekyll-last-modified-at

-1. 각각의 파일에 코드 추가
Gemfile
```
group :jekyll_plugins do
  gem "jekyll-last-modified-at"
end
```

_config.yml
```
plugins:
  - jekyll-last-modified-at

# Optional. The default date format, used if none is specified in the tag.

last-modified-at:
​    date-format: '%d-%b-%y' #(like "04-Jan-14").
```

post.html
`<h4>Updated: {{ page.last_modified_at | date: "%Y.%m.%d %a" }}</h4>`

결과
Created: 2024.10.17 Thu
Updated:

* 참고
https://tomkadwill.com/adding-last-modified-date-to-jekyll
-> 이 분은 손수 수작업으로 변경하시는 듯

나는 last_modified_at 부분이 있다하면 둘이 같이 나오는 거고
없으면 작성 날짜만 있는거고

post.html
수정
`<h4>Updated: {{ page.last_modified_at | date: "%Y.%m.%d %a" }}</h4>`
->
```
{%- if page.last_modified_at -%}
	<h4>Updated: {{ page.last_modified_at | date: "%Y.%m.%d %a" }}</h4>
{%- endif -%}
```

2024-10-23.md
추가
`last_modified_at: 2024-10-24`

결과
Created: 2024.10.17 Thu
Updated: 2024.10.24 Thu

# 5. created date랑 updated date랑 가로로 배치하고 싶다
post.html
바로 밑에 reading time 있는데 요거 css 쫓아가보겠습니다
`p class="reading-time"`
elements.scss
print.scss

* 참고
https://hianna.tistory.com/865

h4 태그로 감싸져있기 때문에
-1. h4를 다른 태그로 바꾼다
-2. 그 위에 div로 묶어서 inline으로 변경한다

2번째 방법부터
post.html
수정
<img src = "https://github.com/aliquis-facio/aliquis-facio.github.io/blob/master/_image/2024-10-27-1.png?raw=true">
->
<img src = "https://github.com/aliquis-facio/aliquis-facio.github.io/blob/master/_image/2024-10-27-2.png?raw=true">
elements.scss
추가
<img src = "https://github.com/aliquis-facio/aliquis-facio.github.io/blob/master/_image/2024-10-27-3.png?raw=true">
결과: Created: 2024.10.17 Thu           Updated: 2024.10.24 Thu
가로로 배치 성공했는데 위치가 살짝 맘에 안 들어서
정렬을 바꿔봅시다

# 6. 궁금한 거
post 작성할 때
last_modified_at 부분을 작성하고 날짜만 기입하지 않는다면? updated date 안 생김
* 참고
https://hackernoon.com/lang/ko/2023%EB%85%84%EC%9D%B4%EC%A7%80%EB%A7%8C-%EC%97%AC%EC%A0%84%ED%9E%88-CSS%EC%9D%98-%EC%A4%91%EC%B2%A9-%EC%8A%A4%ED%83%80%EC%9D%BC%EC%97%90-%EB%8C%80%ED%95%B4-%EC%9D%B4%EC%95%BC%EA%B8%B0%ED%95%B4%EC%95%BC-%ED%95%A9%EB%8B%88%EB%8B%A4.

# 7. updated date 생성 안 했을 때 grid 없애기
<img src = "https://github.com/aliquis-facio/aliquis-facio.github.io/blob/master/_image/2024-10-27-4.png?raw=true">
<img src = "https://github.com/aliquis-facio/aliquis-facio.github.io/blob/master/_image/2024-10-27-5.png?raw=true">

* 참고
https://zinna.tistory.com/4
https://velog.io/@mjieun/SCSS-%EC%A1%B0%EA%B1%B4%EB%AC%B8
https://www.biew.co.kr/entry/Sass%E3%86%8DSCSS-SASS-%EB%AC%B8%EB%B2%95-3%ED%8E%B8-%EC%A1%B0%EA%B1%B4%EB%AC%B8if-%EB%B0%98%EB%B3%B5%EB%AC%B8for
https://velog.io/@bami/SCSS-SCSS-%EB%AC%B8%EB%B2%955-mixin-inclue
https://blog.naver.com/youngchanmm/221901012095
https://mine-it-record.tistory.com/607
https://codingeverybody.kr/css-nth-of-type-%EA%B0%80%EC%83%81-%ED%81%B4%EB%9E%98%EC%8A%A4-%EC%82%AC%EC%9A%A9-%EB%B0%A9%EB%B2%95/
https://minzcode.tistory.com/entry/CSS%EC%97%90%EC%84%9C-%ED%95%98%EC%9C%84-%EC%9A%94%EC%86%8C-%EC%A1%B0%EA%B1%B4%EC%97%90-%EB%94%B0%EB%A5%B8-%EC%9A%94%EC%86%8C-%EC%84%A0%ED%83%9D-has-%EC%84%A0%ED%83%9D%EC%9E%90
https://stackoverflow.com/questions/18482718/using-css-to-detect-if-child-exists

# 7. home 버튼을 눌렀는데 home/index.html이 아니라 2024-10-23.md가 왜 불러와지는거죠??
github.io 홈에 들어가면 정상적으로 홈으로 가는 게 아니라 가장 최근에 포스팅한 포스트로 연결이 되는 것이 문제였다.
_layout 파일에 있던 post.html에서 코드를 변경하고 있었기 때문에 그쪽을 건드려서 뭔가 발생하는 건가 생각했다.

* 참고
https://sehooni.github.io/blog/github_blog_not_shown/

아직 포스팅을 완벽하게 작성해놓은 게 아니여서 2024-10-23-.md으로 저장해놓고 있었다.
포스트 이름을 완벽하게 채웠더니 homepage가 원상 복귀했다.

그러면 이름을 완벽하게 안 적어놨을 때마다 발생하려나??
나중에 한 번 확인해봐야겠다.

이렇게 수정하고 push 했는데 build 오류남
뭐지???
* 참고
https://roadtos7.github.io/android/2021/06/10/Jekyll-FixBuildError.html

그래서 글을 조금씩 잘라서 push 해보기로 함
#5, #6까지 올렸을 때 죽음
html 코드를 올리면 죽네
