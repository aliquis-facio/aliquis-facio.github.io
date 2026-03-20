---
layout: post
comments: true
sitemap:

title: "[JS] 함수(Function) 5"
excerpt: "함수의 심화 문법과 설계"

date: 2026-03-21
last_modified_at: 2026-03-21

categories: [JS]
tags: [WEB, JS]
---

<!-- markdownlint-disable MD004 MD010 MD025 -->

# 함수(function)

## 목차

1. [매개변수 관련 핵심 문법](#1-매개변수-관련-핵심-문법)
	1. [기본값](#11-기본값)
	2. [나머지 매개변수(rest parameter)](#12-나머지-매개변수rest-parameter)
	3. [구조 분해 매개변수](#13-구조-분해-매개변수)
2. [arguments](#2-arguments)
3. [재귀 함수](#3-재귀-함수)
4. [즉시 실행 함수(IIFE, Immediately Invoked Function Expression)](#4-즉시-실행-함수iife-immediately-invoked-function-expression)
5. [비동기 함수와 `async/await`](#5-비동기-함수와-asyncawait)
6. [예외 처리와 함수](#6-예외-처리와-함수)
7. [생성자 함수와 `new`](#7-생성자-함수와-new)
8. [`prototype`](#8-prototype)
9. [순수 함수와 부수 효과](#9-순수-함수와-부수-효과)
	1. [순수 함수](#91-순수-함수)
	2. [부수 효과가 있는 함수](#92-부수-효과가-있는-함수)
10. [참고](#참고)

---

## 1. 매개변수 관련 핵심 문법

### 1.1. 기본값

```js
function greet(name = "Guest") {
  return `Hello, ${name}`;
}
```

```js
greet(); // Hello, Guest
```

### 1.2. 나머지 매개변수(rest parameter)

```js
function sum(...numbers) {
  return numbers.reduce((acc, cur) => acc + cur, 0);
}
```

```js
sum(1, 2, 3, 4); // 10
```

`...numbers`는 여러 인수를 배열로 받습니다.

### 1.3. 구조 분해 매개변수

```js
function printUser({ name, age }) {
  console.log(name, age);
}
```

```js
printUser({ name: "홍길동", age: 20 });
```

배열도 가능하다.

```js
function first([a, b]) {
  return a;
}
```

## 2. arguments

일반 함수에서는 `arguments`라는 유사 배열 객체를 사용할 수 있다.

```js
function showArgs() {
  console.log(arguments);
}

showArgs(1, 2, 3);
```

하지만 현대 JS에서는 보통 `...rest`를 더 권장한다.

```js
function showArgs(...args) {
  console.log(args);
}
```

화살표 함수에는 자체 `arguments`가 없다.

## 3. 재귀 함수

함수가 자기 자신을 호출하는 방식이다.

```js
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}
```

```js
console.log(factorial(5)); // 120
```

주의:

* 종료 조건이 반드시 필요하다.
* 너무 깊으면 스택 오버플로우가 발생한다.

## 4. 즉시 실행 함수(IIFE, Immediately Invoked Function Expression)

예전 코드에서 많이 보인다.

```js
(function() {
  console.log("즉시 실행");
})();
```

또는

```js
(() => {
  console.log("즉시 실행");
})();
```

용도:

* 스코프 격리
* 변수 오염 방지

현대에는 모듈 시스템이 생겨 예전보다 덜 쓰지만 여전히 볼 수 있다.

## 5. 비동기 함수와 `async/await`

JS 함수는 비동기 처리와 강하게 연결된다.

```js
async function fetchUser() {
  const response = await fetch("/user");
  const data = await response.json();
  return data;
}
```

`async` 함수는 항상 Promise를 반환한다.

```js
async function hello() {
  return "hi";
}
```

이건 실제로는:

```js
Promise.resolve("hi")
```

와 유사하다.

## 6. 예외 처리와 함수

함수 내부에서 예외를 던질 수 있다.

```js
function divide(a, b) {
  if (b === 0) {
    throw new Error("0으로 나눌 수 없음");
  }
  return a / b;
}
```

호출 측에서 처리:

```js
try {
  console.log(divide(10, 0));
} catch (err) {
  console.error(err.message);
}
```

## 7. 생성자 함수와 `new`

함수는 생성자로도 사용될 수 있다.

```js
function Person(name) {
  this.name = name;
}
```

```js
const p = new Person("홍길동");
console.log(p.name);
```

`new`와 함께 호출하면 대략 이런 일이 일어난다.

1. 빈 객체 생성
2. 그 객체의 프로토타입을 `Person.prototype`에 연결
3. `this`를 그 새 객체로 설정
4. 함수 실행
5. 특별한 객체를 명시적으로 반환하지 않으면 새 객체 반환

## 8. `prototype`

모든 일반 함수는 `prototype` 프로퍼티를 가진다.

```js
function Person(name) {
  this.name = name;
}

Person.prototype.sayHi = function() {
  return `Hi, I'm ${this.name}`;
};
```

```js
const p = new Person("홍길동");
console.log(p.sayHi());
```

이 구조가 JS의 프로토타입 기반 상속의 핵심이다.

주의:

* 함수 객체의 `__proto__`
* 함수의 `prototype`
* 인스턴스의 `__proto__`

이 셋은 서로 다른 개념이다.

## 9. 순수 함수와 부수 효과

### 9.1. 순수 함수

같은 입력이면 항상 같은 출력을 내보내고 외부 상태를 변경하지 않는다.

```js
function add(a, b) {
  return a + b;
}
```

### 9.2. 부수 효과가 있는 함수

외부 상태를 변경하고, 로그 출력, 네트워크 요청 등을 한다.

```js
function saveUser(user) {
  database.insert(user);
}
```

가능하면 핵심 로직은 순수 함수에 가깝게 만드는 것이 테스트와 유지보수에 유리하다.

---

## 참고

- [MDN: IIFE](https://developer.mozilla.org/ko/docs/Glossary/IIFE)
- [MDN: 함수](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Functions)
- [Velog: 함수 (Function)](https://velog.io/@surim014/%EC%9B%B9%EC%9D%84-%EC%9B%80%EC%A7%81%EC%9D%B4%EB%8A%94-%EA%B7%BC%EC%9C%A1-JavaScript%EB%9E%80-%EB%AC%B4%EC%97%87%EC%9D%B8%EA%B0%80-part-6-Function)
- [Tistory: [JavaScript (6)] Javascript 함수(함수 기본, 재귀함수, 호이스팅 등)](https://goddaehee.tistory.com/228)
