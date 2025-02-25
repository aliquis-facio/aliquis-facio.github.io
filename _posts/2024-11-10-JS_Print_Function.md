---
layout: post
comments: true
sitemap:
    changefreq: daily
    priority: 0.5

title: "[JS] 출력"
excerpt: "모의해킹 취업반 스터디 7기 4주차"

date: 2024-11-10
last_modified_at: 

tags: [JS]
---

# 출력
## 1. document.getElementById().innerHTML
```html
<body>
    <p id="test"></p>
    <script>
        //id로 html요소(elem) 접근
        let elem = document.getElementById("test");
        // elem의 innerHTML 속성을 통해 내용 적용
        elem.innerHTML = "10" + 1;
    </script>
</body>
```
<img src = "https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-10-1.png?raw=true">

## 2. console.log()
```html
<body>
	<script type="text/javascript">
	    console.log("Hello, World!");
	</script>
</body>
```

`F12 - 개발자도구 - 콘솔`에서만 확인이 가능하다
<img src = "https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-10-2.png?raw=true">

## 3. document.write()
```js
document.write("Hello, World!<br>");
document.write("Hello, World!");
```
<img src = "https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-10-3.png?raw=true">

## 4. alert()
주로 화면에 경고창을 띄울 때 사용한다. 다른 코드들 보다 가장 먼저 실행한다.

```js
document.write("Hello, 911<br>");
document.write("Hello, 119");
alert("It's OK?");
```
<img src = "https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-10-4.gif?raw=true">

## 5. prompt()
사용자가 텍스트를 입력할 수 있도록 안내하는 선택적 메세지를 갖고 있는 대화 상자를 띄운다.
다른 코드들 보다 가장 먼저 실행한다.
```js
document.write("Hello<br>");
document.write("Hi");
prompt("I'm not OK");
```
<img src = "https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-10-5.gif?raw=true">

## 6. confirm()
확인과 취소 두 버튼을 가지며 메시지를 지정할 수 있는 모달 대화 상자를 띄운다.
다른 코드들 보다 가장 먼저 실행한다.
```js
document.write("ABC<br>");
document.write("DEF");
confirm("ALPHABET");
```
<img src = "https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-10-6.gif?raw=true">

# 참고
* [JS 출력 방법 4가지](https://jinnnkcoding.tistory.com/140)
* [JS prompt](https://developer.mozilla.org/ko/docs/Web/API/Window/prompt)
* [JS confirm](https://developer.mozilla.org/ko/docs/Web/API/Window/confirm)