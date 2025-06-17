---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[WEB HACKING] File Upload 취약점"
excerpt: "모의해킹 취업반 스터디 7기 14주차"

date: 2025-01-27
last_modified_at: 

categories: [SECURITY]
tags: [TIL, WEB, SECURITY]
---

# File Upload 취약점

## 정의
공격자가 원하는 임의의 파일을 서버측에 업로드할 수 있는 취약점이다.
주로 Web Shell을 올려 공격: 서버 측에서 실행 가능한 파일을 업로드할 수 있는 공격

Web Shell: 악의적인 스크립트

## 발생 원인
서버측에서 파일을 업로드 받을 때 파일에 대한 검증, 검사가 부족할 경우 발생할 수 있다.

## 발생 위치
파일을 업로드할 수 있는 곳

## 공격 시나리오
* 서버 측 실행 파일 업로드
    -> 서버에서 우리가 원하는 코드를 실행할 수 있다
    -> 우리가 서버에게 원하는 명령을 내릴 수 있다
    -> 서버를 장악할 수 이싿
* HTML 파일 업로드 -> Phising
* Deface 공격
    -> index 파일 (덮어쓰기)
* XSS
    -> Stored XSS
* DoS

### 서버 측 실행 파일 -> Web Shell
* One Line Web Shell
```php
<?php
    echo system($_GET['cmd']);
?>
```
-> 'cmd' 파라미터를 넣어줘야 함
ex) example.com?cmd=''

* reverse shell
웹요청을 통해 실행시킨다 -> 업로드한 파일의 정확한 경로를 알아야 한다
파일 확장명은 그대로 가져가고 파일명만 랜덤한 값으로 변경해 webshell을 올려도 정확한 경로를 파악하기 어렵게 만들어 실행시키는 것을 저지할 수 있다. 이런 경우 sql injection 등의 취약점을 이용해 파일의 정확한 이름을 파악하여 경로를 확인해야 한다.

### 웹쉘 공격의 핵심
1. 웹 서버 측 실행 코드를 업로드
2. 업로드 된 파일의 경로
    -> 업로드 한 파일이 출력되는 곳을 확인한다
    -> 업로드 한 파일의 경로를 알아야 요청을 하고 실행할 수 있다

파일 업로드 공격 =- 웹쉘 공격

astx(AhnLab Safe Transaction) -> e2e(End to End)
리버싱 기본은 해야 한다

## 대응
* 업로드 되는 파일을 검사하자, 제한하기
MIME types (Multipurpose Internet Mail Extensions)
Content-Type: text/php
content type 변조

* 실행X
/files/avatars/~~~
특정 폴더 파일들의 실행 권한 제거
-> 파일 이름의 '../' 붙이기

* php 확장자 금지
-> PhP, pHp, pHP 등으로 파일명 변경
-> .phtml, .php3, .php5
-> .jsp, .jpsx, .jsw

-> hex editor
<? php system($_GET['cmd']); ?>

파일 시그니처: jpeg, png, pdf ...

* 서버 측 실행 코드 업로드
-> 서버에서 실행하기 위해서
-> 서버에서 실행할 수 있도록 업로드
webshell.php

파일 업로드 취약점을 찾을 때 주의할 점
모의해킹을 할 때 주의할 점
웹쉘 올리면 안 됨
테스트할 때, 웹쉘을 올리는 이유
-> 업로드한 파일을 실행할 수 있는 지 체크
-> 협의
-> 웹쉘 테스트 후, 바로 삭제
-> 삭제 요청 -> 체크

.htaccess
-> .png, .XXX

LFI

1. 파일 이름으로 확인하는 지
    1. 파일 이름의 확장자를 이용해 검증하고 있는 지
    2. 
2. content-type으로 확인하는 지
3. 서버에 파일이 올라갔는 지 확인하기

## Image Web Shell
### 1. webshell.php.jpg
어떻게 실행될까? -> X 실행 안 됨
서버측에서 파일확장자를 변경해야 하지 않을까?
웹 설정 파일 -> 서버에서 실행할 확장자를 설정할 수 있다
ex) .htaccess(apachi 웹 설정 파일)
`AddType application/x-httpd-php .extension`

file upload bypass
* null byte injection
`webshell.php%00.jpg`은 가능
%00 이후로 문자열이 잘려서 저장됨

double extension (이중확장자)
-> webshell.jpg.php
케이스: 웹 애플리케이션 개발할 때
-> 파일 업로드, 저장하는 기능을 구현할 때
.을 기준으로 split을 해서 첫 번째 확장자만 검증할 때

# 대응 방안
1. 파일 이름 난독화: 파일 경로를 감추는 전략
-> sql injection으로 공격당할 수 있음
2. 확장자 화이트 리스트 기반 필터링
3. DB에 파일을 저장하는 방법
-> BLOB / CLOB
4. nas 서버: 파일 저장 서버

# 참고
* [What Is a Web Shell?](https://www.imperva.com/learn/application-security/web-shell/)
* [왕초보를 위한 용어 풀이, 디페이스(Deface) 공격이란?](https://m.boannews.com/html/detail.html?idx=55936)
* [디페이스 공격이란?](https://m.blog.naver.com/lhi5693/221347344931)
* [What Is a Reverse Shell?](https://www.imperva.com/learn/application-security/reverse-shell/)
* [MIME types (IANA media types)](https://developer.mozilla.org/en-US/docs/Web/HTTP/MIME_types)
* [Content Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type)
* [헥스에디터 ( Hex Editor 핵사 에디터 ) 의 사용법](https://blog.naver.com/PostView.nhn?blogId=kjg5345&logNo=150098304449)
* [Apache HTTP Server Tutorial: .htaccess files](https://httpd.apache.org/docs/2.4/en/howto/htaccess.html)