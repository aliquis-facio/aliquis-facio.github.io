---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[GITHUB PAGES] github.io 만들기 1"
excerpt: "항상 느낍니다. 왜 안되는거냐?"

date: 2021-11-02
last_modified_at: 2025-03-18

categories: [BLOG]
tags: [BLOG]
---

# 목차
1. [RUBY](#1-ruby)
    1. [설치](#1-ruby-설치)
1. [JEKYLL](#2-jekyll)
    1. [설치](#1-jekyll-설치)
    1. [실행](#2-jekyll-실행)
    1. [서버 실행](#3-jekyll-서버-실행)
    1. [서버 접속 확인](#4-jekyll-서버-접속-확인)
    1. [테마 고르기](#5-jekyll-theme-고르기)
    1. [적용하기](#6-jekyll-적용하기)
1. [GITHUB](#3-github)
    1. [레포지토리 만들기](#1-github에-저장소repository-생성하기)
    1. [.gitignore 설정하기](#2-gitignore-설정하기)
    1. [로컬 브랜치와 원격 브랜치와 연결하기](#3-githubio-블로그의-로컬-저장소와-github-저장소를-연결하기)
    1. [블로그 확인하기](#4-githubio-블로그-확인하기)

# Github.io 만들기 1
## 1. RUBY
### 1) ruby 설치
ruby 설치 링크: <https://www.ruby-lang.org/ko/documentation/installation/>  
설치 명령어: `sudo apt-get install ruby-full`

## 2. JEKYLL
### 1) jekyll 설치
`sudo gem install jekyll`

### 2) jekyll 실행
`~/blog$ jekyll new github_username.github.io`  
명령어 실행 후 github 패스워드를 입력해야 함

### 3) jekyll 서버 실행
`~/blog/github_username.github.io$ jekyll serve`  
오류: _Could not find gem 'minima (~> 2.5)' in any of the gem sources listed in your Gemfile. (Bundler::GemNotFound)'_  
`sudo gem install minima` -> minima 설치

### 4) jekyll 서버 접속 (확인)
`~/blog/github_username.github.io$ jekyll serve` -> 실행됨  
브라우저에 127.0.0.1:4000 또는 localhost:4000 입력  
-> 기본테마 블로그가 보인다.

### 5) jekyll theme 고르기
jekyll theme site: <http://jekyllthemes.org/>  
내가 고른 것 -> <http://jekyllthemes.org/themes/dark-poole/>  
내 취향의 themes  
* <http://jekyllthemes.org/themes/agency/>
* <http://jekyllthemes.org/themes/frisco/>

### 6) jekyll 적용하기
1. 원하는 Jekyll Theme를 다운로드(.zip)한다.
    Jekyll 사이트에서 직접 다운로드한다. 혹은 연결된 GitHub에서 Clone or download -> Download ZIP 을 통해 다운로드한다.
1. 압축을 푼다.
1. Jekyll 블로그를 저장한 로컬 디렉터리에 압축 푼 내용을 모두 복사하여 넣는다.
1. Gemfile, Gemfile.lock은 삭제한다.

#### 발생한 오류 목록
`~/blog/github_username.github.io$ jekyll serve`
1. _Dependency Error: Yikes! It looks like you don't have jekyll-gist or one of its dependencies installed. In order to use Jekyll as currently configured, you'll need to install this gem. If you've run Jekyll with `bundle exec`, ensure that you have included the jekyll-gist gem in your Gemfile as well. The full error message from Ruby is: 'cannot load such file -- jekyll-gist' If you run into trouble, you can find helpful resources at https://jekyllrb.com/help/!_

readme를 읽어봄.
* Install dependencies
    `sudo gem install jekyll jekyll-gist jekyll-sitemap jekyll-seo-tag`
* Install bundler
    `sudo gem update --system`
    `sudo gem install bundler`

1. *Loading the rubygems/defaults/operating_system.rb file caused an error. This file is owned by your OS, not by rubygems upstream. Please find out which OS package this file belongs to and follow the guidelines from your OS to report the problem and ask for help.*  
-> <http://jekyllthemes.org/themes/dark-poole/>에서 theme을 다시 다운받아서 옮겨봄.

1. _Warning: the running version of Bundler (2.1.2) is older than the version that created the lockfile (2.1.4). We suggest you to upgrade to the version that created the lockfile by running `gem install bundler:2.1.4`._  
-> `sudo gem install bundler:2.1.4`

1. *Could not find public_suffix-4.0.5 in any of the sources (Bundler::GemNotFound)*  
-> `sudo gem install public_suffix -v 4.0.5`

1. *Could not find addressable-2.7.0 in any of the sources (Bundler::GemNotFound)*  
-> `sudo gem install addressable -v 2.7.0`

1. *Could not find concurrent-ruby-1.1.6 in any of the sources (Bundler::GemNotFound)*  
-> `sudo gem install concurrent-ruby -v 1.1.6`

1. *Could not find em-websocket-0.5.1 in any of the sources (Bundler::GemNotFound)*  
-> `sudo gem install em-websocket -v 0.5.1`

~~슬슬 머리가 멍해지기 시작함.~~
1. *Could not find faraday-1.0.1 in any of the sources (Bundler::GemNotFound)*  
-> `sudo gem install faraday -v 1.0.1`

1. *Could not find ffi-1.13.1 in any of the sources (Bundler::GemNotFound)*  
-> `sudo gem install ffi -v 1.13.1`

~~알파벳 순으로 나오고 있다는 것을 깨닳음. 절망스러움.~~
1. *Could not find i18n-1.8.5 in any of the sources (Bundler::GemNotFound)*  
-> `sudo gem install i18n -v 1.8.5`

1. *Could not find rb-fsevent-0.10.4 in any of the sources (Bundler::GemNotFound)*  
-> `sudo gem install rb-fsevent -v 0.10.4`

1. *Could not find listen-3.2.1 in any of the sources (Bundler::GemNotFound)*  
-> `sudo gem install listen -v 3.2.1`

~~귀찮기 시작해서 버그 문장에서 명령어 문자으로 바꾸는 프로그램 작성함~~
1. *Could not find rexml-3.2.4 in any of the sources (Bundler::GemNotFound)*  
`sudo gem install rexml -v 3.2.4`

1. *Could not find kramdown-2.3.0 in any of the sources (Bundler::GemNotFound)*  
`sudo gem install kramdown -v 2.3.0`

1. *Could not find rouge-3.21.0 in any of the sources (Bundler::GemNotFound)*  
`sudo gem install rouge -v 3.21.0`

1. *Could not find unicode-display_width-1.7.0 in any of the sources (Bundler::GemNotFound)*  
`sudo gem install unicode-display_width -v 1.7.0`

1. *Could not find terminal-table-1.8.0 in any of the sources (Bundler::GemNotFound)*  
`sudo gem install terminal-table -v 1.8.0`

1. *Could not find jekyll-4.1.1 in any of the sources (Bundler::GemNotFound)*  
`sudo gem install jekyll -v 4.1.1`

1. *Could not find octokit-4.18.0 in any of the sources (Bundler::GemNotFound)*  
`sudo gem install octokit -v 4.18.0`

1. *Could not find jekyll-paginate-1.1.0 in any of the sources (Bundler::GemNotFound)*  
`sudo gem install jekyll-paginate -v 1.1.0`

1. *Could not find jekyll-seo-tag-2.6.1 in any of the sources (Bundler::GemNotFound)*  
`sudo gem install jekyll-seo-tag -v 2.6.1`

~~드디어 다른 종류의 오류... ㅎㅎ~~
1. *You have already activated public_suffix 4.0.6, but your Gemfile requires public_suffix 4.0.5. Prepending `bundle exec` to your command may solve this. (Gem::LoadError)*  
`bundle exec jekyll serve`

이는, bundle exec를 앞에 붙이고 시작할 경우, 해당 젬을 실행하기 위해 필요한 정확한 라이브러리들을 가져와서 (일종의 가상환경이라고 생각해도 될듯) 실행하게 해준다. 이렇게 하면 되기는 함.
-> (하지만 ^^) 오류:
1. *Build Warning: Layout 'home' requested in index.markdown does not exist.*  
index.markdown을 열음.

1. *'/favicon.ico' not found.*  
/assets 폴더 내에 favicon.ico 파일 넣기 (이미 존재함)
_includes 폴더 내에 head.html의 위쪽에 아래 내용을 추가
->
`<link rel="icon" type="image/png" href="/assets/favicon.ico">`

1. *'/favicon.ico' not found.*  
-> favicon.ico를 직접 열어봄.  
-> favicion.ico의 헤더가 망가졌다고 나옴.  
-> 직접 .ico 파일을 만들기로 함.  
-> png2ico 웹서비스 이용  

`bundle exec jekyll serve`
-> 오류는 뜨지 않으나 흰 화면만 나옴.
-> index.md 삭제 후 진행
-> 정상적으로 theme이 바뀜

## 3. GITHUB
### 1) github에 저장소(repository) 생성하기
GitHub Pages에 .github.io 블로그를 만드는 방법은 단순히 ‘[github 사용자명].github.io’라는 이름의 원격 저장소(Repository)를 만들면 된다.

### 2) .gitignore 설정하기
`~/blog/[github 사용자명].github.io$ vi .gitignore`  
수정 목록  
```
_site/
.sass-cache/
.jekyll-metadata
.jekyll
Gemfile
Gemfile.lock
```

### 3) .github.io 블로그의 로컬 저장소와 github 저장소를 연결하기
<a style="text-decoration: underline" href="https://gmlwjd9405.github.io/2017/10/06/Jekyll-github.io-blog-3.html">블로그</a>를 참조해 만들었기 때문에 'jekyll new [github 사용자명].github.io'를 이용하여 Jekyll 블로그를 로컬에서 실행시킨 사용자이다. 고로 단순히 git의 remote 저장소와 연결해주는 작업만 하면 된다.  

*~/blog/[github 사용자명].github.io*로 이동하여 아래의 명령어를 입력하면 앞으로 git은 해당 디렉터리의 변화를 감지하여 track할 수 있고 로컬에서 작성한 블로그를 GitHub에 호스팅할 수 있다. (git init 명령을 실행한 디렉터리를 working directory라고 부른다.)  

`git init` // 해당 디렉터리 안에 .git이라는 하위 디렉토리를 만든다.  

`git remote add origin [원격 저장소 URL]` // git의 remote 저장소와 연결한다.  

Git이 파일을 관리하게 하려면 저장소에 파일을 추가하고 커밋해야 한다. 아래의 명령으로 파일을 추가하고 커밋한다.  

`git add .`  
`git commit -m "Initial commit"`  
`git push origin master` // 원격 저장소에 변경 내용을 올린다.  

### 4) .github.io 블로그 확인하기
브라우저에서 ‘[github 사용자명].github.io’라고 주소를 입력  
-> 404 not found...  
-> 왜 안되는지 잘 모르겠음  
-> 새로운 방법으로 다시 만들기로 함.

[다음 블로그에서 계속...](/Github-Pages-Making-2/)

# 참고
* [Jekyll을 이용한 .github.io 블로그 만들기[1]](https://gmlwjd9405.github.io/2017/10/06/Jekyll-github.io-blog-1.html)
* [Jekyll을 이용한 .github.io 블로그 만들기[2]](https://gmlwjd9405.github.io/2017/10/06/Jekyll-github.io-blog-2.html)
* [Jekyll을 이용한 .github.io 블로그 만들기[3]](https://gmlwjd9405.github.io/2017/10/06/Jekyll-github.io-blog-3.html)
* [왕초보를 위한 Github 블로그 만들기 (1)](https://zeddios.tistory.com/1222)
* [왕초보를 위한 Github 블로그 만들기 (2) - 테마 적용(with Jekyll)](https://zeddios.tistory.com/1223)
* [GitHub Pages에 Jekyll로 블로그 만들기](https://minacle.github.io/post/create-a-blog-with-jekyll-on-github-pages/)
* [jekyll에 favicon을 추가해줍니다.](https://frhyme.github.io/blog/jekyll_add_Favicon/)
* [jekyll Themes Docs](https://jekyllrb.com/docs/themes/#overriding-theme-defaults)
* [왜 jekyll serve가 안될까?](https://frhyme.github.io/others/jekyll_serve_not_work/)
* [루비/jekyll 설치, bundle update](https://corecode.pe.kr/normal/2020/08/21/ruby_jekyll_install/)