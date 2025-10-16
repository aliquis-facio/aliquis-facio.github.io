---
layout: post
comments: true
sitemap:
    changefreq: daily
    priority: 0.5

title: "[PHP] PHP Import"
excerpt: "모의해킹 취업반 스터디 7기 2주차"

date: 2024-10-23
last_modified_at: 2025-02-25

tags: [WEB, TIL]
---

# 외부 PHP 코드 import 하기
외부 php import 하기

```php
require_once('login_func.php');

function login1($userid, $userpass) {
    $crew_id = "admin";
    $crew_ps = "admin1234";

    if ($userid == $crew_id and $userpass == $crew_ps) {
        return $userid;
    }
    else return 0;
}
```