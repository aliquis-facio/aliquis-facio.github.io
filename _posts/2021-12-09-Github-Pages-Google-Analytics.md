---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[GITHUB PAGES] 구글 애널리틱스 적용하기"
excerpt: "구글 애널리틱스 적용"

date: 2021-12-09
last_modified_at: 2024-12-27

categories: [BLOG]
tags: [BLOG]
---

# Google Analytics 적용하기
1. google-analytics 가입함.
2. google-analytics에서 속성 만들기
    웹사이트: aliquis-facio.github.io
    URL: https://aliquis-facio.github.io/
    카테고리: github blog
    시간대: 그리니치 표준시, 대한민국 시간
3. 추적 ID 복사
4. _config.yml에 적용 - 내가 가져온 테마에 경우에는  

```
google:
#plus:            #username
analytics:        내 트랙 아이디
#verify:
#ad-client:
#ad-slot:
```

이렇게 되있었다.
5. /_includes/scripts.html 부분에  

*기존에 있던 코드*  
```
    Asynchronous Google Analytics snippet
    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
      ga('create', '{{ site.google.analytics }}', 'auto');  
      ga('require', 'linkid', 'linkid.js');
      ga('send', 'pageview');
    </script> -->
    Global site tag (gtag.js) - Google Analytics
```
  
*변경한 코드*  
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-QE0BFF2TLD"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-QE0BFF2TLD');
</script>
```
  
스트림 설정에서 태그하기에 대한 안내 - 새로운 온페이지 태그 추가를 누르면 나오는 코드이다. 이번에 구글에서 새롭게 발표한 추적코드인데, 애널리틱스, 광고 전환 추적 및 리마케팅을 한번에 적용할 수 있는 듯하다.  
  
~~이 부분이 특히 참고 사이트가 많은 이유는 구글 애너리틱스가 잘 적용됬는지 확인이 잘 되지 않아서 틀려서 그런건가하고 다른 사이트를 참조하느라 그랬다.~~  
  
물론 지금은 확실히 확인이 되었다.
![google-analytics](https://github.com/aliquis-facio/aliquis-facio.github.io/blob/master/_image/2021-12-09-Screenshot.png?raw=true "2 People - One is me, and the other is my freind I think")

# 참고
* [github page 와 google analytics 연동](https://inasie.github.io/it%EC%9D%BC%EB%B0%98/1/)
* [Google 검색 엔진과 애널리틱스 등록하기](https://devinlife.com/howto%20github%20pages/google-search-console-and-analytics/)
* [[Github Blog] 방문자 통계(Analytics)하기](https://velog.io/@eona1301/Github-Blog-%EB%B0%A9%EB%AC%B8%EC%9E%90-%ED%86%B5%EA%B3%84Analytics%ED%95%98%EA%B8%B0)
* [깃블로그(jekyll)에 구글 애널리틱스(Google Analytics) 적용법!](https://mingnol2.tistory.com/70)
* [github blog, page google analytics로 측정하기](https://chinsun9.github.io/2020/11/20/github-blog-page-google-analytics%EB%A1%9C-%EC%B8%A1%EC%A0%95%ED%95%98%EA%B8%B0/)
* [404 Not Found](https://atgane.tistory.com/14)
* [404 Not Found](https://atgane.tistory.com/14)