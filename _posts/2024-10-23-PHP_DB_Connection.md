---
layout: post
comments: true
sitemap:
    changefreq: daily
    priority: 0.5

title: "[PHP] MySQL 연결하기"
excerpt: "모의해킹 취업반 스터디 7기 2주차"

date: 2024-10-23
last_modified_at: 2024-11-22

tags: [WEB, PHP, DATABASE]
---

# 회고
1. WAS(Web + Application + Server): 애플리케이션을 수행 -> 주로 동적 서버 컨텐츠를 수행, 주로 데이터베이스 서버와 같이 수행된다.
2. Database: 데이터를 저장하는 곳
∴ WAS(Web + Application + Server) <-> DB(서로 상호작용한다)  
-> 서로 상호작용하기 위해 연결을 해야 한다. -> WAS에 DB에 접속하기 위한 ID와 PW가 무조건 들어있다~~(Web Shell을 까면 DB 추측을 먼저 해야 한다)~~  
-> 나는 PHP와 MySQL을 연동시킬 것이다.  

# Q. PHP에서 MySQL query를 어떻게 연결하냐?
크게 3가지 형태로 나눠진다.  
MySQLi를 **Object**로 관리하거나 **Procedural**(절차 형식을 따르거나), **PDO**(PHP Data Object)라는 프레임워크를 사용한다.

## MySQLi (Object-Oriented)
```php
$servername = "localhost";
$username = "username";
$password = "password";

// Create connection
$conn = new mysqli($servername, $username, $password);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";

// Close the connection
$conn->close();
```

## MySQLi (Procedural)
```php
$servername = "localhost";
$username = "username";
$password = "password";

// Create connection
$conn = mysqli_connect($servername, $username, $password);

// Check connection
if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
}
echo "Connected successfully";

// Close the connection
mysqli_close($conn);
```

## PDO(PHP Data Object)
**PDO**: PHP에서 DB에 접속할 때 사용하는 Framework이다.  

```php
$servername = "localhost";
$username = "username";
$password = "password";

try {
  $conn = new PDO("mysql:host=$servername;dbname=myDB", $username, $password);
  // set the PDO error mode to exception
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  echo "Connected successfully";
} catch(PDOException $e) {
  echo "Connection failed: " . $e->getMessage();
}

// Close the connection
$conn = null;
```

# Q. WAS 내부 코드에는 DB에 접속하기 위한 ID와 PW가 있는데 암호화할 수 없는 것일까?
**참고 사이트 3줄 요약**
1. httpd.conf 파일 혹은 가상 호스트 파일에 넣어라.
2. 웹 루트 밖으로 옮기고 파일 자체를 암호화해라.
3. DB PW를 암호화하면 매번 복호화를 해야 하므로 CPU 시간 낭비일 뿐이다.

# 참고
* [PHP Connect to MySQL](https://www.w3schools.com/php/php_mysql_connect.asp)
* [What is PDO?](https://www.simplilearn.com/tutorials/php-tutorial/pdo-in-php)
* [How to encrypt database connection credentials on a web server?](https://security.stackexchange.com/questions/22817/how-to-encrypt-database-connection-credentials-on-a-web-server)