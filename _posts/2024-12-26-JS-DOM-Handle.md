---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[JS] JS로 DOM 객체 접근하기"
excerpt: "모의해킹 취업반 스터디 7기 11주차"

date: 2024-12-26
last_modified_at: 2024-12-27

categories: [WEB]
tags: [TIL, WEB, JS]
---

# 목차
* [1. DOM이란?](#1-domdocument-object-model이란)
* [2. DOM 접근 Method](#2-dom-접근-method)
* [3. DOM 요소 접근 속성](#3-요소-접근-속성)
* [4. document.write()](#4-documentwrite)
* [5. DOM 로딩 확인 후 객체 접근하기](#5-dom-로딩-확인하고-객체-접근하기)
* [6. iframe tag 이용하기](#6-iframe-tag-이용하기)

# JS로 DOM 객체 접근하기
~~크롤링, 파싱이랑 비슷하다고 생각한다~~

## 1. DOM(Document Object Model)이란?
Document Object Model을 우리말로 풀이하면 <mark>문서 객체 모델</mark>이다.  
즉 DOM은 웹 페이지(HTML이나 XML 문서)의 콘텐츠 및 구조, 그리고 스타일 요소를 구조화시켜 표현하여  
<mark>프로그래밍 언어가 해당 문서에 접근하여 읽고 조작할 수 있도록 API를 제공</mark>하는 일종의 인터페이스이다.

## 2. DOM 접근 Method
<table>
    <thead>
        <tr>
            <td>Method</td>
            <td>설명</td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>document.getElementById(id)</td>
            <td>해당 id를 가진 요소 하나를 반환한다</td>
        </tr>
        <tr>
            <td>document.querySelector(CSS Selector)</td>
            <td>해당 선택자를 만족하는 요소 하나를 반환한다</td>
        </tr>
        <tr>
            <td>document.getElementsByClassName(class)</td>
            <td>해당 class명을 가진 요소들을 배열로 반환한다</td>
        </tr>
        <tr>
            <td>document.getElementsByTagName(tag)</td>
            <td>해당 태그명을 가진 요소들을 배열로 반환한다</td>
        </tr>
        <tr>
            <td>document.querySelectorAll(CSS Selector)</td>
            <td>해당 선택자를 만족하는 요소들을 배열로 반환한다</td>
        </tr>
    </tbody>
</table>

### Example Code
```html
<!-- html -->
<div class="big">
    <input id="userInput" class="big" type="text" placeholder="Enter">
<div>
```

```js
// js
let elem;

elem = document.getElementById('userInput');
elem = document.querySelector('#userInput');

elem = document.getElementsByClassName('big')[0];
elem = document.getElementsByTagName('input')[0];
elem = document.querySelectorAll('.big')[1];
```

## 3. DOM 요소 접근 속성
<table>
    <thead>
        <tr>
            <td>Attribute</td>
            <td>설명</td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>element.innerHTML</td>
            <td>해당 요소를 다른 HTML요소로 변경할 수 있는 속성이다.</td>
        </tr>
        <tr>
            <td>element.style.property</td>
            <td>해당 요소에 적용된 css속성의 값을 나타낸다.</td>
        </tr>
        <tr>
            <td>element.attribute</td>
            <td>해당 요소의 속성을 나타낸다.</td>
        </tr>
    </tbody>
</table>

### Example Code
```html
<!-- html -->
<div>
    <button type='button'>BUTTON</button>
</div>
```

```css
/* css */
button {
    display: block;
    background-color: red;
    width: 300px;
    height: 300px;
}
```

```js
// js
let btn = document.getElementsByTagName('button')[0];

btn.style.display = 'none';
btn.style.width = '100px';

btn.type = 'submit';
```

## 4. document.write()
1. HTML에서 텍스트를 바로 출력하기  
```html
<script>
    document.write("Hello World!");
</script>
```

2. HTML에서 HTML 요소를 바로 출력하기  
<img src="https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-12-27-1.png?raw=true" title="pre tag가 일을 안 해요">

**DOM이 로딩된 이후 document.write()를 사용할 경우 HTML 요소가 전부 지워짐**

## 5. DOM 로딩 확인하고 객체 접근하기
브라우저에서 DOM 로딩 순서는 head -> body 순서이다.  
이 때 <mark>body가 로드되기 전에는 body 내에 선언된 요소들에 접근할 수 없다.</mark>  
이벤트를 추가해 모든 요소가 전부 로드되었을 때 코드가 실행되도록 해야 한다.  

```js
window.addEventListener('DOMContentLoaded',
    function foo() {
        // 실행 코드
        document.querySelectorAll('div');
    });
```

```js
document.onload = function foo() {
    // 실행 코드
    document.querySelectorAll('div');
}
```

## 6. iframe tag 이용하기
### iframe이란
iframe = inline frame이다.  
<mark>HTML 문서 내부에 또다른 HTML 문서를 넣을 때 사용</mark>한다.  

```html
<iframe src="url" title="description"></iframe>
```

### iframe 내부 객체 접근하기
```html
<!-- html -->
<iframe src="http://~/mypage.php" id="targetFrame">
</iframe>
```

```js
// js
let iframeDoc = document.querySelector('iframe').contentDocument;
iframeDoc.body.style.background = "blue";
iframeDoc.document.getElementById('');
```

# 참고
* [문서 객체 모델(DOM)](https://developer.mozilla.org/ko/docs/Web/API/Document_Object_Model)
* [문서 객체 모델 DOM 과 자바스크립트 JavaScriptㅣ생성 방식 및 접근 방법](https://www.codestates.com/blog/content/dom-javascript)
* [[웹 개발 기초 자바스크립트] 7. DOM이란?](https://velog.io/@hyhy9501/%EC%9B%B9-%EA%B0%9C%EB%B0%9C-%EA%B8%B0%EC%B4%88-%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-7.-DOM%EC%9D%B4%EB%9E%80)
* [[JavaScript] 자바스크립트로 DOM 접근하기](https://lifejusik1004.tistory.com/entry/JavaScript-%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%EB%A1%9C-DOM-%EC%A0%91%EA%B7%BC%ED%95%98%EA%B8%B0)
* [EventTarget: addEventListener() method](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
* [dom트리 <script></script> 순서 질문입니다.](https://www.codeit.kr/community/questions/UXVlc3Rpb246NjEwN2Y2MTAzYjQ4NzM0MGYwZjM2NTAz)
* [What's the difference between HTML <head> and <body> tags?](https://stackoverflow.com/questions/6303490/whats-the-difference-between-html-head-and-body-tags)
* [[JavaScript] JavaScript 문서 로딩 순서](https://creative103.tistory.com/45)
* [HTML DOM Document write()](https://www.w3schools.com/jsref/met_doc_write.asp)
* [HTMLIFrameElement: contentDocument property](https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement/contentDocument)
* [[JS] iframe 내부 접근](https://velog.io/@sjc0829/JS-iframe-%EB%82%B4%EB%B6%80-%EC%A0%91%EA%B7%BC)