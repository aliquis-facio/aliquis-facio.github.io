---
layout: post
title: "Markdown Syntax"
date: 2021-12-11
excerpt: "This test post is for checking MarkDown Syntax"
tags: [Sample, Post, Test]
comments: true
---

### 참고
    1. <https://raw.githubusercontent.com/TaylanTatli/Moon/master/_posts/2016-03-20-markdown-syntax.md>
	2. <http://taewan.kim/post/markdown/#comment>

**마크다운 문법을 전부 한번씩 써보면 될 듯**

# h1
## h2
### h3
#### h4
##### h5
###### h6

***
---
___

text

*text*
_text_
**text**
__text__
***text***
~~text~~

> text
> text
> text

> text
>> text
> (text)
> # text

    > text
    > text
    > text

* list
+ list
    * sub list
- list
    1. list
    2. list

` print("Hello, World!")`

| 1st | 2nd | 3rd |
| --- | --- | --- |
| 1 | 2 | 3 |

| 1st | 2nd | 3rd |
| :--- | ---: | :---: |
| 1 | 2 | 3 |

[youtube](https://www.youtube.com)

<a href="http://www.youtube.com">youtube</a>

[youtube](https://www.youtube.com "유튜브")

<a href="http://www.youtube.com" title="유튜브">youtube</a>

[구글][1]
[1]: https://www.google.com

<http://www.naver.com>

<a href="https://www.naver.com">http://www.naver.com</a>

### 테이블 구성
  * [1장](#chapter-1)
  * [2장](#chapter-2)
  * [3장](#chapter-3)

![Minion](http://octodex.github.com/images/minion.png)

![Alt text](http://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")

<img src="http://octodex.github.com/images/stormtroopocat.jpg" alt="Alt text" title="The Stormtroopocat" />

![Alt text][10]
[10]: http://octodex.github.com/images/dojocat.jpg  "The Dojocat"

<!-- 주석 -->

최근 스칼라는 매우 인기가 높은 언어이다.[^scala]

\[^scala]: 스칼라는 마틴 오더시크가 개발한 함수형 언어이다.

### 정렬
<center>중앙</center>
<div style="text-align: left"> 왼쪽 </div>
<div style="text-align: right"> 오른쪽 </div>

### 첨자
<sup>윗첨자</sup>
<sub>밑첨자</sub>
<acronym title="텍스트 가리키면 나오는 텍스트">텍스트</acronym>
<abbr title="텍스트 가리키면 나오는 텍스트">줄 쳐진 텍스트</abbr>