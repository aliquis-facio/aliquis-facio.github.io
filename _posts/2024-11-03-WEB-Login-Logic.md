---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[WEB] 로그인 로직"
excerpt: "모의해킹 취업반 스터디 7기 3주차"

date: 2024-11-03
last_modified_at: 2024-11-05

categories: [WEB]
tags: [WEB, PHP]
---

# 목차
* [로그인 로직 케이스](#로그인-로직-케이스)
* [1. 식별, 인증 동시](#1-식별-인증-동시)
* [2. 식별, 인증 분리](#2-식별-인증-분리)
* [3. 해시(HASH)](#3-해시hash)
* [4. ESCAPE STRING](#4-escape-string)
<!-- * [5. PREPARED](#5-prepared) -->

# 로그인 로직 케이스
## 1. 식별, 인증 동시
user를 식별하는 것은 id를 확인하는 것이고, user가 자신이 맞는 지 인증하는 과정은 pw를 확인하는 것이다.

```php
// identify and certify as the same time
function login1($conn, $user_id, $user_pw) {
    // DB connector와 user id, user pw를 파라미터로 받는다

    $sql = "SELECT * FROM Data WHERE id = '{$user_id}' AND pw = '{$user_pw}'";
    // DB로 sql문을 보낼 때 id와 pw를 함께 확인한다

    $result = mysqli_fetch_array(mysqli_query($conn, $sql));
    // mysqli_query로 sql문을 보내고 결과값을 array로 변경한다

    if($result) { // result가 존재한다면
        echo "<script>alert('login1 success')</script>";
    } else {
        echo "<script>alert('fail')</script>";
    }
}
```

## 2. 식별, 인증 분리

``` php
// identify and certify seperation
function login2($conn, $user_id, $user_pw) {
    $sql = "SELECT * FROM Data WHERE id = '{$user_id}'";
    // DB로 sql문을 보낼 때 id를 확인한다

    $result = mysqli_fetch_array(mysqli_query($conn, $sql));

    if($result) {
        $db_pw = $result['pw'];
        //db에서 가져온 pw
    
        if ($db_pw == $user_pw) { // db에서 가져온 pw와 유저가 입력한 pw가 같다면
            echo "<script>alert('login2 success')</script>";
        } else {
            echo "<script>alert('fail')</script>";
        }
    } else {
        echo "<script>alert('fail')</script>";
    }
}
```

## 3. 해시(Hash)
PW를 해시 처리한다.

### 1. 식별, 인증 동시

```php
// identify and certify as the same time with hash
function login3($conn, $user_id, $user_pw) {
    $hash_user_pw = hash('sha512', $user_pw);
    //user_pw를 sha512 해시 알고리즘으로 해시화한다

    $sql = "SELECT * FROM Data WHERE id = '{$user_id}' AND hash_pw = '{$hash_user_pw}'";
    // DB로 sql문을 보낼 때 id와 hash한 pw를 함께 확인한다

    $result = mysqli_fetch_array(mysqli_query($conn, $sql));
    
    if($result) {
        echo "<script>alert('login3 success')</script>";
    } else {
        echo "<script>alert('fail')</script>";
    }
}
```

### 2. 식별, 인증 분리

```php
// identify and certify seperation with hash
function login4($conn, $user_id, $user_pw) {
    $hash_user_pw = hash('sha512', $user_pw);
    $sql = "SELECT * FROM Data WHERE id = '{$user_id}'";
    $result = mysqli_fetch_array(mysqli_query($conn, $sql));
    
    if ($result) {
        $hash_db_pw = $result['hash_pw'];

        if ($hash_db_pw == $hash_user_pw) {
            echo "<script>alert('login4 success')</script>";
        } else {
            echo "<script>alert('fail')</script>";
        }
    } else {
        echo "<script>alert('fail')</script>";
    }
}
```

## 4. Escape String
**Escape String**: \를 앞에 붙여 php에 정의되어 있는 원래의 의미를 벗어나는(escape) 문자이다.  
input으로 들어온 id, pw에 개행문자 처리를 한다.  

| Escape String | Meaning |
| -- | -- |
| \' | Single Quote |
| \" | Double Quote |
| \$ | PHP variables |
| \n | New Line |
| \r | Carriage Return |
| \t | Tab |
| \f | Form Feed |
| \ooo | Octal value |
| \xhh | Hex value |
  
### 1. 식별, 인증 동시

``` php
// identify and certify as the same time with escape text
function login5($conn, $user_id, $user_pw) {
    $user_id = mysqli_real_escape_string($conn, $user_id);
    $user_pw = mysqli_real_escape_string($conn, $user_pw);
    // user_id와 user_pw를 mysqli_real_escape_string로 개행처리를 한다

    $sql = "SELECT * from Data where id = '{$user_id}' and pw = '{$user_pw}'";
    $result = mysqli_fetch_array(mysqli_query($conn, $sql));

    if($result) {
        echo "<script>alert('login5 success')</script>";
    } else {
        echo "<script>alert('fail')</script>";
    }
}
```

### 2. 식별, 인증 분리

```php
// identify and certify seperation with escape text
function login6($conn, $user_id, $user_pw) {
    $user_id = mysqli_real_escape_string($conn, $user_id);
    $user_pw = mysqli_real_escape_string($conn, $user_pw);

    $sql = "SELECT * FROM Data WHERE id = '{$user_id}'";
    $result = mysqli_fetch_array(mysqli_query($conn, $sql));
    
    $db_pw = $result['pw'];
    if ($db_pw == $user_pw) {
        echo "<script>alert('login6 success')</script>";
    } else {
        echo "<script>alert('fail')</script>";
    }
}
```

### 3. 식별, 인증 동시 + hash

```php
// identify and certify as the same time with hash, escape text
function login7($conn, $user_id, $user_pw) {
    $user_id = mysqli_real_escape_string($conn, $user_id);
    $user_ipw = mysqli_real_escape_string($conn, $user_pw);

    $hash_user_pw = hash('sha512', $user_pw);
    $sql = "SELECT * FROM Data WHERE id = '{$user_id}' AND hash_pw = '{$hash_user_pw}'";
    $result = mysqli_fetch_array(mysqli_query($conn, $sql));
    
    if($result) {
        echo "<script>alert('login7 success')</script>";
    } else {
        echo "<script>alert('fail')</script>";
    }
}
```

### 4. 식별, 인증 분리 + hash

```php
// identify and certify seperation with hash, escape text
function login8($conn, $user_id, $user_pw) {
    $user_id = mysqli_real_escape_string($conn, $user_id);
    $user_pw = mysqli_real_escape_string($conn, $user_pw);

    $hash_user_pw = hash('sha512', $user_pw);
    $sql = "SELECT * FROM Data WHERE id = '{$user_id}'";
    $result = mysqli_fetch_array(mysqli_query($conn, $sql));
    
    $hash_db_pw = $result['hash_pw'];
    if ($hash_db_pw == $hash_user_pw) {
        echo "<script>alert('login8 success')</script>";
    } else {
        echo "<script>alert('fail')</script>";
    }
}
```

<!-- ## 5. prepared -->

# 참고
1. [PHP Hash 함수 사용](https://blog.naver.com/crehacktive3/221146696692)
1. [SQL Injection](https://ko.wikipedia.org/wiki/SQL_%EC%82%BD%EC%9E%85)
1. [Escape String 1](https://www.w3schools.com/php/php_string_escape.asp)
1. [Escape String 2](https://m.blog.naver.com/jskorl/220544334899)
1. [PHP 문법: mysqli_real_escape_string](https://www.php.net/manual/en/mysqli.real-escape-string.php)