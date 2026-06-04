---
layout: post
comments: true
sitemap:
title: JavaScript
excerpt: 
date: 2026-06-03
last_modified_at: 2026-06-03
categories:
  - WEB
tags:
  - JS
---

# L13 JavaScript (1) 정리

## 1. JavaScript란?

JavaScript는 웹페이지에 **동작과 로직**을 추가하는 프로그래밍 언어이다.

| 구분         | 역할        |
| ---------- | --------- |
| HTML       | 웹페이지의 구조  |
| CSS        | 웹페이지의 스타일 |
| JavaScript | 웹페이지의 동작  |

HTML과 CSS만으로도 기본적인 화면 구성은 가능하지만, 사용자의 입력을 처리하거나 조건에 따라 결과를 계산하고 화면에 반영하려면 JavaScript가 필요하다.

브라우저가 JavaScript를 직접 실행하므로 별도 설치 없이 VS Code와 브라우저만 있으면 실습할 수 있다.

---

## 2. `<script>` 태그

HTML 파일 안에서 JavaScript 코드를 실행하려면 `<script>` 태그를 사용한다.

일반적으로 `<script>` 태그는 `</body>` 바로 위에 작성한다.

```html
<script>
  console.log("JS 실행됨!");
</script>
```

실행 결과는 브라우저 개발자 도구의 **Console 탭**에서 확인할 수 있다.

JavaScript 코드가 많아지면 별도 파일로 분리할 수 있다.

```html
<script src="main.js"></script>
```

---

## 3. 오늘의 목표: 가위바위보 게임 만들기

이번 수업에서는 JavaScript를 사용해 Rock Paper Scissors 게임을 만든다.

게임 코드에는 다음 개념이 포함된다.

* `function`
* `const`, `let`
* 배열
* 조건문
* 비교 연산자
* 논리 연산자
* 템플릿 리터럴
* `prompt`, `alert`

예시 흐름은 다음과 같다.

1. 사용자가 `rock`, `paper`, `scissors` 중 하나를 입력한다.
2. 컴퓨터가 랜덤으로 하나를 선택한다.
3. 사용자와 컴퓨터의 선택을 비교한다.
4. 승리, 패배, 무승부 결과를 출력한다.

---

## 4. 주석

주석은 코드에 설명을 적거나, 특정 코드를 임시로 비활성화할 때 사용한다.

### 한 줄 주석

```javascript
// 한 줄 주석
const name = '홍길동'; // 이름 저장
```

### 여러 줄 주석

```javascript
/*
  여러 줄 주석
  여러 줄에 걸쳐 설명 가능
*/
```

VS Code에서는 다음 단축키로 주석 처리 또는 해제가 가능하다.

| 운영체제    | 단축키        |
| ------- | ---------- |
| Windows | `Ctrl + /` |
| Mac     | `Cmd + /`  |

---

## 5. 입출력: `prompt`, `alert`, `console.log`

### `prompt()`

사용자에게 텍스트를 입력받는 팝업창이다.

```javascript
const name = prompt('이름을 입력하세요');
```

`prompt()`로 입력받은 값은 항상 문자열이다. 숫자로 사용하려면 `Number()`를 이용해 변환해야 한다.

```javascript
const age = Number(prompt('나이를 입력하세요'));
```

### `alert()`

사용자에게 메시지를 팝업창으로 보여준다.

```javascript
alert('안녕하세요, ' + name);
```

### `console.log()`

개발자가 확인하기 위해 콘솔에 값을 출력할 때 사용한다.

```javascript
console.log(name);
```

---

## 6. 함수: `function`

함수는 특정 기능을 수행하는 코드 묶음이다.

함수를 사용하면 같은 코드를 반복해서 작성하지 않고, 이름을 붙여 재사용할 수 있다.

```javascript
function greet() {
  alert('Hello!');
}

greet();
```

함수는 정의만 해서는 실행되지 않는다. 반드시 함수 이름 뒤에 괄호를 붙여 호출해야 실행된다.

```javascript
greet();
```

