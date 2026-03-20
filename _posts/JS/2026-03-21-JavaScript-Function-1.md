---
layout: post
comments: true
sitemap:

title: "[JS] 함수(Function) 1"
excerpt: "함수란 무엇인가"

date: 2026-03-21
last_modified_at: 2026-03-21

categories: [JS]
tags: [WEB, JS]
---

<!-- markdownlint-disable MD004 MD010 MD025 -->

# 함수(function)

## 목차

1. [정의](#1-정의)
1. [사용 이유](#2-사용-이유)
1. [구성](#3-구성)
1. [입력: 매개변수와 인수](#4-입력-매개변수와-인수)
	1. [매개변수(parameter)](#41-매개변수parameter)
	1. [인수(argument)](#42-인수argument)
1. [출력: 반환값(return)](#5-출력-반환값return)
1. [참고](#참고)

---

## 1. 정의

**함수(function)**란?

* 특정 작업을 수행하는 **실행 단위**
* 값을 입력받아 결과를 돌려주는 **변환 도구**
* 다른 곳에 전달할 수 있는 **값**
* 프로퍼티를 가질 수 있는 **객체**
* 메서드, 생성자, 콜백, 클로저의 기반

즉 JS에서 함수는 **실행 가능한 객체**이다.

## 2. 사용 이유

- **재사용**: 같은 코드를 여러 번 쓰지 않기 위해
- **추상화**: 복잡한 동작에 이름을 붙여 의미를 부여하기 위해
- **분리**: 큰 프로그램을 작은 단위로 쪼개기 위해
- **테스트 용이성**: 입력과 출력을 기준으로 검증하기 위해

## 3. 구성

1. **함수명**
	- 함수명은 함수 내부 코드에서 자신을 재귀적으로 호출하거나 JS 디버거가 해당 함수를 구분하는 식별자로 사용한다.
	- 함수명은 선택사항으로, 함수명이 없는 함수는 익명 함수라 한다.
2. **매개변수(parameter)**
	- 함수의 정의에서 전달받은 인수(arguments)를 함수 내부로 전달하기 위해 사용하는 변수이다.
	- 매개변수는 C, Java와 같은 기존 언어의 함수 매개변수 형태와 비슷하지만, 변수 타입을 기술하지 않는다.
3. **실행문**
4. **반환문**
	- 반환문은 함수의 실행을 중단하고, `return` 키워드 다음에 명시된 표현식의 값을 호출자에게 반환한다.
	- 반환시 `return` 타입의 제한은 없다.

예시:

```js
function add(a, b) {
  return a + b;
}
```

이 함수는:

* 이름: `add`
* 매개변수(parameter): `a`, `b`
* 실행문:
* 반환값(return value): `a + b`

이다.

호출은 이렇게 한다.

```js
console.log(add(2, 3)); // 5
```

## 4. 입력: 매개변수와 인수

### 4.1. 매개변수(parameter)

함수 정의 시 받는 이름

```js
function greet(name) { ... }
```

여기서 `name`

### 4.2. 인수(argument)

실제 호출할 때 넣는 값이다.

```js
greet("Alice");
```

여기서 `"Alice"`

## 5. 출력: 반환값(return)

함수는 `return`으로 값을 돌려준다.

```js
function multiply(a, b) {
  return a * b;
}
```

`return`이 없으면 기본적으로 `undefined`를 반환한다.

```js
function logHello() {
  console.log("hello");
}

console.log(logHello()); // undefined
```

---

## 참고

- [MDN: 함수](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Functions)
- [Velog: 함수 (Function)](https://velog.io/@surim014/%EC%9B%B9%EC%9D%84-%EC%9B%80%EC%A7%81%EC%9D%B4%EB%8A%94-%EA%B7%BC%EC%9C%A1-JavaScript%EB%9E%80-%EB%AC%B4%EC%97%87%EC%9D%B8%EA%B0%80-part-6-Function)
- [Tistory: [JavaScript (6)] Javascript 함수(함수 기본, 재귀함수, 호이스팅 등)](https://goddaehee.tistory.com/228)
