---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[PHP] DateTime to String"
excerpt: "모의해킹 취업반 스터디 7기 4주차"

date: 2024-11-13
last_modified_at: 2024-11-22

categories: [WEB]
tags: [WEB, PHP]
---

# 회고
게시판 웹사이트를 만들면서 글 작성 날짜를 DB에 넣어줘야 했다.

# DateTime
```php
$date = new DateTime();
$string = $date->format()
```

# DateTime to String
```php
$date = new DateTime('2000-01-01 00:00:00');
$string = $date->format('Y-m-d H:i:s');
// 2000-01-01 00:00:00
```

### Date Format
* d: 1글자인 경우 앞에 0이 붙는 일
* D: 영문 3글자로 표시하는 요일
* j: 앞에 0이 붙지 않는 일
* l: 영문으로 표시하는 요일
* w: 요일 숫자값으로 월요일(1) ~ 일요일(7)
* z: 올해 몇번째 날짜인지 표시 (0부터 시작)
* W: 올해 몇번째 주인지 표시
* F: 영문으로 표시하는 월
* m: 1글자인 경우 앞에 0이 붙는 월
* M: 영문 3글자로 표시하는 월
* n: 앞에 0이 붙지 않는 월
* t: 해당 월의 마지막 날
* L: 윤년인 경우 1 윤년이 아닌 경우 0을 리턴
* Y: 연도를 4글자로 표현
* y: 연도를 2글자로 표현
* a: 오전인 경우 am을 오후인 경우 pm을 리턴
* A: 오전인 경우 AM을 오후인 경우 PM을 리턴
* g: 시간을 1에서 12까지로 표현
* G: 시간을 0에서 23까지로 표현
* h: 시간을 01에서 12까지로 표현
* H: 시간을 00에서 23까지로 표현
* i: 분을 00에서 59까지로 표현
* s: 초를 00에서 59까지로 표현

# 참고
* [PHP Convert DateTime to String](https://stackoverflow.com/questions/10569053/convert-datetime-to-string-php)
* [PHP Manual - DateTime class](https://www.php.net/manual/en/class.datetime.php)
* [PHP date format](https://blog.naver.com/diceworld/220256080804)
* [PHP Manual - DateTime format](https://www.php.net/manual/en/datetime.format.php)