가위바위보 게임에서는 전체 게임 로직을 `play()` 함수 안에 작성한다.

```javascript
function play() {
  // 게임 로직
}
```

HTML 버튼과 연결하면 버튼 클릭 시 함수를 실행할 수 있다.

```html
<button onclick="play()">Play</button>
```

---

## 7. 변수: `const`, `let`

변수는 값을 저장하는 공간이다.

JavaScript에서는 주로 `const`와 `let`을 사용한다.

### `const`

`const`는 재할당할 수 없는 변수를 만들 때 사용한다.

```javascript
const name = '홍길동';
name = '김철수'; // 오류
```

### `let`

`let`은 나중에 값이 바뀔 수 있는 변수를 만들 때 사용한다.

```javascript
let score = 0;
score = 10;
```

### 사용 기준

| 구분    | const       | let          |
| ----- | ----------- | ------------ |
| 재할당   | 불가능         | 가능           |
| 사용 상황 | 바뀌지 않는 값    | 나중에 바뀔 값     |
| 기본 원칙 | 일단 const 사용 | 필요할 때 let 사용 |

예전에는 `var`도 사용했지만, 요즘 JavaScript에서는 스코프 문제 때문에 `var` 사용을 지양하고 `const`와 `let`을 사용한다.

---

## 8. 배열

배열은 여러 값을 순서대로 저장하는 자료구조이다.

대괄호 `[ ]`를 사용해 만들며, 인덱스는 0부터 시작한다.

```javascript
const choices = ['rock', 'paper', 'scissors'];
```

배열의 각 값은 인덱스로 접근할 수 있다.

```javascript
choices[0]; // 'rock'
choices[1]; // 'paper'
choices[2]; // 'scissors'
```

배열의 길이는 `.length`로 확인한다.

```javascript
choices.length; // 3
```

가위바위보 게임에서는 배열에서 랜덤으로 하나의 값을 선택한다.

```javascript
const i = Math.floor(Math.random() * 3);
const computerChoice = choices[i];
```

### 랜덤 선택 원리

```javascript
Math.random()
```

0 이상 1 미만의 랜덤 숫자를 만든다.

```javascript
Math.random() * 3
```

0 이상 3 미만의 랜덤 숫자를 만든다.

```javascript
Math.floor()
```

소수점을 버린다.

따라서 결과적으로 `0`, `1`, `2` 중 하나가 선택된다.

---

## 9. 조건문: `if`, `else if`, `else`

조건문은 조건에 따라 다른 코드를 실행할 때 사용한다.

```javascript
if (조건1) {
  // 조건1이 true일 때 실행
} else if (조건2) {
  // 조건2가 true일 때 실행
} else {
  // 모든 조건이 false일 때 실행
}
```

가위바위보 게임에서는 사용자의 선택과 컴퓨터의 선택을 비교해 결과를 정한다.

```javascript
if (playerChoice === computerChoice) {
  result = 'Draw!';
} else if (
  (playerChoice === 'rock' && computerChoice === 'scissors') ||
  (playerChoice === 'scissors' && computerChoice === 'paper') ||
  (playerChoice === 'paper' && computerChoice === 'rock')
) {
  result = 'You win!';
} else {
  result = 'You lose...';
}
```

---

## 10. 비교 연산자: `===`, `!==`

비교 연산자는 두 값을 비교할 때 사용한다.

| 연산자   | 의미                 |
| ----- | ------------------ |
| `===` | 값과 타입이 모두 같으면 true |
| `!==` | 값 또는 타입이 다르면 true  |
| `>`   | 크다                 |
| `<`   | 작다                 |
| `>=`  | 크거나 같다             |
| `<=`  | 작거나 같다             |

JavaScript에서는 `==`보다 `===` 사용을 권장한다.

### `==`와 `===` 차이

```javascript
1 == '1';   // true
1 === '1';  // false
```

`==`는 타입이 달라도 값을 비슷하게 변환해서 비교한다.

`===`는 값과 타입이 모두 같아야 true가 된다.

