---
layout: post
comments: true
sitemap:

title: "[CTF] Dreamhack 문제 풀이: username:password@"
excerpt: "JS Prototype, SSRF"

date: 2026-03-21
last_modified_at: 2026-03-24

categories: [CTF]
tags: [TIL, WEB, CTF]
---

<!-- markdownlint-disable MD010 MD025 MD033 -->

# username:password@

## 목차

1. [Vuln](#1-vuln)
1. [Code](#2-code)
1. [Payload](#3-payload)
1. [참고](#참고)

---

## 1. Vuln

JS Prototype-based Auth Bypass
SSRF

## 2. Code

```js
// 모듈 불러오기
const express = require('express');
const basicAuth = require('express-basic-auth');
const fetch = require('node-fetch');
const fs = require('fs');

// 앱 생성, 포트 설정, 플래그 읽기
const app = express();
const port = 3000;
const flag = fs.readFileSync('flag.txt', 'utf8');

// 랜덤 hex 문자열 생성 함수
const genRanHex = size =>
  [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

// 사용자 저장 객체: users
const users = {
  // admin: 랜덤 hex 16자리 문자열
  'admin': genRanHex(16),
};

// basic auth 검사 수행
const loginRequired = basicAuth({
  // 사용자가 입력한 username, password를 받아 users 객체에 저장된 값과 비교
  authorizer: (username, password) => users[username] == password,
  unauthorizedResponse: 'Unauthorized',
});

// 관리자 전용
const adminOnly = (req, res, next) => {
  // 로그인한 사용자 중 admin만 통과
  if (req.auth?.user == 'admin') {
    return next();
  }
  return res.status(403).send('Only admin can access this resource');
};


// GET /
app.get('/', (req, res) => {
  // http://username:password@host
  res.send('login with http://username:password@...');
});

// GET /register
app.get('/register', (req, res) => {
  // 기능 없음
  res.send('Not implemented');
});

// GET /report
// 로그인 필요
app.get('/report', loginRequired, (req, res) => {
  // 쿼리 파라미터 path 읽기
  const path = req.query.path;

  // path 없을 때 html 폼 반환
  if (!path) {
    return res.send("<form method='GET'>http://<input name='path' /><button>Submit</button></form>");
  }

  // 서버가 직접 외부에 http 요청을 보냄
  // url 형태: http://admin:<random_password>@${path}
  // 서버가 자기 내부에만 admin 자격 증명을 붙여서 path로 접속
  fetch(`https://admin:${users["admin"]}@${path}`)
    .then(() => res.send("Success"))
    .catch(() => res.send("Error"));
});

// GET /admin
// loginRequired -> adminOnly 실행
app.get('/admin', loginRequired, adminOnly, (req, res) => {
  // flag 반환
  res.send(flag);
});

// 앱 실행
app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening at http://localhost:${port}`);
});
```

loginRequired 함수에서 취약점이 존재한다.

```js
authorizer: (username, password) => users[username] == password
```

{% raw %}
`===`가 아니라 `==`를 쓰고 있고, `users`가 일반 객체이기 때문에 상속 프로퍼티 접근이 가능하다.

toString
function toString() { [native code] }
constructor
function Object() { [native code] }
__proto__
[object Object]
{% endraw %}

## 3. Payload

1. `/report` 인증 우회
  ![|398x423](../../_image/2026-03-24-00-18-27.png)
  ![|398x74](../../_image/2026-03-24-00-17-09.png)
2. `/report`에서 관리자 비밀번호 유출
  ![|398x422](../../_image/2026-03-24-00-13-27.png)
  ![|398x362](../../_image/2026-03-24-00-12-22.png)
  ![|398x249](../../_image/2026-03-24-00-19-59.png)
3. 유출한 admin 계정으로 `/admin` 접근
  ![|398x425](../../_image/2026-03-24-00-19-25.png)
  ![|398x74](../../_image/2026-03-24-00-16-42.png)

---

## 참고

- [[JS] 함수 1](./JavaScript-Function-1)
