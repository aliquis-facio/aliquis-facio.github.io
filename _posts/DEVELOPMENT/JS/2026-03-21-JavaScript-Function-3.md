---
layout: post
comments: true
sitemap:

title: "[JS] 함수(Function) 3"
excerpt: "JS에서 함수가 특별한 이유"

date: 2026-03-21
last_modified_at: 2026-03-21

categories: [JS]
tags: [WEB, JS]
---

<!-- markdownlint-disable MD004 MD010 MD025 -->

# 함수(function)

## 목차

1. [함수는 값이다](#1-함수는-값이다)
2. [일급 객체(first-class citizen)](#2-일급-객체first-class-citizen)
3. [고차 함수(higher-order function)](#3-고차-함수higher-order-function)
4. [콜백 함수](#4-콜백-함수)
5. [클로저(closure)](#5-클로저closure)
6. [함수도 객체다](#6-함수도-객체다)
7. [함수 객체의 주요 속성](#7-함수-객체의-주요-속성)
    1. [name](#71-name)
    2. [length](#72-length)
    3. [prototype](#73-prototype)
8. [참고](#참고)

---

## 1. 함수는 값이다

JS에서 함수는 값처럼 다룰 수 있다.

```js
function sayHi() {
  return "hi";
}

const fn = sayHi;
console.log(fn()); // hi
```

즉 함수는:

* 변수에 저장 가능
* 다른 함수에 인수로 전달 가능
* 함수에서 반환 가능
* 배열/객체에 저장 가능

## 2. 일급 객체(first-class citizen)

함수가 값처럼 다뤄진다는 말은 곧 **일급 객체**라는 뜻이다.<font color="#ff0000">일급 객체가 뭔데?</font>

예:

```js
function run(fn) {
  return fn();
}

run(() => "hello");
```

함수를 다른 함수에 전달할 수 있다.

또:

```js
function makeAdder(x) {
  return function(y) {
    return x + y;
  };
}

const add5 = makeAdder(5);
console.log(add5(3)); // 8
```

함수가 함수를 반환할 수도 있다.

## 3. 고차 함수(higher-order function)

**고차 함수**: 함수를 인수로 받거나 함수를 반환하는 함수이다.

예:

```js
const numbers = [1, 2, 3];
const doubled = numbers.map(n => n * 2);
```

여기서 `map`은 고차 함수이고, `n => n * 2`는 콜백 함수이다.

대표적인 고차 함수:

* `map`
* `filter`
* `reduce`
* `forEach`
* `some`
* `every`
* `find`

## 4. 콜백 함수

**콜백 함수**: 다른 함수에 전달되어 나중에 실행되는 함수이다.

```js
setTimeout(() => {
  console.log("3초 뒤 실행");
}, 3000);
```

여기서 첫 번째 인수(`() => {console.log("3초 뒤 실행");}`)가 콜백 함수이다.

또:

```js
[1, 2, 3].forEach(n => console.log(n));
```

이때 `n => console.log(n)`도 콜백이다.

## 5. 클로저(closure)

**클로저(closure)**: 함수가 선언될 당시의 외부 변수 환경을 기억하는 것이다.

예:

```js
function makeCounter() {
  let count = 0;

  return function() {
    count += 1;
    return count;
  };
}

const counter = makeCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3
```

내부 함수는 `makeCounter` 실행이 끝난 뒤에도 `count`를 기억한다. 이게 클로저이다.

클로저 활용:

* 상태 유지
* 정보 은닉
* 함수 팩토리
* 이벤트 핸들러

## 6. 함수도 객체다

함수는 호출 가능할 뿐 아니라 객체이기도 하다.

```js
function hello() {
  return "hi";
}

hello.version = "1.0";
console.log(hello.version); // 1.0
```

즉 함수에도 프로퍼티(property)를 붙일 수 있다. <font color="#ff0000">프로퍼티가 뭔데?</font>

## 7. 함수 객체의 주요 속성

예:

```js
function add(a, b) {
  return a + b;
}
```

주요 속성:

### 7.1. `name`

```js
console.log(add.name); // add
```

### 7.2. `length`

매개변수 개수

```js
console.log(add.length); // 2
```

### 7.3. `prototype`

일반 함수는 생성자로 사용될 때 인스턴스가 참조할 프로토타입 객체를 가진다. 화살표 함수에는 일반적으로 `prototype`이 없다.

```js
console.log(add.prototype);
```

---

## 참고

- [MDN: 호이스팅](https://developer.mozilla.org/ko/docs/Glossary/Hoisting)
- [MDN: IIFE](https://developer.mozilla.org/ko/docs/Glossary/IIFE)
- [MDN: 함수](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Functions)
- [Velog: 함수 (Function)](https://velog.io/@surim014/%EC%9B%B9%EC%9D%84-%EC%9B%80%EC%A7%81%EC%9D%B4%EB%8A%94-%EA%B7%BC%EC%9C%A1-JavaScript%EB%9E%80-%EB%AC%B4%EC%97%87%EC%9D%B8%EA%B0%80-part-6-Function)
- [Tistory: [JavaScript (6)] Javascript 함수(함수 기본, 재귀함수, 호이스팅 등)](https://goddaehee.tistory.com/228)
