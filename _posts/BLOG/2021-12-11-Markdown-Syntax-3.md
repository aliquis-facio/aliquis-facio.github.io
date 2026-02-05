---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[Markdown] 마크다운 문법 총 정리 3"
excerpt: "Part 3: 이미지, 이모지, 다이어그램, HTML/CSS/JS"

date: 2021-12-11
last_modified_at: 2026-02-05

categories: [BLOG]
tags: [BLOG, MARKDOWN]
---

<!-- markdownlint-disable MD004 MD007 MD022 MD025 MD029 MD032 MD033 MD034 MD035 MD048 MD059 -->

<script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>

# 마크다운 문법 총정리

> 시리즈: [Index]({% post_url BLOG/2021-12-11-markdown-grammar-index %})
| [Part 1]({% post_url BLOG/2021-12-11-markdown-grammar-part-1 %})
| [Part 2]({% post_url BLOG/2021-12-11-markdown-grammar-part-2 %})
| [Part 3]({% post_url BLOG/2021-12-11-markdown-grammar-part-3 %})

## 목차

1. [이미지(Image)](#1-이미지image)
2. [Emoji](#2-emoji)
    1. [Emoji 붙여넣기](#21-emoji-붙여넣기)
    2. [Shortcode 사용하기](#22-shortcode-사용하기)
3. [다이어그램(mermaid)](#3-다이어그램mermaid)
4. [HTML, CSS, JS](#4-html-css-js)

---

## 1. 이미지(Image)

CDN을 적용하면 이미지를 빠르게 로딩시킬 수 있다.
CDN 적용 사이트: [JSDELIVR](https://www.jsdelivr.com/github)

```md
![첫 번째 이미지](https://cdn.pixabay.com/photo/2023/01/25/08/59/bird-7742845_960_720.jpg "링크 설명(title)")
```

![첫 번째 이미지](https://cdn.pixabay.com/photo/2023/01/25/08/59/bird-7742845_960_720.jpg "링크 설명(title)")

---

```md
![두 번째 이미지](https://cdn.pixabay.com/photo/2023/01/11/09/30/trees-7711283_960_720.jpg "두 번째 이미지")
```

![두 번째 이미지](https://cdn.pixabay.com/photo/2023/01/11/09/30/trees-7711283_960_720.jpg "두 번째 이미지")

---

```md
![세 번째 이미지][이미지 링크]

[이미지 링크]: https://cdn.pixabay.com/photo/2023/01/14/18/17/hot-air-balloon-7718789_960_720.jpg  "세 번째 이미지"
```

![세 번째 이미지][이미지 링크]

[이미지 링크]: https://cdn.pixabay.com/photo/2023/01/14/18/17/hot-air-balloon-7718789_960_720.jpg  "세 번째 이미지"

---

```md
<!-- 이 넘은 사진 클릭하면 링크 탐 -->
[![네 번째 이미지](https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/368px-Google_2015_logo.svg.png)](https://www.google.no/)
```

이 넘은 사진 클릭하면 링크 탐
[![네 번째 이미지](https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/368px-Google_2015_logo.svg.png)](https://www.google.no/)

---

```html
<img src="https://cdn.pixabay.com/photo/2023/01/27/01/40/brothers-7747561_960_720.jpg" alt="대체 문구입니다" title="다섯 번째 이미지" />
```

<img src="https://cdn.pixabay.com/photo/2023/01/27/01/40/brothers-7747561_960_720.jpg" alt="대체 문구입니다" title="다섯 번째 이미지" />

---

## 2. Emoji

정적 사이트 생성기를 사용하고 있다면, HTML page 인코딩을 UTF-8로 해야 한다.

### 2.1. Emoji 붙여넣기

1. [Emojipedia](https://emojipedia.org/): img 형태로 복사된다.
    <img src = "https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-24-1.png?raw=true" alt="Emoji">
2. [twitter-symbols](https://kr.piliapp.com/twitter-symbols/): emoji 형태로 복사된다
    🙃

### 2.2. Shortcode 사용하기

~~Jekyll에서 적용 안 되는 듯~~

```md
Gone camping! :tent: Be back soon.
That is so funny! :joy:
```

Gone camping! :tent: Be back soon.  
That is so funny! :joy:  
[Emoji Shortcodes 목록](https://gist.github.com/rxaviers/7360908)

## 3. 다이어그램(mermaid)

Pages는 Mermaid가 적용되지 않아서 HTML 요소를 사용해서 처리해야 한다

그렇기 때문에 포스트 맨 위와

```HTML
<script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
```

맨 아래에

```HTML
<script>
mermaid.initialize({startOnLoad:true});
window.mermaid.init(undefined, document.querySelectorAll('.language-mermaid'));
</script>
```

를 적용해줘야 한다

---

````md
```mermaid
graph LR
A[Encoding/Decoding<br>인코딩/디코딩]
B(Encryption/Decryption<br>암호화/복호화) --> C(Hash<br>단방향 암호화)
B --> D(Encryption<br>양방향 암호화)
D --> E(대칭키)
D --> F(비대칭키)
```
````

```mermaid
graph LR
A[Encoding/Decoding<br>인코딩/디코딩]
B(Encryption/Decryption<br>암호화/복호화) --> C(Hash<br>단방향 암호화)
B --> D(Encryption<br>양방향 암호화)
D --> E(대칭키)
D --> F(비대칭키)
```

---

```md
~~~ mermaid
graph LR
A[Encoding/Decoding<br>인코딩/디코딩]
B(Encryption/Decryption<br>암호화/복호화) --> C(Hash<br>단방향 암호화)
B --> D(Encryption<br>양방향 암호화)
D --> E(대칭키)
D --> F(비대칭키)
~~~
```

~~~ mermaid
graph LR
A[Encoding/Decoding<br>인코딩/디코딩]
B(Encryption/Decryption<br>암호화/복호화) --> C(Hash<br>단방향 암호화)
B --> D(Encryption<br>양방향 암호화)
D --> E(대칭키)
D --> F(비대칭키)
~~~

---

````md
``` mermaid
pie title What Voldemort doesn't have?
         "FRIENDS" : 2
         "FAMILY" : 3
         "NOSE" : 45
```
````

``` mermaid
pie title What Voldemort doesn't have?
         "FRIENDS" : 2
         "FAMILY" : 3
         "NOSE" : 45
```

---

````md
``` mermaid
sequenceDiagram
    Alice ->> Bob: Hello Bob, how are you?
    Bob-->>John: How about you John?
    Bob--x Alice: I am good thanks!
    Bob-x John: I am good thanks!
    Note right of John: Bob thinks a long<br/>long time, so long<br/>that the text does<br/>not fit on a row.

    Bob-->Alice: Checking with John...
    Alice->John: Yes... John, how are you?
```
````

``` mermaid
sequenceDiagram
    Alice ->> Bob: Hello Bob, how are you?
    Bob-->>John: How about you John?
    Bob--x Alice: I am good thanks!
    Bob-x John: I am good thanks!
    Note right of John: Bob thinks a long<br/>long time, so long<br/>that the text does<br/>not fit on a row.

    Bob-->Alice: Checking with John...
    Alice->John: Yes... John, how are you?
```

---

````md
``` mermaid
graph LR
    A[Square Rect] -- Link text --> B((Circle))
    A --> C(Round Rect)
    B --> D{Rhombus}
    C --> D
```
````

``` mermaid
graph LR
    A[Square Rect] -- Link text --> B((Circle))
    A --> C(Round Rect)
    B --> D{Rhombus}
    C --> D
```

---

````md
``` mermaid
graph TB
    sq[Square shape] --> ci((Circle shape))

    subgraph A
        od>Odd shape]-- Two line<br/>edge comment --> ro
        di{Diamond with <br/> line break} -.-> ro(Rounded<br>square<br>shape)
        di==>ro2(Rounded square shape)
    end

    %% Notice that no text in shape are added here instead that is appended further down
    e --> od3>Really long text with linebreak<br>in an Odd shape]

    %% Comments after double percent signs
    e((Inner / circle<br>and some odd <br>special characters)) --> f(,.?!+-*ز)

    cyr[Cyrillic]-->cyr2((Circle shape Начало));

     classDef green fill:#9f6,stroke:#333,stroke-width:2px;
     classDef orange fill:#f96,stroke:#333,stroke-width:4px;
     class sq,e green
     class di orange
```
````

``` mermaid
graph TB
    sq[Square shape] --> ci((Circle shape))

    subgraph A
        od>Odd shape]-- Two line<br/>edge comment --> ro
        di{Diamond with <br/> line break} -.-> ro(Rounded<br>square<br>shape)
        di==>ro2(Rounded square shape)
    end

    %% Notice that no text in shape are added here instead that is appended further down
    e --> od3>Really long text with linebreak<br>in an Odd shape]

    %% Comments after double percent signs
    e((Inner / circle<br>and some odd <br>special characters)) --> f(,.?!+-*ز)

    cyr[Cyrillic]-->cyr2((Circle shape Начало));

     classDef green fill:#9f6,stroke:#333,stroke-width:2px;
     classDef orange fill:#f96,stroke:#333,stroke-width:4px;
     class sq,e green
     class di orange
```

[참고 사이트](https://mermaid.js.org/syntax/examples.html)에 종류가 더 있으니 직접 확인하는 걸 추천한다

## 4. HTML, CSS, JS

마크다운에 HTML, CSS, JS 문법을 적용시킬 수 있다.  
HTML의 각종 태그, `<style>`, `<script>`로 감싸고 그 안에 각각의 문법에 맞는 코드를 작성하면 된다.  
태그로 감싸져 있는 부분은 마크다운 문법 적용이 안 된다.

<script>
mermaid.initialize({startOnLoad:true});
window.mermaid.init(undefined, document.querySelectorAll('.language-mermaid'));
</script>
