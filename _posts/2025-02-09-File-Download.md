---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[WEB HACKING] File Download 취약점"
excerpt: "모의해킹 취업반 스터디 7기 15주차"

date: 2025-02-09
last_modified_at: 2025-02-12

categories: [SECURITY]
tags: [TIL, WEB, SECURITY]
---

# 파일 다운로드 취약점
서버에서 임의의 파일을 다운로드할 수 있는 취약점
* 파일 다운로드 스크립트의 파일 다운로드를 처리하는 함수에 사용되는 파라미터(파일명, 파일 경로)가 노출되었을 경우

download.php?filename=test.txt

<?php
    $filename = $_GET['filename'];

    download(path . $filename);
?>

장점: 소스코드 다운로드 가능
단점: 소스코드 실행 X

파일 다운로드 취약점을 발견했다?
1. 소스코드 찾기

다운로드 해야 하는 파일
/ect/passwd
/boot.ini
/winnt/win.ini

## 왜 위험한가?
* 소스코드를 다운로드 받아서 디컴파일을 하면 새로운 취약점을 발견할 수 있다
* DB 파일을 다운 받을 수 있다
* 서버의 인프라 정보를 다운 받을 수 있다

리버싱 개념
자바스크립트 난독화
온라인 사이트
난독화 툴
oscp

## 대응방안
* DB를 이용해 파일을 관리한다
* NAS를 이용해 파일 서버를 따로 관리한다
* 파일 확장자 검증, 사용자의 입력값 검증 (우선순위가 떨어짐)
