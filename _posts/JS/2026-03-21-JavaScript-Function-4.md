---
layout: post
comments: true
sitemap:

title: "[JS] 함수(Function) 4"
excerpt: "함수의 실행 원리"

date: 2026-03-21
last_modified_at: 2026-03-21

categories: [JS]
tags: [WEB, JS]
---

<!-- markdownlint-disable MD004 MD010 MD025 -->

# 함수(function)

## 목차

1. [함수 스코프와 렉시컬 환경](#1-함수-스코프와-렉시컬-환경)
1. [스코프(scope): `var`, `let`, `const`와 함수](#2-스코프scope-var-let-const와-함수)
    1. [var](#21-var)
    1. [let, const](#22-let-const)
1. [함수(function) v.s. 메서드(method)](#3-함수function-vs-메서드method)
    1. [함수](#31-함수)
    1. [메서드](#32-메서드)
1. [this](#4-this)
    1. [일반 함수 호출](#41-일반-함수-호출)
    1. [메서드 호출](#42-메서드-호출)
    1. [생성자 호출](#43-생성자-호출)
    1. [명시적 바인딩](#44-명시적-바인딩)
1. [call, apply, bind](#5-call-apply-bind)
    1. [call](#51-call)
    1. [apply](#52-apply)
    1. [bind](#53-bind)
1. [일반 함수 vs 화살표 함수](#6-일반-함수-vs-화살표-함수)
    1. [일반 함수가 적합한 경우](#61-일반-함수가-적합한-경우)
    1. [화살표 함수가 적합한 경우](#62-화살표-함수가-적합한-경우)
1. [화살표 함수의 핵심 특징](#7-화살표-함수의-핵심-특징)
    1. [this를 자체적으로 가지지 않음](#71-this를-자체적으로-가지지-않음)
    1. [생성자로 사용 불가](#72-생성자로-사용-불가)
    1. [arguments 없음](#73-arguments-없음)
1. [참고](#참고)

---

## 1. 함수 스코프와 렉시컬 환경

함수는 자신만의 스코프를 만든다.

```js
function test() {
  const x = 10;
  console.log(x);
}

test();
console.log(x); // 에러
```

`x`는 함수 내부에서만 유효하다.

JS는 **렉시컬 스코프(lexical scope)** 를 따른다. 변수 접근 범위는 **함수를 어디서 호출했는지** 가 아니라 **어디에 선언했는지**로 결정된다.

## 2. 스코프(scope): `var`, `let`, `const`와 함수

### 2.1. `var`

함수 스코프

```js
function test() {
  if (true) {
    var x = 1;
  }
  console.log(x); // 1
}
```

### 2.2. `let`, `const`

블록 스코프

```js
function test() {
  if (true) {
    let x = 1;
  }
  console.log(x); // 에러
}
```

이 차이는 함수 내부 변수 설계에 매우 중요하다.

## 3. 함수(function) v.s. 메서드(method)

### 3.1. 함수

독립적으로 존재하는 callable 값이다.

```js
function add(a, b) {
  return a + b;
}
```

### 3.2. 메서드

객체의 프로퍼티로 들어 있는 함수이다.

```js
const calculator = {
  add(a, b) {
    return a + b;
  }
};
```

여기서 `calculator.add`는 메서드다.

핵심 차이는 문법보다 **호출 문맥**이다.

```js
obj.method()
```

처럼 호출될 때, `this`가 `obj`가 됩니다.

## 4. `this`

`this`는 함수가 호출되는 방식에 따라 달라진다.

### 4.1. 일반 함수 호출

```js
function show() {
  console.log(this);
}

show();
```

엄격 모드에서는 `undefined`가 될 수 있고, 환경에 따라 전역 객체가 될 수 있다.

### 4.2. 메서드 호출

```js
const user = {
  name: "홍길동",
  show() {
    console.log(this.name);
  }
};

user.show(); // 홍길동
```

여기서 `this`는 `user`이다.

### 4.3. 생성자 호출

```js
function User(name) {
  this.name = name;
}

const u = new User("홍길동");
```

`this`는 새로 생성되는 인스턴스이다.

### 4.4. 명시적 바인딩

```js
function show() {
  console.log(this.name);
}

const user = { name: "홍길동" };

show.call(user);  // 홍길동
show.apply(user); // 홍길동
```

## 5. `call`, `apply`, `bind`

함수의 `this`를 제어하는 메서드이다.

### 5.1. `call`

인수를 하나씩 전달한다.

```js
function greet(age) {
  console.log(this.name, age);
}

const user = { name: "홍길동" };
greet.call(user, 20);
```

### 5.2. `apply`

인수를 배열 형태로 전달한다.

```js
greet.apply(user, [20]);
```

### 5.3. `bind`

즉시 실행하지 않고, `this`가 고정된 새 함수를 반환한다.

```js
const bound = greet.bind(user);
bound(20);
```

## 6. 일반 함수 vs 화살표 함수

### 6.1. 일반 함수가 적합한 경우

* 객체 메서드
* 생성자
* `this`가 필요할 때
* `arguments`가 필요할 때

### 6.2. 화살표 함수가 적합한 경우

* 짧은 콜백
* 배열 메서드 콜백
* 외부 `this`를 유지해야 할 때
* 함수형 스타일 코드

## 7. 화살표 함수의 핵심 특징

화살표 함수는 짧아서 많이 쓰지만 일반 함수와 다르다.

### 7.1. `this`를 자체적으로 가지지 않음

화살표 함수의 `this`는 **외부 렉시컬 스코프의 `this`를 그대로 사용**한다.

```js
const obj = {
  name: "홍길동",
  regular() {
    console.log(this.name);
  },
  arrow: () => {
    console.log(this.name);
  }
};

obj.regular(); // 홍길동
obj.arrow();   // 보통 기대와 다름
```

그래서 객체 메서드를 화살표 함수로 정의하는 것은 보통 부적절하다.

### 7.2. 생성자로 사용 불가

```js
const User = (name) => {
  this.name = name;
};

new User("홍길동"); // 에러
```

### 7.3. `arguments` 없음

자체 `arguments`가 없다.

---

## 참고

- [MDN: 호이스팅](https://developer.mozilla.org/ko/docs/Glossary/Hoisting)
- [MDN: IIFE](https://developer.mozilla.org/ko/docs/Glossary/IIFE)
- [MDN: 함수](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Functions)
- [Velog: 함수 (Function)](https://velog.io/@surim014/%EC%9B%B9%EC%9D%84-%EC%9B%80%EC%A7%81%EC%9D%B4%EB%8A%94-%EA%B7%BC%EC%9C%A1-JavaScript%EB%9E%80-%EB%AC%B4%EC%97%87%EC%9D%B8%EA%B0%80-part-6-Function)
- [Tistory: [JavaScript (6)] Javascript 함수(함수 기본, 재귀함수, 호이스팅 등)](https://goddaehee.tistory.com/228)