따라서 예상치 못한 버그를 줄이기 위해 JavaScript에서는 보통 `===`를 사용한다.

---

## 11. 논리 연산자: `&&`, `||`, `!`

논리 연산자는 여러 조건을 조합할 때 사용한다.

| 연산자  | 의미                          |   |                          |
| ---- | --------------------------- | - | ------------------------ |
| `&&` | AND, 양쪽 조건이 모두 true일 때 true |   |                          |
| `    |                             | ` | OR, 둘 중 하나라도 true이면 true |
| `!`  | NOT, true와 false를 반대로 바꿈    |   |                          |

### `&&` 예시

```javascript
true && true;   // true
true && false;  // false
false && true;  // false
```

### `||` 예시

```javascript
true || false;   // true
false || false;  // false
```

가위바위보 게임에서 이기는 경우는 세 가지이다.

```javascript
(player === 'rock' && computer === 'scissors') ||
(player === 'scissors' && computer === 'paper') ||
(player === 'paper' && computer === 'rock')
```

즉,

* 사용자가 바위이고 컴퓨터가 가위인 경우
* 사용자가 가위이고 컴퓨터가 보인 경우
* 사용자가 보이고 컴퓨터가 바위인 경우

중 하나라도 true이면 사용자가 승리한다.

---

## 12. 템플릿 리터럴

템플릿 리터럴은 문자열 안에 변수나 표현식을 쉽게 넣을 수 있는 문법이다.

작은따옴표가 아니라 백틱 `` ` ``을 사용한다.

```javascript
const name = '홍길동';
alert(`안녕하세요, ${name}님`);
```

기존 문자열 연결 방식은 다음과 같다.

```javascript
alert('You: ' + playerChoice +
      ' / Computer: ' + computerChoice +
      ' → ' + result);
```

템플릿 리터럴을 사용하면 더 읽기 쉽게 작성할 수 있다.

```javascript
alert(`You: ${playerChoice} / Computer: ${computerChoice} → ${result}`);
```

`${ }` 안에는 변수뿐 아니라 표현식도 넣을 수 있다.

```javascript
const a = 3;
const b = 4;

console.log(`${a} + ${b} = ${a + b}`);
```

출력 결과는 다음과 같다.

```text
3 + 4 = 7
```

---

## 13. 완성 코드

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>Rock Paper Scissors</title>
</head>
<body>
  <h1>Rock Paper Scissors</h1>
  <button onclick="play()">Play</button>

  <script>
    function play() {
      const playerChoice = prompt('rock, paper, scissors?');

      const choices = ['rock', 'paper', 'scissors'];
      const computerChoice = choices[Math.floor(Math.random() * 3)];

      let result;

      if (playerChoice === computerChoice) {
        result = 'Draw!';
      } else if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'scissors' && computerChoice === 'paper') ||
        (playerChoice === 'paper' && computerChoice === 'rock')
      ) {
        result = 'You win!';
      } else {
        result = 'You lose...';
      }

      alert(`You: ${playerChoice} / Computer: ${computerChoice} → ${result}`);
    }
  </script>
</body>
</html>
```

---

## 14. 핵심 요약

이번 강의에서는 JavaScript의 기본 문법과 간단한 게임 로직을 배웠다.

핵심 내용은 다음과 같다.

* JavaScript는 웹페이지의 동작과 로직을 담당한다.
* HTML 안에서 JavaScript를 실행하려면 `<script>` 태그를 사용한다.
* `prompt()`는 사용자 입력을 받고, `alert()`는 결과를 출력한다.
* 함수는 코드를 묶어 재사용하기 위해 사용한다.
* 변수는 `const`와 `let`을 사용한다.
* 배열은 여러 값을 순서대로 저장한다.
* 조건문은 상황에 따라 다른 코드를 실행한다.
* 비교할 때는 `==`보다 `===`를 사용하는 것이 좋다.
* 논리 연산자 `&&`, `||`를 사용해 여러 조건을 조합할 수 있다.
* 템플릿 리터럴을 사용하면 문자열 안에 변수를 쉽게 넣을 수 있다.
