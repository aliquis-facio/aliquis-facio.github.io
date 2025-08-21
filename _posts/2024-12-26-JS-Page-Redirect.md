---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[JS] JS로 웹페이지 리다이렉트하는 법"
excerpt: "모의해킹 취업반 스터디 7기 11주차"

date: 2024-12-26
last_modified_at: 

categories: [WEB]
tags: [TIL, WEB, JS]
---

# Page Redirect
JS를 이용해 다른 웹페이지로 리다이렉트하는 방법이다.  
보통 `location.href`나 `location.replace`를 사용한다.  

```js
// Stimulate a Mouse Click 1
location.href = "example.com"; // 뒤로 가기 가능

// Stimulate a Mouse Click 2
location.assign("example.com"); // 뒤로 가기 가능

// Stimulate an HTTP Redirect
location.replace("example.com"); // 뒤로 가기 불가능
```

**`replace`는 웹페이지 기록에서 현재 문서의 URL을 지우기 때문에 이전 페이지로 뒤로가기가 불가능하다.**

# 참고
* [How TO - Redirect to Another Webpage](https://www.w3schools.com/howto/howto_js_redirect_webpage.asp)
* [How to Redirect to Another Webpage using JavaScript?](https://www.geeksforgeeks.org/how-to-redirect-to-another-webpage-using-javascript/)
* [JavaScript Redirect: How to Redirect to a New URL](https://www.semrush.com/blog/javascript-redirect/)