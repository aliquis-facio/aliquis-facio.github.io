---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[Markdown] 마크다운 문법 총 정리 2"
excerpt: "Part 2: Heading ID, 코드, 표, 수식"

date: 2021-12-11
last_modified_at: 2026-02-05

categories: [BLOG]
tags: [BLOG, MARKDOWN]
---

<!-- markdownlint-disable MD004 MD007 MD022 MD025 MD029 MD032 MD033 MD034 MD035 MD048 MD059 -->

# 마크다운 문법 총정리

> 시리즈: [Index](./Markdown-Syntax-Index.md)
- [Part 1: 제목, 강조, 정렬, 수평선, 인용, 목록, 링크](./Markdown-Syntax-1.md)
- [Part 2: Heading ID, 코드, 표, 수식](./Markdown-Syntax-2.md)
- [Part 3: 이미지, 이모지, 다이어그램, HTML/CSS/JS](./Markdown-Syntax-3.md)

## 목차

1. [Heading IDs](#1-heading-ids)
    1. [응용(ID로 링크 걸기)](#11-응용id로-링크-걸기)
2. [코드(Code)](#2-코드code)
    1. [인라인(inline)](#21-인라인inline)
    2. [블록(block)](#22-블록block)
    3. [HTML tag](#23-html-tag)
3. [표(Table)](#3-표table)
4. [수식](#4-수식)
    1. [인라인(inline)](#41-인라인inline)
    2. [블록(block)](#42-블록block)

---

## 1. Heading IDs

```md
### My Great Heading {#custom-id}
```

위처럼 쓰면 html에서 이렇게 적용된다.

```html
<h3 id="custom-id">My Great Heading</h3>
```

### 1.1. 응용(ID로 링크 걸기)

```md
1. [Heading IDs](#1-heading-ids)
    1. [응용(ID로 링크 걸기)](#11-응용id로-링크-걸기)
2. [코드(Code)](#2-코드code)
    1. [인라인(inline)](#21-인라인inline)
    2. [블록(block)](#22-블록block)
    3. [HTML tag](#23-html-tag)
3. [표(Table)](#3-표table)
4. [수식](#4-수식)
    1. [인라인(inline)](#41-인라인inline)
    2. [블록(block)](#42-블록block)
```

1. [Heading IDs](#1-heading-ids)
    1. [응용(ID로 링크 걸기)](#11-응용id로-링크-걸기)
2. [코드(Code)](#2-코드code)
    1. [인라인(inline)](#21-인라인inline)
    2. [블록(block)](#22-블록block)
    3. [HTML tag](#23-html-tag)
3. [표(Table)](#3-표table)
4. [수식](#4-수식)
    1. [인라인(inline)](#41-인라인inline)
    2. [블록(block)](#42-블록block)

## 2. 코드(Code)

가끔 \`(백틱)으로 감싸도 사이트에서 렌더링이 제대로 되지 않을 때가 있다. 여러 이유가 있겠지만 jekyll과 liquid를 사용하는 블로그의 경우 {% raw %} `{{...}}` {% endraw %}를 템플릿 언어인 liquid가 먼저 해석해서 오류가 발생하는 경우가 있다. 그럴 경우 `{% raw %}`와 `{% endraw %}`로 앞뒤를 감싸주면 해결된다.

### 2.1. 인라인(inline)

```md
`print("Hello, World!")`
```

`print("Hello, World!")`

### 2.2. 블록(block)

Highlighting을 적용시키기 위해서는 ``` 옆에 알맞는 language를 적어주면 된다.  

````md
``` python
while (True):
    print("마크다운 나 짜증나게 하지마")
```
````
  
``` python
while (True):
    print("마크다운 나 짜증나게 하지마")
```

---

````md
``` java
public static void main(String[] args) {
    while (true) {
        System.out.println("마크다운 나 짜증나게 하지마");
    }
}
```
````

``` java
public static void main(String[] args) {
    while (true) {
        System.out.println("마크다운 나 짜증나게 하지마");
    }
}
```

---

````md
``` c
#include <stdio.h>

for (int i = 0; i++; i>10) {
    printf("Hello World!");
}

return 0;
```
````

``` c
#include <stdio.h>

for (int i = 0; i++; i>10) {
    printf("Hello World!");
}

return 0;
```

### 2.3. HTML tag

```html
<code>
print("Hello, World!")
</code>
```

<code>
print("Hello, World!")
</code>

---

```html
<pre>
print("Hello, World!")
</pre>
```

<pre>
print("Hello, World!")
</pre>

## 3. 표(Table)

```md
| 1st | 2nd | 3rd |
| --- | --- | --- |
| 한자 | 심리학 | 수치해석학 |
| 선형대수학 | 통계학 | 이산수학 |
| 컴퓨터 구조 | 토익 | 파이썬 |
```

| 1st | 2nd | 3rd |
| --- | --- | --- |
| 한자 | 심리학 | 수치해석학 |
| 선형대수학 | 통계학 | 이산수학 |
| 컴퓨터 구조 | 토익 | 파이썬 |

---

```md
| 1st | 2nd | 3rd |
| :--- | :---: | ---: |
| 좌로 정렬 | 가운데 정렬 | 우로 정렬 |
| 선형대수학 | 통계학 | 이산수학 |
| 컴퓨터 구조 | 토익 | 파이썬 |
```

| 1st | 2nd | 3rd |
| :--- | :---: | ---: |
| 좌로 정렬 | 가운데 정렬 | 우로 정렬 |
| 선형대수학 | 통계학 | 이산수학 |
| 컴퓨터 구조 | 토익 | 파이썬 |

---

``` html
<table>
    <thead>
        <tr>
            <th>1st</th>
            <th>2nd</th>
            <th>3rd</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td colspan = "2">2열 병합</td>
            <!-- <td>가운데 정렬</td> -->
            <td style = "text-align: right">우로 정렬</td>
        </tr>
        <tr>
            <td rowspan = "2">2행 병합</td>
            <td style = "text-align: center">가운데 정렬</td>
            <td style = "text-align: left">좌로 정렬</td>
        </tr>
        <tr>
            <!-- <td>컴퓨터 구조</td> -->
            <td>토익</td>
            <td>파이썬</td>
        </tr>
    </tbody>
</table>
```

<table>
    <thead>
        <tr>
            <th>1st</th>
            <th>2nd</th>
            <th>3rd</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td colspan = "2">2열 병합</td>
            <!-- <td>가운데 정렬</td> -->
            <td style = "text-align: right">우로 정렬</td>
        </tr>
        <tr>
            <td rowspan = "2">2행 병합</td>
            <td style = "text-align: center">가운데 정렬</td>
            <td style = "text-align: left">좌로 정렬</td>
        </tr>
        <tr>
            <!-- <td>컴퓨터 구조</td> -->
            <td>토익</td>
            <td>파이썬</td>
        </tr>
    </tbody>
</table>

## 4. 수식

~~수식 같은 경우에는 다른 프로그램에서 수식을 작성하고 캡처해서 사진으로 붙여넣는 게 빠르다~~
~~* 2026.02.05 추가최근에는 AI에게 수식을 캡처해서 보여주고 LaTeX로 변환해줘! 하면 꽤나 깔끔하게 바꿔준다~~

### 4.1. 인라인(inline)

```md
$f(x)= if x < x_{min} : (x/x_{min})^a$
$otherwise : 0$
$P(w)=U(x/2)(7/5)/Z$
$p_{\theta}(x) = \int p_{\theta}(2z)p_{\theta}(y\mid k)dz$
$x = argmax_k((x_t-x_u+x_v)^T*x_m)/(||x_b-x_k+x_l||)$
```

$f(x)= if x < x_{min} : (x/x_{min})^a$
$otherwise : 0$
$P(w)=U(x/2)(7/5)/Z$
$p_{\theta}(x) = \int p_{\theta}(2z)p_{\theta}(y\mid k)dz$
$x = argmax_k((x_t-x_u+x_v)^T*x_m)/(||x_b-x_k+x_l||)$

### 4.2. 블록(block)

```md
$$
f(x)= if x < x_{min} : (x/x_{min})^a
otherwise : 0
P(w)=U(x/2)(7/5)/Z
p_{\theta}(x) = \int p_{\theta}(2z)p_{\theta}(y\mid k)dz
x = argmax_k((x_t-x_u+x_v)^T*x_m)/(||x_b-x_k+x_l||)
$$
```

$$
f(x)= if x < x_{min} : (x/x_{min})^a \\
otherwise : 0 \\
P(w)=U(x/2)(7/5)/Z \\
p_{\theta}(x) = \int p_{\theta}(2z)p_{\theta}(y\mid k)dz \\
x = argmax_k((x_t-x_u+x_v)^T*x_m)/(||x_b-x_k+x_l||) \\
$$
