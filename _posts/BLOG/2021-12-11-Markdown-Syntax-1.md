---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[Markdown] 마크다운 문법 총 정리 1"
excerpt: "Part 1: 제목, 강조, 정렬, 수평선, 인용, 목록, 링크"

date: 2021-12-11
last_modified_at: 2026-02-05

categories: [BLOG]
tags: [BLOG, MARKDOWN]
---

<!-- markdownlint-disable MD004 MD007 MD022 MD025 MD029 MD032 MD033 MD034 MD035 MD048 MD050 MD059 -->

# 마크다운 문법 총정리

> 시리즈: [Index]({% post_url BLOG/2021-12-11-markdown-grammar-index %})
| [Part 1]({% post_url BLOG/2021-12-11-markdown-grammar-part-1 %})
| [Part 2]({% post_url BLOG/2021-12-11-markdown-grammar-part-2 %})
| [Part 3]({% post_url BLOG/2021-12-11-markdown-grammar-part-3 %})

## 목차

1. [마크다운(Markdown)이란?](#1-마크다운markdown이란)
2. [제목(Header)](#2-제목header)
3. [내용(Context)](#3-내용context)
    1. [강조(Emphasize)](#31-강조emphasize)
    2. [정렬](#32-정렬)
    3. [첨자](#33-첨자)
    4. [주석](#34-주석)
    5. [다음 줄로 넘어가기(New Line)](#35-다음-줄로-넘어가기new-line)
    6. [하이하이트](#36-하이하이트)
4. [수평선(Horizon)](#4-수평선horizon)
5. [인용문(Block Quote)](#5-인용문block-quote)
6. [목록(List)](#6-목록list)
    1. [Unordered List](#61-unordered-list)
    2. [Ordered List](#62-ordered-list)
    3. [Definition List](#63-definition-list)
    4. [Task List](#64-task-list)
    5. [Toggle List](#65-toggle-list)
7. [링크(Link)](#7-링크link)

---

## 1. 마크다운(Markdown)이란?

마크다운(Markdown)은 문서를 쉽고 빠르게 작성하기 위한 경량 마크업 언어이다. 텍스트에 몇 가지 기호를 붙여서 제목, 목록, 코드, 링크 같은 서식을 표현하고, 이를 GitHub, 블로그, 노트앱 등이 HTML 같은 형태로 렌더링해서 보여준다.

> 마크업 언어(Markup Language): 문서의 내용(텍스트)에 구조, 의미, 표현 정보를 태그(표식)로 덧붙여 컴퓨터가 문서를 해석, 표시, 가공할 수 있게 하는 형식이다.

## 2. 제목(Header)

```md
# h1
## h2
### h3
#### h4
##### h5
###### h6
```

# h1
## h2
### h3
#### h4
##### h5
###### h6

## 3. 내용(Context)

### 3.1. 강조(Emphasize)

```md
이탤릭체: *이탤릭체*, _italic letters_, <i>이탤릭체</i>, <em>italic letters</em>  
두껍게: **두껍게**, __bold letters__ , <b>두껍게</b>, <strong>bold letters</strong>  
이탤릭체와 두껍게 같이: ***같이 사용하기***
취소선: ~~취소선~~ , <del>strikethrough</del>  
밑줄: <u>밑줄</u>, <ins>underline</ins>  
<acronym title="텍스트 가리키면 나오는 텍스트">텍스트</acronym>  
<abbr title="텍스트 가리키면 나오는 텍스트">줄 쳐진 텍스트</abbr>  
```

이탤릭체: *이탤릭체*, _italic letters_, <i>이탤릭체</i>, <em>italic letters</em>  
두껍게: **두껍게**, __bold letters__ , <b>두껍게</b>, <strong>bold letters</strong>  
굵은 이탤릭체: ***같이 사용하기***  
취소선: ~~취소선~~ , <del>strikethrough</del>  
밑줄: <u>밑줄</u>, <ins>underline</ins>  
<acronym title="텍스트 가리키면 나오는 텍스트">텍스트 가리키면 나오는 텍스트 1</acronym>  
<abbr title="텍스트 가리키면 나오는 텍스트">텍스트 가리키면 나오는 텍스트 2</abbr>  

### 3.2. 정렬

```md
<center>중앙</center>  
<div style="text-align: center"> 중앙 </div>  
<div style="text-align: left"> 왼쪽 </div>  
<div style="text-align: right"> 오른쪽 </div> 
```

<center>중앙</center>  
<div style="text-align: center"> 중앙 </div>  
<div style="text-align: left"> 왼쪽 </div>  
<div style="text-align: right"> 오른쪽 </div>  

### 3.3. 첨자

~~Jekyll에서 적용 안 되는 듯~~  

```md
H~2~O
X^2^
```

H~2~O  
X^2^  

---

```html
텍스트<sup>윗첨자</sup>  
텍스트<sub>밑첨자</sub>  
```

텍스트<sup>윗첨자</sup>  
텍스트<sub>밑첨자</sub>  

### 3.4. 주석

`<!-- 주석 -->`

### 3.5. 다음 줄로 넘어가기(New Line)

```md
C/C++  <!-- 스페이스 두 번 -->
JAVA  <!-- 스페이스 두 번 -->
PYTHON  <!-- 스페이스 두 번 -->
R  <!-- 스페이스 두 번 -->
JAVA SCRIPT<br>
HTML<br>
CSS<br>
GO<br>
```

C/C++  <!-- 스페이스 두 번 -->
JAVA  <!-- 스페이스 두 번 -->
PYTHON  <!-- 스페이스 두 번 -->
R  <!-- 스페이스 두 번 -->
JAVA SCRIPT<br>
HTML<br>
CSS<br>
GO<br>

### 3.6. 하이하이트

```md
안녕하세요. ==jekyll==에서는 적용 안 되는 듯하다.
```

안녕하세요. ==jekyll==에서는 적용 안 되는 듯하다.

```html
안녕하세요. 이 부분에 <mark>하이라이트</mark>를 할 겁니다.
```

안녕하세요. 이 부분에 <mark>하이라이트</mark>를 할 겁니다.

## 4. 수평선(Horizon)

```md
***
--- (보통 이걸 쓴다)
___
```

***
---
___

## 5. 인용문(Block Quote)

```md
> text
>> text
>>> text
> # text
```

> text
>> text
>>> text
> * text

## 6. 목록(List)

### 6.1. Unordered List

```md
* non-ordered list
    * 순서 없는 서브 목록
    + 순서 없는 서브 목록
    - 순서 없는 서브 목록
+ 순서 없는 목록
- 순서 없는 목록
```

* non-ordered list
    * 순서 없는 서브 목록
    + 순서 없는 서브 목록
    - 순서 없는 서브 목록
+ 순서 없는 목록
- 순서 없는 목록

---

```html
<ul>
    <li>Coffee</li>
    <li>Tea
        <ul>
        <li>Black tea</li>
        <li>Green tea</li>
        </ul>
    </li>
    <li>Milk</li>
</ul>
```

<ul>
    <li>Coffee</li>
    <li>Tea
        <ul>
        <li>Black tea</li>
        <li>Green tea</li>
        </ul>
    </li>
    <li>Milk</li>
</ul>

### 6.2. Ordered List

```md
1. ordered sub list
    1. 순서 있는 서브 목록
    2. 순서 있는 서브 목록
    3. 순서 있는 서브 목록
10. 순서 있는 목록 <!-순서가 차례대로 자동으로 매겨짐>
```

1. ordered sub list
    1. 순서 있는 서브 목록
    2. 순서 있는 서브 목록
    3. 순서 있는 서브 목록
10. 순서 있는 목록

---

```html
<ol>
    <li>Coffee</li>
    <li>Tea
        <ol>
        <li>Black tea</li>
        <li>Green tea</li>
        </ol>
    </li>
    <li>Milk</li>
</ol>
```

<ol>
    <li>Coffee</li>
    <li>Tea
        <ol>
        <li>Black tea</li>
        <li>Green tea</li>
        </ol>
    </li>
    <li>Milk</li>
</ol>

### 6.3. Definition List

```md
First Term
: This is the definition of the first term.

Second Term
: This is one definition of the second term.
: This is another definition of the second term.
```

First Term
: This is the definition of the first term.

Second Term
: This is one definition of the second term.
: This is another definition of the second term.

---

```html
<dl>
    <dt>First Term</dt>
    <dd>This is the definition of the first term.</dd>
    <dt>Second Term</dt>
    <dd>This is one definition of the second term. </dd>
    <dd>This is another definition of the second term.</dd>
</dl>
```

<dl>
    <dt>First Term</dt>
    <dd>This is the definition of the first term.</dd>
    <dt>Second Term</dt>
    <dd>This is one definition of the second term. </dd>
    <dd>This is another definition of the second term.</dd>
</dl>

### 6.4. Task List

```md
- [x] 순서없는 리스트에서
- [ ] 대괄호를 추가하고
- [ ] 체크는 X로 하면 된다.
```

- [x] 순서없는 리스트에서
- [ ] 대괄호를 추가하고
- [ ] 체크는 X로 하면 된다.

### 6.5. Toggle List

마크다운에서는 토글을 지원하지 않아 html을 사용한다.
`markdown="1"`을 넣어줘야 jekyll에서 html 사이에 존재하는 markdown을 인식할 수 있다.

```html
<details>
    <summary>토글 접기/펼치기</summary>
    <div markdown="1">
        내용
    <div>
</details>
```

<details>
    <summary>토글 접기/펼치기</summary>
    <div markdown="1">
        내용
    <div>
</details>

## 7. 링크(Link)

```md
* 주소를 보여주고만 싶을 때: https://google.com  
* 링크만 있는 inline 링크: <http://www.naver.com>  
* [설명 있는 inline 링크 1](https://google.com)  
* <a href="http://www.youtube.com">설명 있는 inline 링크 2</a>  
* [갖다 대면 텍스트 뜨는 inline 링크 1](https://www.youtube.com "유튜브")  
* <a href="http://www.youtube.com" title="Youtube">갖다 대면 텍스트 뜨는 inline 링크 2</a>  
* [내가 작성한 다른 post로 넘어가고 싶을 때](./2021-11-30-github%EB%B8%94%EB%A1%9C%EA%B7%B8_%EB%8A%90%EB%82%80%EC%A0%90.md)  
* [갖다 대면 텍스트 뜨는 설명 있는 inline 링크인데 링크를 다른 곳에 빼 놓음]  
* [링크 다른 곳에 써놓기 1][Naver Link]  
* [링크 다른 곳에 써놓기 2][1]  

[Naver Link]: https://www.naver.com/
[1]: https://github.com/
[갖다 대면 텍스트 뜨는 설명 있는 inline 링크인데 링크를 다른 곳에 빼 놓음]: https://google.com "구글"
```

* 주소를 보여주고만 싶을 때: https://google.com  
* 링크만 있는 inline 링크: <http://www.naver.com>  
* [설명 있는 inline 링크 1](https://google.com)  
* <a href="http://www.youtube.com">설명 있는 inline 링크 2</a>  
* [갖다 대면 텍스트 뜨는 inline 링크 1](https://www.youtube.com "유튜브")  
* <a href="http://www.youtube.com" title="Youtube">갖다 대면 텍스트 뜨는 inline 링크 2</a>  
* [내가 작성한 다른 post로 넘어가고 싶을 때](./2021-11-30-github%EB%B8%94%EB%A1%9C%EA%B7%B8_%EB%8A%90%EB%82%80%EC%A0%90.md)  
* [갖다 대면 텍스트 뜨는 설명 있는 inline 링크인데 링크를 다른 곳에 빼 놓음]  
* [링크 다른 곳에 써놓기 1][Naver Link]  
* [링크 다른 곳에 써놓기 2][1]  

[Naver Link]: https://www.naver.com/
[1]: https://github.com/
[갖다 대면 텍스트 뜨는 설명 있는 inline 링크인데 링크를 다른 곳에 빼 놓음]: https://google.com "구글"
