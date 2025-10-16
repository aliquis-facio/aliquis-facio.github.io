---
layout: post
comments: true
sitemap:
    changefreq: daily
    priority: 0.5

title: "[PHP] PHP Redirect"
excerpt: "모의해킹 취업반 스터디 7기 2주차"

date: 2024-10-23
last_modified_at: 2024-11-01

tags: [WEB, TIL]
---

# PHP Redirect
우선순위: html > php
<?php
    if($_GET['login_id'] == "") {
        header("location: login.php");
        exit;
    }
?>
php header 코드 확인하기
응답헤더 login.php로 리다이렉트
3XX 코드
exit를 해야 코드가 노출 되지 않는다

302found
redirect는 되지만 html 코드가 다 보임
노출되면?