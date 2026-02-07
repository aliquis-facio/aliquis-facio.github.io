---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[GITHUB PAGES] github.io 만들기 2"
excerpt: "오류 멈춰!"

date: 2021-11-30
last_modified_at: 2025-01-18

categories: [BLOG]
tags: [BLOG]
---

<!-- markdownlint-disable MD005 MD010 MD025 MD033 MD049-->

# Github.io 만들기 2

# 목차

1. [Setup Guide 따라가기 1](#1-setup-guide-따라가기-1)
1. [Setup Guide 따라가기 2](#2-setup-guide-따라가기-2)
1. [Image 바꾸기](#3-image-바꾸기)
1. [GOOGLE ANALYTICS](#4-google-analytics)
  1. [google analytics 추가하기](#41-google-analytics-추가하기)
  1. [google analytics 코드 수정하기](#42-google-analytics-코드-수정하기)
1. [RUBY](#5-ruby)
  1. [ruby 삭제](#51-ruby-삭제)
  1. [ruby 설치](#52-ruby-설치)
  1. [rvm 설치](#53-rvm-설치)
    1. [발생한 오류 목록](#531-발생한-오류-목록)
  1. [윈도우에서 재시작](#54-윈도우에서-재시작)
  1. [2021.12.10 이어서](#55-20211210-이어서)
1. [참고](#참고)

---

## 1. Setup Guide 따라가기 1

Jekyll Moon Theme Setup Guide: <https://github.com/TolgaTatli/Moonrise/>

~~(2025.03.18 기준으로는 아래처럼 작성되어있다.)~~  

1. Fork the Moonrise repo
1. Edit `_config.yml` file
1. Remove sample posts from `_posts` folder and add yours
1. Edit `index.md` file in `about` folder
1. Change repo name to `YourUserName.github.io`  

-> 나눔고딕 폰트 적용까지 성공해서 한글 입력까지 가능했지만 댓글 기능에서 막혀서 레포지토리 지움.  

## 2. Setup Guide 따라가기 2

똑같이 setup guide를 따라해서 댓글 기능부터 추가했음.  
-> 나눔고딕 폰트에 관한 코드를 똑같은 위치에 입력함.  
-> 로컬 레포지토리를 변경해도 github.io에 변경이 늦게되는 듯함.  

## 3. Image 바꾸기

1. favicon image 변경  
2. 둥글고 어두운 분위기를 생각하다가 이상한 나라의 앨리스에서 나오는 체셔캣이 생각남.  
3. 검정톤 깔끔한 분위기의 이미지로 고름.  
4. 이제 원래 있던 이미지 파일들을 전부 찾아서 이미지 크기와 이름들을 똑같이 맞춰서 찾은 이미지를 변경함.  
5. 아직 남은 이미지가 하나 있지만 원하는 분위기의 이미지를 선택했으나 적용하지 않음.  
6. 실제로 적용시키니까 맘에 들지 않아서 다른 체셔캣 이미지로 바꾸면서 시도하는 중.  
7. 뒤에 깔리는 이미지 변경 중.  

## 4. GOOGLE ANALYTICS

### 4.1. google analytics 추가하기

1. google analytics 추가
1. google analytics 가입하기
1. `_config.yml`에 tracking id 추가하기  

```text
"google:
    analytics: tracking_id"
```

### 4.2. google analytics 코드 수정하기

* 변경 전

```html
<!-- Asynchronous Google Analytics snippet -->
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
  ga('create', '{{ site.google.analytics }}', 'auto');  
  ga('require', 'linkid', 'linkid.js');
  ga('send', 'pageview');
</script>
```

* 변경 후

```html
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-QE0BFF2TLD"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-QE0BFF2TLD');
</script>
```

-> 기존에 있던 코드일 때는 구글 애널리틱스 보고서에서 사용자가 counting되지 않았는데, 구글 애널리틱스에서 제공하는 코드로 변경하고 나서는 사용자가 잘 counting되는 모습을 보여줌.

## 5. RUBY

bigdecimal과 관련된 오류가 계속 발생함. 호환성 문제라고 판단. ruby를 재설치하려 함.

### 5.1. ruby 삭제

아래 코드는 ruby를 삭제하는 코드임.

```bash
sudo rm -rf /usr/local/lib/ruby
sudo rm -rf /usr/lib/ruby
sudo rm -f /usr/local/bin/ruby
sudo rm -f /usr/bin/ruby
sudo rm -f /usr/local/bin/irb
sudo rm -f /usr/bin/irb
sudo rm -f /usr/local/bin/gem
sudo rm -f /usr/bin/gem
```

### 5.2. ruby 설치

Ruby 설치 가이드: <https://www.ruby-lang.org/ko/documentation/installation/#apt>

apt (Debian이나 Ubuntu) 설치 명령어: `$ sudo apt-get install ruby-full`  
오류 발생: `cannot load such file -- rubygems.rb (LoadError)`

### 5.3. rvm 설치

설치 명령어
`gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3`  
`\curl -sSL https://get.rvm.io | bash -s stable`  

#### 5.3.1. 발생한 오류 목록

1. 오류

```text
Can't check signature: No public key
GPG signature verification failed for '/home/tester/.rvm/archives/rvm-1.29.12.tgz' - 'https://github.com/rvm/rvm/releases/download/1.29.12/1.29.12.tar.gz.asc'! Try to install GPG v2 and then fetch the public key:
```

`gpg --keyserver hkp://pool.sks-keyservers.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB`  

1. 오류
`gpg: keyserver receive failed: No name`
`\curl -sSL https://rvm.io/mpapis.asc | gpg --import -`  
`sudo \curl -sSL https://rvm.io/mpapis.asc | gpg --import -`  

1. 오류

```text
gpg: key 3804BB82D39DC0E3: 47 signatures not checked due to missing keys
gpg: key 3804BB82D39DC0E3: public key "Michal Papis (RVM signing) <mpapis@gmail.com>" imported
gpg: Total number processed: 1
gpg:               imported: 1
gpg: no ultimately trusted keys found
```

`\curl -sSL https://rvm.io/pkuczynski.asc | gpg --import -`  

1. 오류

```text
gpg: key 105BD0E739499BDB: public key "Piotr Kuczynski <piotr.kuczynski@gmail.com>" imported
gpg: Total number processed: 1
gpg:               imported: 1
```

-> 익숙하지 않은 리눅스보다 윈도우에서 다시 시작하기로 함.

### 5.4. 윈도우에서 재시작

루비를 다운받고 파워쉘에서 `gem install jekyll` -> 오류발생
`gcc.exe: fatal error: cannot execute 'cc1': CreateProcess: No such file or directory`
파워쉘이 아닌  start command prompt with ruby에서 실행하는 것이었음.

윈도우에서는 gem이 호환이 안 되는 것이 많다고 함.

### 5.5 2021.12.10 이어서

망함을 느낀 나는 포맷을 하기로 함.
그래서 윈도우와 리눅스 멀티 부팅한 노트북을 싹 밀고 리눅스를 설치함.
이후 다시 시도
-> 같은 오류 발생
bigdecimal 뭐시기 오류가 또 발생함.
구글링을 열심히 하는 도중 빛과 같은 존재가 나타남.

gemfile에 `gem 'bigdecimal', '1.3.5.'`를 기입하자 마법처럼 다른 오류가 발생함.  
`대충 구글 애널리틱스를 기록한 포스트에서 if문이 끝나지 않는다`라는 오류여서 그냥 if문 부분을 삭제함.

~~너무나 오류와 절친을 맺는 과정이었음.~~

---

## 참고

* [[Github Blog] 방문자 통계(Analytics)하기](https://velog.io/@eona1301/Github-Blog-%EB%B0%A9%EB%AC%B8%EC%9E%90-%ED%86%B5%EA%B3%84Analytics%ED%95%98%EA%B8%B0
)
* [[Google Analytics] 구글 애널리틱스 내부 트래픽 필터링하기](https://nicecarrot2.tistory.com/34)
* [[Google Analytics] 새롭게 도입된 글로벌 사이트 태그(gtag) 알아보기](https://analyticsmarketing.co.kr/digital-analytics/google-analytics/1850/
)
* [Ruby on Rails 설치하기](https://letsget23.tistory.com/entry/Ruby-on-Rails-%EC%84%A4%EC%B9%98%ED%95%98%EA%B8%B0)
* [RVM package for Ubuntu](https://github.com/rvm/ubuntu_rvm)
* [[Github 깃허브/Jekyll] Windows 환경에서 Github Blog 생성하기](https://iingang.github.io/posts/windows-github-set/)
* [[Github 깃허브/Jekyll] Windows 환경에서 Github Blog 생성하기](https://stackoverflow.com/questions/3848357/createprocess-no-such-file-or-directory)
* [[Ruby] 루비 설치하기(Windows 10/윈도우 10) / 예제 맛보기](https://junstar92.tistory.com/5)
* [RubyInstallers](https://rubyinstaller.org/downloads/)
* ~~[404 Not Found](https://likelionsungguk.github.io/20-12-17/jekyll-Blog-%EB%A7%8C%EB%93%9C%EB%8A%94%EA%B2%8C-%EA%B8%80%EC%93%B0%EB%8A%94-%EA%B2%83%EB%B3%B4%EB%8B%A4-%ED%9E%98%EB%93%A0-%EC%82%AC%EB%9E%8C%EB%93%A4%EC%97%90%EA%B2%8C)~~
* ~~[404 Not Found](http://loustler.io/etc/github_pages_blog_google_analytics/)~~
