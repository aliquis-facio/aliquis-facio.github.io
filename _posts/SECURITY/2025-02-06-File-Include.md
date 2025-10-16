---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[WEB HACKING] File Include 취약점"
excerpt: "모의해킹 취업반 스터디 7기 15주차"

date: 2025-02-06
last_modified_at: 

categories: [SECURITY]
tags: [TIL, WEB, SECURITY]
---

# File Include
WEB PAGE 파라미터의 값에 따라서, 다른 페이지를 보여준다
?lang=ko.php

<?php
    include($_GET['lang']);
?>

서버에 존재하는 임의의 파일을 가져올 수 있다
-> DB 계정이 적혀있는 파일
-> login.php

file include 취약점으로는 소스코드를 가져올 수 없다
소스코드를 실행해서 주기 때문에 내부 코드 확인할 수 없다

소스코드를 가져올 수 없기 때문에 취약점이 된다구요?

파일확장명이 jpg임에도 불구하고 웹서버에서 include하면서 파일을 실행시키기 때문에 실행 가능하다
LFI, Local File Include 취약점

파일을 올리지 않더라도 어떤 파일에 영향을 줄 수 있다
-> **웹 로그**
access log
<?php system($_GET['cmd']); ?>

file include 취약점이라는 것은 그 존재만으로 web shell을 설치할 수 있다
`https://example.com/access_log.php?cmd=ls`

# RFI, Remote File Include
외부 서버에 있는 파일
# LFI, 웹 서버 내에 있는 파일

# 참고
* [파일 삽입 취약점 (File Inclusion Vulnerability)](https://isc9511.tistory.com/109)
* [정보보안 스터디 - 10주차 1일 - 파일 include, 파일 다운로드 취약점](https://wonder12.tistory.com/92)
* [File Include / File Download [15주차]](https://canbehacker.tistory.com/30)
* [LFI](https://securitynote.tistory.com/31)
* [LFI, RFI 취약점 설명 및 실습](https://mokpo.tistory.com/388)
* [다운로드_DOWNLOAD_파일경로감추기](https://www.zetswing.com/bbs/board.php?bo_table=php_tip&wr_id=67&page=0&page=0)
* [[보안] [파일/다운로드] 경로 숨기기에 관한 짧은 생각](https://www.phpschool.com/gnuboard4/bbs/board.php?bo_table=tipntech&wr_id=26832)
* []()
* []()