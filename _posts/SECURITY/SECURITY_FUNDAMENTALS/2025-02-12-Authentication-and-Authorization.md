---
layout: post
comments: true
sitemap:
title: "[SECURITY] 인증/인가 취약점"
excerpt: 모의해킹 취업반 스터디 7기 16주차
date: 2025-02-16
last_modified_at: 2026-09-07
categories:
  - SECURITY
tags:
  - TIL
  - WEB
  - SECURITY
---

<!-- markdownlint-disable md004 md007 md010 MD025 md033 -->

# 인증(Authentication)과 인가(Authorization)

## 목차

1. [인증(Authentication)](#1-인증authentication)
1. [인증 취약점 대표 사례](#11-인증-취약점-대표-사례)
1. [인가(Authorization)](#2-인가authorization)
1. [인가 취약점 주요 공격 방법](#21-인가-취약점-주요-공격-방법)
1. [인가 취약점 대표 사례](#22-인가-취약점-대표-사례)
1. [인증과 인가 비교](#3-인증과-인가-비교)

---

## 1. 인증(Authentication)

인증: 사용자가 주장하는 사람과 실제 사용자가 동일한지 확인하는 과정이다.

- e.g. 로그인, 비밀번호, OTP, 생체인증 등

### 1.1. 인증 취약점 대표 사례

- 클라이언트 측 정보만으로 인증: 서버가 검증하지 않고 쿠키나 요청 파라미터를 그대로 신뢰하는 경우.
- 인증 프로세스 누락: 다단계 인증 과정의 중간 단계를 생략하고 결과 페이지나 내부 API에 직접 접근하는 공격.
	- e.g. Authentication Bypass, Forced Browsing
- 파라미터·응답값 변조: 클라이언트가 인증 결과를 변경했는데 서버가 이를 다시 검증하지 않는 경우. 서버가 클라이언트가 보낸 인증 성공 여부를 그대로 신뢰하면 인증을 우회할 수 있다.
- 인증 시도 횟수 제한 미적용
	- e.g. Brute Force, Guessing
	- 대응 방안: 요청 속도 제한, 계정 잠금 정책, MFA, 이상 로그인 탐지 등을 적용

## 2. 인가(Authorization)

인가: 인증된 사용자가 특정 자원이나 기능을 사용할 권한이 있는지 확인하는 과정이다.

- e.g. 관리자 페이지 접근, 게시글 수정 등

### 2.1. 인가 취약점 주요 공격 방법

* 직접 접근: 화면에서 버튼이나 링크를 숨겼어도 공격자가 URL이나 API를 직접 호출하는 방식이다.
	* e.g. Guessing, Forced Browsing
* 파라미터 변조: 요청의 사용자 번호, 게시글 번호, 권한 값 등을 변경한다.
	* e.g. IDOR(Insecure Direct Object Reference), BOLA(Broken Object Level Authorization)

### 2.2. 인가 취약점 대표 사례

1. 주석으로만 접근 제한

	```html
	<!-- 관리자만 사용할 수 있는 기능 -->
	```

2. JavaScript에서만 권한 확인

	```js
	if (user.role === "admin") { showAdminButton(); }
	```

## 3. 인증과 인가 비교

|구분|인증(Authentication)|인가(Authorization)|
|---|---|---|
|의미|누구인지 확인|무엇을 할 수 있는지 결정|
|목적|사용자 식별|권한 통제|
|시점|가장 먼저 수행|인증 이후 수행|
|기준|비밀번호, OTP, 생체정보 등|역할·권한 정책|
|예시(학교)|사원증으로 신원 확인|사원/팀장/인사팀/관리자별 기능 제한|

<div class="obsidian-links" style="display: none;">

[[CTF] Dreamhack 문제 풀이: {\"role\": \"admin\"}](../CTF/2026-02-03-role-admin.md)
[[SECURITY] WEB 취약점](2025-02-21-WEB-Secure-Weak-Points.md)

</div>
