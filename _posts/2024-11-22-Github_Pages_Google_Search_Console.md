---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[GITHUB PAGES] Google Search 등록하기"
excerpt: ""

date: 2024-11-22
last_modified_at: 2024-12-19

categories: [BLOG]
tags: [BLOG]
---

# 1. sitemap.xml 생성하기
1. github.io 루트 디렉토리에 sitemap.xml 생성  
![사진 넣기](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/.png?raw=true)  
2. sitemap.xml에 코드 작성하기  
![사진 넣기](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/.png?raw=true)  
![pre가 무시되니 사진으로 바꿀 수 밖에](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-26-2.png?raw=true)  
-> 블록 코드 형식으로 xml 코드를 붙여놨더니 렌더링되는 과정에서 xml 코드로 인식돼버려서 마크다운이 꼬였다.  
![요렇게 말이다](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-26-1.png?raw=true "이렇게 보였다")  
3. `https://[blog url]/sitemap.xml`로 접속해보기  
<img src = "https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-22-1.png?raw=true">  

# 2. 포스트 내에서 sitemap 설정하기
* lastmod: 마지막 수정일  
~~last_modified_at으로 마지막 수정일을 표기하고 있었는데 바꿔야 할 것 같다.~~  
-> lastmod를 last_modified_at으로 맞춰주었다  
* sitemap.changefreq: 스크랩 주기  
    * always, hourly, daily, weekly, monthly, yearly, never  
* sitemap.priority: 스크랩 우선순위  
    * 특정 url의 상대적 우선순위로 유효 값 범위는 0 ~ 1까지다.  
    * 페이지 기본 우선순위는 0.5이다.  
~~어떻게 사용해야 할 지 감이 안 잡힌다~~  

# 3. robots.txt 생성하기
`robots.txt`은 크롤러가 엑세스할 수 있는 url을 검색엔지 크롤러에게 알려준다  
1. github.io 루트 디렉토리에 robots.txt 생성  
-> 이미 존재해서 패스  
2. robots.txt 파일에 코드 넣기  
    * 변경 전  
    ```
    # Allow crawling of all content
    User-agent: *
    Disallow: 
    ```
  
    * 변경 후  
    ```
    # Allow crawling of all content
    User-agent: *
    Allow: /
    Sitemap: https://aliquis-facio.github.io/sitemap.xml
    ```
  
# 4. Google 검색엔진에 등록하기
1. [Google Search Console](https://search.google.com/search-console) 접속하기
2. URL 접두어
3. 등록하려는 사이트 URL 입력
4. 계속  
<img src = "https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-22-2.png?raw=true">  
내 github.io 처음 페이지는 _layouts/home.html에서 렌더링 되기 때문에 여기에 header 부분에 meta code를 추가해줬다.  

2. sitemap 등록하기
    1. 색인
    2. Sitemaps
    3. 새 사이트맵 추가
    4. sitemap.xml 입력
    5. 제출

# 5. sitemap 등록 상태에서 가져올 수 없음이 나왔다.
1. 색인 생성 요청을 위한 사이트 확인하기(상단 돋보기 부분을 누르면 검색할 수 있다)
    1. http://aliquis-facio.github.io/sitemap.xml -> 안 나오고
    2. https://aliquis-facio.github.io/sitemap.xml -> 결과가 나왔다.
2. 실제 URL 테스트 클릭하기
3. 색인 생성 요청 클릭하기
4. (실제 URL의 색인을 생성할 수 있는 지 표시됨)
5. 며칠 후에 sitemap 등록 상태가 성공으로 변경된다고 함.

<img src = "https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-12-19-1.png?raw=true">  
거의 한 달이 지난 지금 sitemap 등록 상태가 여전해서 18일에 새롭게 시도를 해봤다.  

# 참고
* [github 블로그 SEO 설정하기](https://ch3coo2ca.github.io/2022-05-02/github-blog-seo-settings)
* [Google Search Console 사이트맵 등록 안 될 때](https://gh96.tistory.com/59)
* [구글에 깃허브 블로그(github.io) 노출시키기](https://yongjunism.github.io/tips/how-to-expose-github-blog-to-google.html)
* [구글 서치 콘솔 사이트맵 가져올 수 없음, 4가지 원인과 완벽 해결 가이드라인](https://www.buildableseo.io/blog/google-search-console-sitemap-fetch-error-causes-solutions)
* [구글 서치 콘솔 사이트맵 가져올 수 없음](https://yi-sang.github.io/blog/Blog-GoogleSearchConsoleSitemap)
* [Google Search Console의 사이트맵을 가져올 수 없음 문제를 해결한 과정](https://present.kim/posts/blog/sitemap-issue)
* [[github.io] 블로그 구글 검색 등록하기(SEO 설정)](https://blog.jagaldol.com/blog/blog-google-seo-setting/)
* [구글 서치콘솔 사이트맵 등록이 안 될 때 가져올 수 없음 상태 해결 방법 알려드립니다.](https://gh96.tistory.com/59)