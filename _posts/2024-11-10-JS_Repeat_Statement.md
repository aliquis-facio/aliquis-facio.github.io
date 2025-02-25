---
layout: post
comments: true
sitemap:
    changefreq: daily
    priority: 0.5

title: "[JS] 반복문"
excerpt: "모의해킹 취업반 스터디 7기 4주차"

date: 2024-11-10
last_modified_at: 2024-11-11

tags: [JS]
---

# for
```
for ([초기문]; [조건문]; [증감문]) {
    문장
}
```

```js
for(var i = 0; i < 5; i++){
    console.log(i);
}

// 0
// 1
// 2
// 3
// 4
```

# do...while
```
do {
    문장
} while (조건문);
```

``` js
let 0 = 1;

do {
  i += 1;
  console.log(i);
} while (i < 5);

// 1
// 2
// 3
// 4
// 5
```

# while
```
while (조건문) {
    문장
}
```

```js
var i = 0;

while(i < 5){
    console.log(i);
    i++;
}

// 0
// 1
// 2
// 3
// 4
```

```js
var i = 0;

while(i >= 0){
    console.log(i);
    i++;
}

// 0
// 1
// 2
// 3
// 4
// ...
```

# label
프로그램에서 다른 곳으로 참조할 수 있도록 식별자로 문을 제공한다.  
레이블 값은 예약어가 아닌 임의의 JS 식별자일 수 있다.  
label은 어떤 문장에도 붙일 수 있지만, 주로 중첩된 블록에서 break 또는 continue와 함께 사용해 중첩된 블록을 한번에 빠져나가거나 넘길 때 주로 사용한다.  

```
label:
    statement
```

``` js
markLoop: while (theMark == true) {
    doSomething();
}
```

# break
반복문, switch문, label문과 결합한 문장을 빠져나올 때 사용한다.  

1. label 없이 break 쓸 때: 가장 가까운 반복문 또는 switch문을 종료하고 다음 명령어로 넘어간다.  
`break;`  

``` js
var i = 0;

while(i >= 0){
    if (i > 10) {
        break;
    }

    console.log(i);
    i++;
}
```

2. label을 쓸 때: 특정 label에서 끝난다.  
`break [label];`  

``` js
let x = 0;
let y = 0;

labelCancelLoops: while (true) {
    console.log("Outer Loops: " + x);
    
    x++;
    y = 1;

    while (true) {
        console.log("Inner Loops: " + y);
        
        z++;

        if (y === 10 && x === 10) {
            break labelCancelLoops;
        } else if (y === 10) {
            break;
        }
    }
}
```

# continue
반복문, switch문, label문을 다음 분기로 넘길 때 사용한다.  

1. label 없이 continue 쓸 때: 가장 가까운 반복문의 현재 반복을 종료하고 다음 반복으로 반복문의 실행을 계속한다.  
`continue;`  

``` js
let i = 0;

while (i < 5) {
    i++;

    if (i == 3) {
        continue;
    }

    console.log(i);
}

// 1
// 2
// 4
// 5
```

2. label과 함께 continue 쓸 때: continue는 그 label로 식별되는 반복문에 적용된다.  
`continue [label];`  

``` js
checkIandJ: while (i < 4) {
    console.log(i);
    i += 1;

    checkJ: while (j > 4) {
        console.log(j);
        j -= 1;

        if (j % 2 == 0) {
            continue checkJ;
        }

        console.log(j + " is odd.");
    }

    console.log("i = " + i);
    console.log("j = " + j);
}
```

# for in
객체가 가진 속성(property)을 지정된 변수에 넣어 반복 작업을 한다.  
열거되는 속성은 enumerable = true인 속성만 보여진다.  

```
for ([변수] in [객체]) {
    문장
}
```

```js
let info = {name:"gildong", score:"100", userid:"normal"};

for(let key in info){
    console.log(key + " : " + info[key]);
}
// name: gildong
// score: 100
// userid: normal
```

# for of
반복 가능한(iterable) 객체의 내용을 변수에 담아 반복한다.  
반복 가능한 객체: Array, Map, Set, String, TypedArray, Arguments(함수 인수) 등  

```
for ([변수] of [객체]) {
    문장
}
```

```js
let arr = ['1', '2', '3'];
arr.foo = "what";

for (let x in arr) {
    console.log(x);
}
// 0
// 1
// 2
// "foo"

for (let x of arr) {
    console.log(element);
}
// 1
// 2
// 3
```

# forEach()
배열에 사용되는 method다. 인자에 콜백함수를 넣어 사용한다.  

``` js
let arr = [1, 3, 5];
arr.forEach((element) => {
    console.log(element);
})
```

# 참고
* [루프와 반복](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Loops_and_iteration)
* [JS 반복문](https://velog.io/@reasonz/2022.04.10-%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EB%B0%98%EB%B3%B5%EB%AC%B8-for-for-in-for-of-forEach-while%EB%AC%B8)
* [JS 반복문](https://offbyone.tistory.com/452)