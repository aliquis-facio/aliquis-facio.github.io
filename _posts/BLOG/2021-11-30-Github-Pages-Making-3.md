---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[GITHUB PAGES] github.io 만들면서 느낀 점"
excerpt: "항상 느낍니다. 왜 안되는거냐?"

date: 2021-11-30
last_modified_at: 

categories: [BLOG]
tags: [BLOG]
---

## 자주 본 오류들

* 로컬에서 실행되지만 원격에서는 실행되지 않을 때, 그 반대인 경우
* bundle update를 쳤다가 permission 관련 문제로 sudo bundle update로 치는 경우  

## 어려웠던 점들

제일 어렵게 느껴지는 부분은 **테마에 따라서** config.yml 바꾸는 부분부터 시작해서 폰트 적용하는 위치, disqus **적용 부분이 전부 다르다는 것**이다.  
아직 html, css, 파일구조 등을 모르다보니 일일히 찾아가면서 바꾸는 것이 어려웠다.  
**gem들간의 호환성 문제** 이게 제일 중요한 것 같다. 다른 부분 전부 문제 없어도 이거 하나 잘못되면 그때부터 오류에서 벗어날 수가 없었다.

## 자주 사용했던 명령어들

`bundle exec jekyll serve`  
bundle exec jekyll serve는 bundle, gem의 호환성 문제 때문에 약간 아나콘다 쓰는 느낌으로 사용하는 명령어로 블로그를 꾸미면서 가장 많이 사용했던 명령어 중에 하나였다.  

그리고 이제 로컬에서 바꾼 것을 원격에서 적용시키기 위해 사용하는  

```git
git add .  
git commit -m "message"  
git push  
```

~~git push할 때 token을 사용한다는 걸로 바뀌었다는 걸 처음에는 몰라서 그냥 비밀번호 쳤다가 안되서 당황했었다는...~~

## 답답했던 점들

테마를 folk해서 첫 수정을 할 때면 오류가 항상 일어났다는 사소한 버그와 원격 레포에 올려도 github.io에서 적용되는 딜레이가 있어서 답답해서 너무나도 행복했다는 사소한 이야기
