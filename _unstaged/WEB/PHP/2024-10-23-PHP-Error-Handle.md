---
layout: post
comments: true
sitemap:
  changefreq: daily
  priority: 0.5
title: "[PHP] PHP 에러 처리"
excerpt: 모의해킹 취업반 스터디 7기 2주차
date: 2024-10-23
last_modified_at: 2026-04-28
tags:
  - WEB
  - TIL
---

# PHP Error 처리

PHP 코드를 실행하다가 에러가 발생하면 화면이 멈추거나, 아무 출력 없이 코드가 종료되는 경우가 있다.  
이럴 때는 먼저 **에러를 화면에 출력하도록 설정**하고, 필요한 위치에 `echo`, `var_dump()` 등을 넣어 코드 흐름을 확인해야 한다.

---

# 1. PHP 에러 출력하기

PHP는 설정에 따라 에러를 화면에 보여주지 않을 수 있다.  
개발 중에는 에러를 직접 확인할 수 있도록 에러 출력 설정을 켜는 것이 좋다.

PHP 파일의 가장 위에 다음 코드를 추가한다.

```php
<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
?>
````

## 의미

```php
ini_set('display_errors', 1);
```

실행 중 발생한 에러를 화면에 출력한다.

```php
ini_set('display_startup_errors', 1);
```

PHP 시작 단계에서 발생한 에러도 출력한다.

```php
error_reporting(E_ALL);
```

모든 종류의 에러, 경고, 알림을 출력 대상으로 설정한다.

---

# 2. echo로 코드 흐름 확인하기

PHP 코드가 중간에 죽는 것처럼 보일 때는 `echo`를 이용해 어디까지 실행되었는지 확인할 수 있다.

```php
<?php
echo "1번 지점 실행됨<br>";

$conn = mysqli_connect("localhost", "root", "password", "test");

echo "2번 지점 실행됨<br>";

$query = "SELECT * FROM users";

echo "3번 지점 실행됨<br>";

$result = mysqli_query($conn, $query);

echo "4번 지점 실행됨<br>";
?>
```

예를 들어 화면에 다음과 같이 출력된다면

```text
1번 지점 실행됨
```

2번 지점이 출력되지 않았으므로 `mysqli_connect()` 근처에서 문제가 발생했을 가능성이 높다.

---

# 3. 변수 값 확인하기

단순히 코드가 실행되는지만 보는 것이 아니라, 변수에 어떤 값이 들어 있는지도 확인해야 한다.

## echo 사용

문자열이나 숫자처럼 단순한 값은 `echo`로 확인할 수 있다.

```php
<?php
$name = "홍길동";
echo $name;
?>
```

## var_dump 사용

배열, 객체, null, boolean 같은 값은 `var_dump()`로 확인하는 것이 좋다.

```php
<?php
$user = [
    "id" => 1,
    "name" => "홍길동"
];

var_dump($user);
?>
```

출력 결과 예시:

```text
array(2) {
  ["id"]=>
  int(1)
  ["name"]=>
  string(9) "홍길동"
}
```

---

# 4. SQL 에러 확인하기

PHP에서 DB 쿼리를 실행할 때 실패하면 쿼리 에러를 직접 확인해야 한다.

```php
<?php
$conn = mysqli_connect("localhost", "root", "password", "test");

if (!$conn) {
    die("DB 연결 실패: " . mysqli_connect_error());
}

$sql = "SELECT * FROM users";

$result = mysqli_query($conn, $sql);

if (!$result) {
    die("쿼리 실패: " . mysqli_error($conn));
}

echo "쿼리 성공";
?>
```

`mysqli_error($conn)`을 사용하면 SQL 문법 오류나 테이블명 오류 등을 확인할 수 있다.

---

# 5. die()로 강제 종료하면서 확인하기

특정 지점에서 값 확인 후 코드를 멈추고 싶다면 `die()`를 사용할 수 있다.

```php
<?php
$id = $_GET["id"];

var_dump($id);
die("여기서 종료");
?>
```

이렇게 하면 `$id` 값을 확인한 뒤 그 아래 코드는 실행되지 않는다.

---

# 6. 자주 쓰는 디버깅 패턴

```php
<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

echo "start<br>";

$conn = mysqli_connect("localhost", "root", "password", "test");

if (!$conn) {
    die("DB 연결 실패: " . mysqli_connect_error());
}

echo "DB 연결 성공<br>";

$sql = "SELECT * FROM users";
echo "SQL: " . $sql . "<br>";

$result = mysqli_query($conn, $sql);

if (!$result) {
    die("쿼리 실패: " . mysqli_error($conn));
}

echo "쿼리 성공<br>";

while ($row = mysqli_fetch_assoc($result)) {
    var_dump($row);
    echo "<br>";
}
?>
```

---

# 정리

PHP 코드가 에러 없이 그냥 죽는 것처럼 보이면 먼저 에러 출력을 켜야 한다.

```php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
```

그다음 `echo`를 이용해 코드가 어디까지 실행되는지 확인한다.

```php
echo "여기까지 실행됨";
```

변수 값은 `echo`, 배열이나 객체는 `var_dump()`로 확인한다.

```php
var_dump($data);
```

DB 작업 중 문제가 생기면 `mysqli_connect_error()`와 `mysqli_error($conn)`으로 원인을 확인한다.

```php
die("쿼리 실패: " . mysqli_error($conn));
```

즉, PHP 에러 처리의 기본 흐름은 다음과 같다.

```text
1. 에러 출력 설정 켜기
2. echo로 실행 위치 확인
3. var_dump로 변수 확인
4. DB 에러 메시지 확인
5. die()로 원하는 지점에서 멈춰서 확인
```
