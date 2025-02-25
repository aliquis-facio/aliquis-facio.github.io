---
layout: post
title: "[PHP] ->와 => 연산자"
date: 2024-11-03
last_modified_at: 2024-11-08
excerpt: "모의해킹 취업반 스터디 7기 3주차"
tags: [WEB, PHP]
comments: true
---

# -> 와 => 연산자
## -> 연산자
Object 연산자 `->`: Object 범위에서 객체의 메서드 및 속성에 엑세스할 때 사용  
A -> B일 때, A 객체의 구성원인 B에 접근한다

```php
class test {
    public $name = "";

    function set_name($name) {
        $this->name = $name;
        return $this;
    }

    function get_name() {
        echo $this->name;
    }
}


$obj = new test();
$obj -> name = "Hong Gildong";
$obj -> get_name();
```

## `=>` 연산자
`=>`: 배열의 키, 값을 할당할 때 사용한다

```php
$arr = array(
    "A" => 1,
    "B" => 2,
    "C" => 3,
    "D" => 4
    );
```

# 참고
1. [-> 연산자 의미](https://blog.naver.com/pjh445/222140371310)
2. [-> 와 =>의 차이점](https://withhsunny.tistory.com/63)
3. [PHP Manual](https://www.php.net/manual/en/language.types.object.php)