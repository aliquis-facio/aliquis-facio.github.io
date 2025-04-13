---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[WEB] 웹 개요"
excerpt: "모의해킹 취업반 스터디 7기 1주차"

date: 2024-10-17
last_modified_at: 

categories: [WEB]
tags: [WEB]
---

# 목차
1. [웹(Web)이란?](#웹web이란)
1. [웹 서버(Web Server)란?](#웹-서버web-server란2)
    1. [APM이란?](#1-apm이란3)
    1. [웹서버 동작](#2-웹서버-동작)
    1. [URL VS URI](#21-urluniform-resource-locator-vs-uriuniform-resource-identifier8)
    1. [URL](#211-urluniform-resource-locator910)
    1. [URI](#212-uriuniform-resource-identifier)
    1. [URL과 www.naver.com과는 너무 다르다~](#213-url과-wwwnavercom과는-너무-다르다)
    1. [Web Root](#22-web-root)
    1. [index.html](#23-indexhtml)
1. [참고](#참고-사이트)

# 1. 웹(Web)이란?
**월드 와이드 웹(WWW, World Wide Web)**:  
인터넷에 연결된 사용자들이 서로의 정보를 공유할 수 있는 공간으로, 인터넷 상의 인기 있는 하나의 서비스이다.  
즉, `웹(Web) ⊂ 인터넷(Internet)`이다.  
<img src = "https://github.com/aliquis-facio/aliquis-facio.github.io/blob/master/_image/2024-10-18-1.jpg?raw=true">

# 2. 웹 서버(Web Server)란?  
하드웨어적 서버에 접속한 사용자에게 웹 서비스를 제공하기 위하여 사용되는 소프트웨어 서버의 한 종류.

## 2.1. APM이란?
웹 서비스를 구현하기 위해서는 웹서버, WAS, 데이터베이스가 필요하다.  
APM: 주로 쓰였던 조합인 Apache, Php, MySql의 앞 글자를 따서 APM이라 부른다.  

1. Apache  
<img src = "https://github.com/aliquis-facio/aliquis-facio.github.io/blob/master/_image/2024-10-18-2.png?raw=true" title = "Apache Logo">  
오픈 소스 HTTP 웹 서버 프로그램으로 정적인 데이터를 처리하는 웹 서버이다.  
<br>
2024 글로벌 웹 서버 시장 점유율
<img src = "https://github.com/aliquis-facio/aliquis-facio.github.io/blob/master/_image/2024-10-19-1.png?raw=true" title = "2024 글로벌 웹 서버 시장 점유율">

2. PHP
<img src = "https://github.com/aliquis-facio/aliquis-facio.github.io/blob/master/_image/2024-10-18-3.png?raw=true" title = "PHP Logo">  
웹 서버상에서 쓰는 언어로, 일반 HTML + CSS + JS로는 DB 접속 구현 못해서 쓰는 언어다.

3. MySQL
<img src = "https://github.com/aliquis-facio/aliquis-facio.github.io/blob/master/_image/2024-10-18-4.png?raw=true" title = "MySQL Logo">
오픈소스 관계형 데이터베이스 관리 시스템(RDBMS)으로 행과 열로 구성된 테이블에 데이터를 저장한다.  
SQL(쿼리 언어)를 사용하여 데이터를 정의, 조작, 제어, 쿼리할 수 있다.  

## 2.2. 웹서버 동작
어떻게 웹 서버에 파일을 달라고 하는 것일까?

### 2.2.1. URL(Uniform Resource Locator) VS URI(Uniform Resource Identifier)
#### 2.2.1.1. URL(Uniform Resource Locator)
웹에서 주어진 고유 리소스 주소로 웹 서버로 자료를 요청하는 링크이다.  
URL = 식별자 + 위치  
URL 표현방법: `scheme://<user>:<password>@<host>:<port>/<url-path>`  
HTTP URL의 scheme:  
`http://<host>:<port>/<path>?<searchpart>`  
= `[프로토콜]://[도메인 주소] or [IP 주소]:[포트 번호]/[파일 경로]`

#### 2.2.1.2. URI(Uniform Resource Identifier)
인터넷에 있는 자원을 나타내는 유일한 주소이다.  
URI = 식별자 `URI ⊃ URL, URN`  
URI 표현방법:  
`scheme:[//[user[:password]@]host[:port]][/path][?query][#fragment]`

#### 2.2.1.3. URL과 www.naver.com과는 너무 다르다~
https://www.naver.com/ -> 포트 번호가 왜 없냐?  
포트(Port)란?  
TCP나 UDP 에서 어플리케이션이 상호구분을 위해서 사용하는 번호이다. IP 내에서 프로세스 구분을 하기 위해서 사용한다. 쉽게말하면, 각 프로토콜의 데이터가 통하는 논리적 통로이다.  
Well Known Port  
<table>
    <tbody>
        <tr>
            <td>FTP</td>
            <td>20, 21 (TCP)</td>
        </tr>
        <tr>
            <td>SSH</td>
            <td>22 (TCP)</td>
        </tr>
        <tr>
            <td>텔넷</td>
            <td>23 (TCP)</td>
        </tr>
        <tr>
            <td>SMTP</td>
            <td>25 (TCP)</td>
        </tr>
        <tr>
            <td>DNS</td>
            <td>53 (TCP/UDP)</td>
        </tr>
        <tr>
            <td>DHCP</td>
            <td>67 (UDP)</td>
        </tr>
        <tr>
            <td>HTTP</td>
            <td>80 (TCP)</td>
        </tr>
        <tr>
            <td>HTTPS</td>
            <td>443 (TCP)</td>
        </tr>
    </tbody>
</table>

http, https의 경우 포트 번호 생략이 가능하다(Common Port의 경우 생략 가능하다).

하지만 포트 번호의 경우 강제성이 없기 때문에 다른 포트로도 이용할 수는 있다. 그럴 경우 꼭 포트 번호를 명시해야 한다.

* NAT(Network Address Translation: IP 패킷에 있는 출발지 및 목적지의 IP 주소와 TCP/UDP 포트 숫자 등을 바꿔 재기록하면서 네트워크 트래픽을 주고 받게 하는 기술이다.
현재 32비트 형식으로 사용 가능한 IP 주소 수는 늘어나는 인터넷 액세스 요청을 충족시키기에 부족하다. -> NAT 기술을 이용하면 하나의 공인 IP 주소를 사용해 여러 대의 호스트가 인터넷에 접속할 수 있다.

### 2.2.2. Web Root

<table>
    <tbody>
        <tr>
            <td>프로토콜</td>
            <td>http</td>
        </tr>
        <tr>
            <td>ip 주소</td>
            <td>192.168.100.100</td>
        </tr>
        <tr>
            <td>포트 번호</td>
            <td>80</td>
        </tr>
    </tbody>
</table>

웹서버 파일 구조는 밑과 같을 때  
<img src = "https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-10-18-5.jpg?raw=true" title = "웹서버 디렉토리 구조">

1. Web Basic 안에서 웹서버를 실행했을 경우 (Root File이 Web Basic)
c.txt 파일 열기 위해서 url을 어케 입력해야 할까?  
-> http://192.168.100.100:80/c.txt
2. dir 안에서 웹서버를 실행했을 경우 (Root File이 Web Basic/dir)
c.txt 파일 열기 위해서 url을 어케 입력해야 할까?  
-> http://192.168.100.100:80/../c.txt         (X)
-> root 위로는 못 올라간다라 옹...  

결론: 그러면 web root 경로를 좀 더 상위 폴더로 변경할 수 있다면 접속할 수 있는 부분이 많겠네? web root 경로가 무척 중요하다

### 2.2.3. index.html
웹 브라우저가 자신의 컴퓨터에 설치되어 있는 웹 서버에 접속해서 "index.html 파일을 줘"라고 얘기하는 것이다.  
그럼 웹 서버는 htdocs라는 디렉토리에서 파일을 찾도록 설정이 기본적으로 되어 있는 상태이다.  
웹 서버는 설정이 되어 있는대로 htdocs라는 폴더에서 index.html이라는 파일을 읽어서 그 파일을 웹 브라우저에게 전송해주면 웹 브라우저는 그것을 해석해서 화면에 표시해주게 된다
디렉토리별로 index 파일이 적용된다  

기본적으로 index.html을 제공한다. 그렇다면 index 파일이 없다면??  
<img src = "https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-10-18-6.png?raw=true" title = "index.html 없을 때">
404 Not Found를 볼 줄 알았는데 예상 외다.

# 참고
* [웹이란?](https://www.tcpschool.com/webbasic/www)
* [웹 서버와 WAS의 차이를 쉽게 알아보자](https://codechasseur.tistory.com/25)
* [APM: Apache, PHP, MySQL의 역할과 상호작용 이해하기](https://selfinvestfriends.tistory.com/160/)
* [아파치 HTTP 서버](https://namu.wiki/w/%EC%95%84%ED%8C%8C%EC%B9%98%20HTTP%20%EC%84%9C%EB%B2%84)
* [APM(Apache, Php, MySql)란?](https://gwonbookcase.tistory.com/25/)
* [MySQL이란 무엇인가요?](https://cloud.google.com/mysql?hl=ko)
* [URI와 URL, 어떤 차이점이 있나요?](https://www.elancer.co.kr/blog/detail/74)
* [URL이란?](https://developer.mozilla.org/ko/docs/Learn/Common_questions/Web_mechanics/What_is_a_URL)
* [URL](https://ko.wikipedia.org/wiki/URL)
* [포트](https://namu.wiki/w/%ED%8F%AC%ED%8A%B8)
* [포트 번호 (PORT NUMBER)](https://m.blog.naver.com/hanmaru64/140188138042)
* [포트(PORT)란?](https://sangbeomkim.tistory.com/101)
* [포트(Port) 개념 정리 및 종류](https://ittrue.tistory.com/185)
* [NAT(Network Address Translation) 정보](https://www.ibm.com/docs/ko/networkmanager/4.2.0?topic=discoveries-about-network-address-translation)
* [NAT(Network Address Translation) - 네트워크 주소 변환](https://www.stevenjlee.net/2020/07/11/%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0-nat-network-address-translation-%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%81%AC-%EC%A3%BC%EC%86%8C-%EB%B3%80%ED%99%98/)
* [(생활코딩) 웹서버와 http](https://developer-yeony.tistory.com/22)