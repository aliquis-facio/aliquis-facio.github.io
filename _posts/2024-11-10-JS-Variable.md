---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[JS] 변수와 상수"
excerpt: "모의해킹 취업반 스터디 7기 4주차"

date: 2024-11-10
last_modified_at: 

categoreis: [WEB]
tags: [JS]
---

# 1. 변수
## 1.1. var
### 1.1.1. 범위(Scope): 변수를 사용할 수 있는 위치
* var 변수가 함수 외부에서 선언될 때의 범위는 전역이다.
* var 변수가 함수 내부에서 선언될 때의 범위는 함수 범위다.

```js
var x = 1; // 전역 범위
function foo() {
    var y = 2; // 함수 범위
}

function foo2() {
    console.log(x);
}

console.log(y); // Uncaught ReferenceError: y is not defined
```

### 1.1.2. 재선언, 업데이트 가능
```js
// 재선언 가능
var x = 1;
var x = 2;

// 업데이트 가능
var y = 3;
y = 4;
```

### 1.1.3. 호이스팅(Hoisting)
* 호이스팅(Hoisting): 변수와 함수 선언이 맨 위로 이동하는 것처럼 동작하는 특성
-> JS 엔진이 코드를 실행하기 전에 변수와 함수 선언을 메모리에 저장하는 방식 때문에 발생함.

* 이 코드를
```js
console.log(x);
var x = 1;
```

* 이렇게 해석한다
```js
var x;
console.log(x); // x is undefined
x = 1;
```
-> var는 undefined로 초기화된다.

### 1.1.4. 문제점
```js
var x = 1;
var y = 2;

if (y > 1) {
    var x = 9;
}

console.log(x); // 9
```
의도적으로 재정의하는 것이면 괜찮지만,
변수 x가 이미 정의되어 있다는 사실을 인식하지 못했을 때는 문제가 된다.

## 1.2. let
### 1.2.1. 범위(Scope)
* 블록 범위
* 블록은 {}로 바인딩된 코드 청크이다.
* 하나의 블록은 중괄호 속에서 존재하며, 중괄호 안에 있는 것은 모두 블록 범위다.

```js
let x = 4;

if (x > 3) {
    let s = "say";
    console.log(s); // "say"
}

function foo() {
    console.log(x); // 4
}

console.log(s); // Uncaught ReferenceError: s is not defined
```

* 동일한 변수가 다른 범위 내에서 정의되면 에러 발생 안 함
```js
 let x = 1;

if (true) {
    let x = 2;
    console.log(x); // 2
}

console.log(x); // 1
```
-> 서로 다른 범위를 가져서 서로 다른 변수로 취급되기 때문이다.

### 1.2.2. 재선언 불가능, 업데이트 가능
```js
// 업데이트 가능
let x = 1;
x = 2;

// 재선언 불가능
let y = 1;
let y = 2; // Uncaught SyntaxError: Identifier 'y' has already been declared
```

### 1.2.3. 호이스팅(Hoisting)
* 이 코드를
```js
console.log(x);
let x = 1;
```

* 이렇게 해석한다
```js
let x;
console.log(x); // Uncaught ReferenceError: Cannot access 'x' before initialization
x = 1;
```
-> let은 초기화되지 않는다.

# 2. 상수
## 2.1. const
### 2.1.1. 범위(Scope)
* 블록범위

```js
const x = 4;

if (x > 3) {
    const s = "say";
    console.log(s); // "say"
}

function foo() {
    console.log(x); // 4
}

console.log(s); // Uncaught ReferenceError: s is not defined
```

* 동일한 변수가 다른 범위 내에서 정의되면 에러 발생 안 함
```js
const x = 1;

if (true) {
    const x = 2;
    console.log(x); // 2
}

console.log(x); // 1
```

### 2.1.2. 재선언 불가능, 업데이트 불가능
```js
// 업데이트 불가능
const x = 2;
x = 3; // Uncaught SyntaxError: Identifier 'x' has already been declared

// 재선언 불가능
const y = 2;
const y = 3; // Uncaught SyntaxError: Identifier 'y' has already been declared
```
-> 모든 const는 선언하는 동시에 초기화해야 한다.

* const 객체는 업데이트할 수 없지만 객체의 속성은 업데이트할 수 있다.
```js
const member = {
    name: "Gildong",
    age: 26
}
console.log(member); // {name: 'Gildong', age: 26}

member = {
    place: "Korea",
    number: "010-1234-5678"
} // Uncaught TypeError: Assignment to constant variable.

member.name = "Chunhyang";
console.log(member); // {name: 'Chunhyang', age: 26}
```

### 2.1.3. 호이스팅(Hoisting)
let과 마찬가지로 const 선언도 맨 위로 끌어올려지지만, 초기화되지 않는다.

# 참고
* [var, let, const의 차이점](https://www.freecodecamp.org/korean/news/var-let-constyi-caijeomeun/)