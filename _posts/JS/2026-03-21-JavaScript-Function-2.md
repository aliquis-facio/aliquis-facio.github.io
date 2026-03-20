---
layout: post
comments: true
sitemap:

title: "[JS] 함수(Function) 2"
excerpt: "함수를 만드는 방법"

date: 2026-03-21
last_modified_at: 2026-03-21

categories: [JS]
tags: [WEB, JS]
---

<!-- markdownlint-disable MD004 MD010 MD025 -->

# 함수(function)

## 목차

1. [선언 방식](#1-선언-방식)
    1. [함수 선언문](#11-함수-선언문)
    2. [함수 표현식](#12-함수-표현식)
    3. [화살표 함수](#13-화살표-함수)
    4. [메서드 축약 문법](#14-메서드-축약-문법)
    5. [생성자 함수](#15-생성자-함수)
2. [호이스팅(hoisting)](#2-호이스팅hoisting)
    1. [함수 선언문](#21-함수-선언문)
    2. [함수 표현식](#22-함수-표현식)
3. [참고](#참고)

---

## 1. 선언 방식

JS에서는 함수를 여러 방식으로 만들 수 있다.

### 1.1. 함수 선언문

```js
function greet(name) {
  return `Hello, ${name}`;
}
```

특징:

* 가장 전통적인 방식이다.
* 이름이 반드시 있다.
* [호이스팅](#2-호이스팅hoisting)의 영향을 받는다.

예:

```js
console.log(greet("홍길동"));

function greet(name) {
  return `Hello, ${name}`;
}
```

### 1.2. 함수 표현식

```js
const greet = function(name) {
  return `Hello, ${name}`;
};
```

특징:

* 함수를 값처럼 변수에 저장한다.
* 익명 함수 또는 기명 함수 사용 가능하다.
* 선언문과 달리 변수 초기화 전에는 사용 불가하다.

예:

```js
const add = function(a, b) {
  return a + b;
};
```

### 1.3. 화살표 함수

```js
const add = (a, b) => a + b;
```

특징:

* 짧게 쓸 수 있다.
* `this`, `arguments`, `super`, `new.target` 바인딩 방식이 일반 함수와 다르다. → <font color="#ff0000">어떻게 다른데?</font>
* 생성자로 사용할 수 없다.

예:

```js
const square = x => x * x;
const sum = (a, b) => a + b;
const hello = () => "hi";
```

본문이 여러 줄이면 중괄호와 `return`이 필요하다.

```js
const add = (a, b) => {
  const result = a + b;
  return result;
};
```

### 1.4. 메서드 축약 문법

객체 안에서 이렇게 쓸 수 있다.

```js
const user = {
  name: "홍길동",
  sayHi() {
    return `Hi, I'm ${this.name}`;
  }
};
```

객체의 메서드를 정의할 때 자주 쓴다.

### 1.5. 생성자 함수

```js
function User(name) {
  this.name = name;
}
```

`new`와 함께 호출한다.

```js
const u = new User("홍길동");
console.log(u.name); // 홍길동
```

## 2. 호이스팅(hoisting)

**호이스팅(hoisting)**: 인터프리터가 코드를 실행하기 전에 함수, 변수, 클래스 또는 임포트(import)의 선언문을 해당 범위의 맨 위로 끌어올리는 것처럼 보이는 현상을 뜻한다.

### 2.1. 함수 선언문

호이스팅되었을 때

```js
sayHi();

function sayHi() {
  console.log("hi");
}
```

### 2.2. 함수 표현식

변수 선언만 호이스팅되고, 함수 값 할당은 나중에 되었을 때

```js
sayHi(); // 에러 가능

const sayHi = function() {
  console.log("hi");
};
```

---

## 참고

- [MDN: 함수](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Functions)
- [Velog: 함수 (Function)](https://velog.io/@surim014/%EC%9B%B9%EC%9D%84-%EC%9B%80%EC%A7%81%EC%9D%B4%EB%8A%94-%EA%B7%BC%EC%9C%A1-JavaScript%EB%9E%80-%EB%AC%B4%EC%97%87%EC%9D%B8%EA%B0%80-part-6-Function)
- [Tistory: [JavaScript (6)] Javascript 함수(함수 기본, 재귀함수, 호이스팅 등)](https://goddaehee.tistory.com/228)
