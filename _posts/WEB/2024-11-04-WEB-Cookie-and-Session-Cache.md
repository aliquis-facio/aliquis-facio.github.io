---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[WEB] 쿠키와 세션 (ft. 캐시)"
excerpt: "모의해킹 취업반 스터디 7기 3주차"

date: 2024-11-04
last_modified_at:

categories: [WEB]
tags: [WEB, PHP]
---

# 목차
* [Q1. 어떻게 로그인을 유지할 수 있을까?](#q1-어떻게-로그인을-유지할-수-있을까)
* [1. 쿠키](#1-쿠키cookie)
* [2. 세션](#2-세션session)
* [3. 쿠키 VS. 세션](#3-쿠키cookie-vs-세션session)
* [4. 캐시](#4-캐시cache)
* [참조](#쿠키-구성-요소)

# Q1. 어떻게 로그인을 유지할 수 있을까?
HTTP는 Connectionless, Stateless한 특징을 가지고 있다.
> **Connectionless**: 클라이언트가 요청을 한 후 응답을 받으면 그 연결을 끊어 버리는 특징  
> **Stateless**: 통신이 끝나면 상태를 유지하지 않는 특징.

이 두 특징으로 인해 원래라면 사이트에 접속할 때마다 로그인을 해야 한다.  
하지만 로그인 유지를 하겠다고 하면 다음에 접속할 때도 로그인이 유지가 되어 있다.  
과연 어떻게 로그인을 유지할 수 있는 것일까?

# 1. 쿠키(Cookie)
* **클라이언트에 저장**되는 **키와 값이 들어있는 작은 데이터 파일**이다.
* 만료 시간이 정해지면 **브라우저가 종료되어도 인증이 유지**된다.
* 클라이언트의 상태 정보를 로컬에 저장했다가 참조한다.

## 쿠키 구성 요소
* 쿠키 이름(Name)
* 쿠키 값(Value)
* 쿠키 만료 시간(Expires) 
* 쿠키를 전송할 도메인(Domain)
* 쿠키를 전송할 경로(Path)
* 보안 연결 여부(Secure)
* Http Only 여부(HttpOnly)

## 쿠키 동작 방식
<img src = "https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2024-11-08-4.jpg?raw=true" title = "쿠키 동작">

# 2. 세션(Session)
* **쿠키를 기반**으로 하지만 **사용자 정보 파일을 서버 측에서 관리**한다
* 클라이언트가 request를 보내면, 해당 서버의 엔진이 클라이언트에게 유일한 id를 부여하는 것이 세션id이다.
* 클라이언트를 구분하기 위해 세션id를 부여하며 웹 브라우저가 서버에 접속한 후 종료할 때까지 인증상태를 유지한다
* 세션id는 고유하기 때문에 유추할 수 있으면 탈취가 가능하다 -> 유추할 수 없는 일련의 문구로 이루어져야 한다.
~~세션id에 Hash를 여러번 먹이면 되지 않을까?~~

## 세션 동작 방식
<img src = "https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2024-11-08-5.jpg?raw=true" title = "세션 동작">

# 3. 쿠키(Cookie) vs. 세션(Session)
<table>
    <thead>
        <tr>
            <td>구분</td>
            <td>쿠키(Cookie)</td>
            <td>세션(Session)</td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>저장 위치</td>
            <td>클라이언트</td>
            <td>서버</td>
        </tr>
        <tr>
            <td>저장 형식</td>
            <td>text</td>
            <td>object</td>
        </tr>
        <tr>
            <td>만료 시점</td>
            <td>쿠키 저장 시 설정<br>(설정 없으면 브라우저 종료 시)</td>
            <td>미정</td>
        </tr>
        <tr>
            <td>리소스</td>
            <td>클라이언트의 리소스</td>
            <td>서버의 리소스</td>
        </tr>
        <tr>
            <td>용량 제한</td>
            <td>20개 / 도메인, 4kb / 쿠키</td>
            <td>제한 X</td>
        </tr>
        <tr>
            <td>속도</td>
            <td>비교적 빠름</td>
            <td>비교적 느림</td>
        </tr>
        <tr>
            <td>보안</td>
            <td>클라이언트 로컬에 저장 -> 변질 or request 스니핑 -> 취약</td>
            <td>쿠키를 이용해 세션id만 저장& 세션id로 구분해서 서버에서 처리 -> 비교적 보안성이 좋다.</td>
        </tr>
    </tbody>
</table>

-> 세션은 서버의 자원을 사용하기에 서버 자원에 한계가 있고, 서버 속도가 느려질 수 있기 때문에 자원관리 차원에서 쿠키와 세션을 적절한 요소 및 기능에 병행 사용한다.

# 4. 캐시(Cache)
* **웹 페이지 요소를 저장하기 위한** 임시 저장소이다.  
* **웹 페이지를 빠르게 불러올 수 있도록 도와준다.**  
* 한 번 캐시에 저장되면 브라우저를 참고하기 때문에 서버에서 변경이 되어도 사용자는 변경되어 보이지 않을 수 있다.  
이럴 때는 캐시를 지워주거나 서버에서 클라이언트로 응답을 보낼 때 header에 캐시 만료 시간을 명시하는 방법 등으로 해결할 수 있다.

# 참조
* [쿠키, 세션, 캐시 1](https://interconnection.tistory.com/74)
* [쿠키, 세션, 캐시 2](https://dev-coco.tistory.com/61)
* [쿠키, 세션 1](https://lgphone.tistory.com/65)
* [쿠키, 세션 2](https://velog.io/@octo__/%EC%BF%A0%ED%82%A4Cookie-%EC%84%B8%EC%85%98Session)
* [JSESSIONID](https://dmobi.tistory.com/136)