---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[SECURITY] JSON Injection이란"
excerpt: "JSON Injection"

date: 2026-02-03
last_modified_at: 2026-02-04

categories: [SECURITY]
tags: [TIL, WEB, SECURITY]
---

<!-- markdownlint-disable MD010 MD025 -->

# JSON Injection

## 목차

1. [정의](#1-정의)
2. [영향](#2-영향)
3. [동작원리](#3-동작원리)
	1. [Server-side JSON Injection](#31-server-side-json-injection)
	2. [Client-side JSON Injection](#32-client-side-json-injection)
4. [파서 불일치 기반 공격](#33-파서-불일치-기반-공격)
5. [보안대책](#4-보안대책)
6. [참고](#참고)

---

## 1. 정의

JSON Injection은 공격자가 JSON 문자열/스트림에 데이터를 주입하거나, 악성 JSON을 입력으로 제공해 애플리케이션의 로직, 권한, 처리 흐름을 바꾸게 만드는 취약점이다. 일반적으로 서버 측(JSON 생성/직렬화 단계)과 클라이언트 측(JSON 파싱/처리 단계)으로 구분된다.

## 2. 영향

- 권한 상승, 비즈니스 로직 변조(예: role, accountType, isAdmin 같은 필드 우회)
- XSS로의 연계(특히 브라우저에서 `eval` 기반 파싱, 혹은 JSON이 DOM/JS 컨텍스트로 흘러갈 때)
- 다단계 취약점 체인의 시작점(파서/검증 불일치 → 후속 인젝션/메모리 취약점 등)

## 3. 동작원리

### 3.1. Server-side JSON Injection

서버가 JSON을 만들 때 문자열 연결(concatenation)로 JSON을 구성하거나, 사용자 입력을 제대로 정리하지 않고 JSON 스트림에 넣을 때 발생한다.

핵심 메커니즘은 보통 아래 중 하나다.

- JSON 구조 탈출: `"`, `{`, `}`, `,` 등을 이용해 문자열을 끊고 필드를 추가/변조
- 중복 키(duplicate key) 악용: `{"role": "user", "role": "admin"}` 처럼 키를 중복시키면, 대부분의 파서가 마지막 값을 채택하는 동작을 이용해 권한을 바꿈. (JSON 객체의 키를 해석하는 방식은 구현체마다 다름)

### 3.2. Client-side JSON Injection

클라이언트 스크립트가 공격자 제어 데이터(예: URL 파라미터, 해시, post 메시지 등)를 문자열에 섞어 JSON처럼 만든 뒤 `JSON.parse()`, `jQuery.parseJSON()` 등으로 파싱해서 처리할 때 의도치 않은 동작(권한/행위 유발, XSS 등)으로 이어질 수 있다.
특히 `eval()` 형태는 곧바로 코드 실행(XSS)로 직결될 수 있어 대표적인 위험 패턴으로 언급된다.

### 3.3. 파서 불일치 기반 공격

현대 API 파이프라인에서는 WAF, API 게이트웨이, 프록시, 웹 서버, 라이브러리 등 여러 파서가 얽혀있고, 이들 간 허용 문법, 중복키 처리, 이스케이프 처리, 숫자 표현 처리가 다르면, 앞단 검증을 통과한 JSON이 뒷단에서 다르게 해석되어 취약점으로 이어질 수 있다.

## 4. 보안대책

Injection 보안 대책의 핵심은 데이터를 명령 및 쿼리와 분리하는 것이고, JSON 맥락에서는 JSON을 문자열로 만들지 말고, 파서로 엄격하게 관리하는 것이다.

1. 서버 측 (JSON 생성)
	- JSON을 문자열 연결로 만들지 말고 표준 직렬화 라이브러리로 생성한다.
	- 중복 키, 알 수 없는 필드를 허용하지 않도록 역직렬화 정책을 거부로 설정한다.
	- API 입력은 JSON Schema/DTO 기반으로 타입, 필드의 allowlist를 검증한다.
2. 클라이언트 측 (JSON 파싱/처리)
	- `eval()`로 JSON을 파싱하지 않는다.
	- 신뢰할 수 없는 입력이 JSON sink로 들어가지 않도록 설계한다.
	- 파싱된 데이터가 DOM/HTML/JS 컨텍스트로 가는 경우 출력 인코딩 + 안전한 DOM API를 사용한다.
3. 파서 불일치 방지
	- 게이트웨이/WAF/백엔드가 동일한 JSON 문법로 처리하도록 한다.
	- 중복 키, 특수 문자, 주석, 비표준 JSON 같은 회색 지대 입력에 대해 일관된 거부 정책을 적용한다.

---

## 참고

- [invicti: JSON 주입](https://www.invicti.com/learn/json-injection)
- [GeekNews: JSON 인젝션을 이용한 API 공격](https://news.hada.io/topic?id=17615)
- [OWASP: Injection](https://owasp.org/Top10/2021/A03_2021-Injection/index.html)
- [PortSwigger: DOM-based client-side JSON injection](https://portswigger.net/web-security/dom-based/client-side-json-injection)
- [CWE: OWASP Top Ten 2013 Category A1 - Injection](https://cwe.mitre.org/data/definitions/929.html)