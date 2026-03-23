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

<!-- markdownlint-disable MD010 MD025 MD029 MD033 -->

# username:password@

## 목차

1. [Vuln](#1-vuln)
1. [Code](#2-code)
1. [Payload](#3-payload)
    1. [`/report` 인증 우회](#31-report-인증-우회)
    1. [`/report`에서 관리자 비밀번호 유출](#32-report에서-관리자-비밀번호-유출)
    1. [유출한 admin 계정으로 `/admin` 접근](#33-유출한-admin-계정으로-admin-접근)
1. [참고](#참고)

---

## 1. Vuln

- JS Prototype 기반 인증 우회
- [SSRF](../SSRF)

## 2. Code

<details>
<summary>전체 코드 접기/펼치기</summary>
<div markdown="1">

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

</div>
</details>

loginRequired 함수에서 취약점이 존재한다.

```js
authorizer: (username, password) => users[username] == password
```

{% raw %}`===`{% endraw %}가 아니라 {% raw %}`==`{% endraw %}를 쓰고 있고, `users`가 일반 객체이기 때문에 상속 프로퍼티 접근이 가능하다.

우회 후보:

1. {% raw %}`toString`{% endraw %}
    - username: {% raw %}`toString`{% endraw %}
    - password: {% raw %}`function toString() { [native code] }`{% endraw %}
2. {% raw %}`constructor`{% endraw %}
    - username: {% raw %}`constructor`{% endraw %}
    - password: {% raw %}`function Object() { [native code] }`{% endraw %}
3. {% raw %}`__proto__`{% endraw %}
    - username: {% raw %}`__proto__`{% endraw %}
    - password: {% raw %}`[object Object]`{% endraw %}

## 3. Payload

### 3.1. `/report` 인증 우회

![398x423](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-03-24-00-18-27.png)

> {% raw %}`toString:function toString() { [native code] }`{% endraw %}를 base64로 인코딩해서 Authorization에 붙인다.

![398x74](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-03-24-00-17-09.png)

> 결과

### 3.2. `/report`에서 관리자 비밀번호 유출

![398x422](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-03-24-00-13-27.png)

> `path`를 내 requestbin 주소를 향하게 하고, 같은 방식으로 인증을 한다.

![398x362](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-03-24-00-12-22.png)

> requestbin에서 요청 결과를 확인할 수 있다.

![398x249](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-03-24-00-19-59.png)

> base64로 디코딩하면 admin의 랜덤 비밀번호를 확인할 수 있다.

### 3.3. 유출한 admin 계정으로 `/admin` 접근

![398x425](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-03-24-00-19-25.png)

> 방금 확인한 admin 비밀번호를 이용해 base64 인코딩 후 요청을 보낸다.

![398x74](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-03-24-00-16-42.png)

> flag를 확인할 수 있다.

---

## 참고

- [[JS] 함수 1](../JavaScript-Function-1)
- [[JS] 함수 2](../JavaScript-Function-2)
- [[JS] 함수 3](../JavaScript-Function-3)
- [[JS] 함수 4](../JavaScript-Function-4)
- [[JS] 함수 5](../JavaScript-Function-5)
