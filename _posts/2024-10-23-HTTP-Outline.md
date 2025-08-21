---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[NETWORK] HTTP"
excerpt: "모의해킹 취업반 스터디 7기 2주차"

date: 2024-10-23
last_modified_at: 2024-11-01

categories: [NETWORK]
tags: [WEB]
---

# HTTP란?
**HTTP(Hyper Text Transfer Protocol)**: 인터넷 상에서 정보를 주고받을 수 있도록 하는 약속/규칙이다.
~~Hyper Text를 전송하는 Protocol이다.~~
www 상에서 정보를 주고받을 수 있는 프로토콜
클라이언트와 서버 사이에 이루어지는 요청/응답(request/response) 프로토콜

## 1. HTTP 요청
웹 브라우저와 같은 인터넷 통신 플랫폼에서 웹 사이트를 로드하는 데 필요한 정보를 요청하는 방법이다.
* HTTP 요청 구성
    1. HTTP 버전 유형
    2. URL
    3. HTTP METHOD
    4. HTTP 요청 헤더
    5. HTTP 본문(선택 사항)

### 1.1. HTTP METHOD
HTTP 요청 헤더 중 요청 메소드를 통해 클라이언트가 웹 서버에게 요청의 목적과 종류를 알린다.

<table>
    <thead>
        <tr>
            <td>Method</td>
            <td>의미</td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>GET</td>
            <td>서버 측에 자원 요청</td>
        </tr>
        <tr>
            <td>HEAD</td>
            <td>HTTP 헤더 정보만 수신</td>
        </tr>
        <tr>
            <td>POST</td>
            <td>서버로 자원 전송</td>
        </tr>
        <tr>
            <td>PUT</td>
            <td>요청된 자원 갱신</td>
        </tr>
        <tr>
            <td>DELETE</td>
            <td>요청된 자원 삭제</td>
        </tr>
        <tr>
            <td>CONNECT</td>
            <td>요청한 자원에 대해 양방향 연결 시작</td>
        </tr>
        <tr>
            <td>OPTIONS</td>
            <td>응답 가능한 HTTP 메소드 요청</td>
        </tr>
        <tr>
            <td>TRACE</td>
            <td>원격지 서버에 루프백 테스트</td>
        </tr>
        <tr>
            <td>PATCH</td>
            <td>자원의 부분적인 수정</td>
        </tr>
    </tbody>
</table>

### 1.2. HTTP 요청 헤더
HTTP 헤더에는 키값 쌍에 저장된 텍스트 정보가 포함되어 있으며 헤더는 모든 HTTP 요청에 포함된다. 이러한 헤더는 클라이언트가 사용하는 브라우저 및 요청되는 데이터와 같은 핵심 정보를 전달한다.
<img src = "https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-14-1.jpg?raw=true">

### 1.3. HTTP 요청 본문
요청의 본문은 요청에서 전송되는 정보의 '본문'을 포함하는 부분이다. HTTP 요청의 본문에는 사용자 이름 및 비밀번호 또는 양식에 입력된 기타 데이터와 같이 웹 서버에 제출되는 모든 정보가 포함된다.

## 2. HTTP 응답
서버는 클라이언트로부터 요청이 오면 응답 헤더의 정보와 바디의 데이터를 포함해 요청에 대한 응답을 한다.
* HTTP 응답 구성
    1. HTTP 상태 코드
    2. HTTP 응답 헤더
    3. HTTP 본문(선택 사항)

### 2.1. HTTP 응답 코드(상태 코드)
<table>
    <thead>
        <tr>
            <td>구분</td>
            <td>응답 코드</td>
            <td>응답 메시지</td>
            <td>의미</td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>1xx: 정보</td>
            <td>100</td>
            <td>Continue</td>
            <td>진행 중</td>
        </tr>
        <tr>
            <td rowspan = "2">2xx: 성공</td>
            <td>200</td>
            <td>OK</td>
            <td>요청에 대한 성공</td>
        </tr>
        <tr>
            <!-- <td></td> -->
            <td>201</td>
            <td>Created</td>
            <td>요청 자원이 정상적으로 생성이 됨</td>
        </tr>
        <tr>
            <td rowspan = "2">3xx: 리다이렉션</td>
            <td>301</td>
            <td>Moved Permanently</td>
            <td>요청한 자원이 새 url에 존재</td>
        </tr>
        <tr>
            <!-- <td></td> -->
            <td>302</td>
            <td>Found</td>
            <td>임시적으로 주소가 바뀌었을 경우</td>
        </tr>
        <tr>
            <td rowspan = "4">4xx: 클라이언트 오류</td>
            <td>400</td>
            <td>Bad Request</td>
            <td>잘못된 요청</td>
        </tr>
        <tr>
            <!-- <td></td> -->
            <td>401</td>
            <td>Unauthorized</td>
            <td>권한 없는 요청</td>
        </tr>
        <tr>
            <!-- <td></td> -->
            <td>403</td>
            <td>Forbidden</td>
            <td>서버에서 해당 자원에 대한 접근 금지</td>
        </tr>
        <tr>
            <!-- <td></td> -->
            <td>404</td>
            <td>Not Found</td>
            <td>요청 자원이 서버에 존재하지 않음</td>
        </tr>
        <tr>
            <td rowspan = "4">5xx: 서버 오류</td>
            <td>500</td>
            <td>Internal Server Error</td>
            <td>내부 서버 오류</td>
        </tr>
        <tr>
            <!-- <td></td> -->
            <td>502</td>
            <td>Bad Gateway</td>
            <td>게이트웨이로부터 잘못된 응답 수신</td>
        </tr>
        <tr>
            <!-- <td></td> -->
            <td>503</td>
            <td>Service Unavailable</td>
            <td>현재 서버를 사용할 수 없음</td>
        </tr>
        <tr>
            <!-- <td></td> -->
            <td>504</td>
            <td>Gateway Timeout</td>
            <td>게이트웨이가 응답을 받지 못함</td>
        </tr>
    </tbody>
</table>

### 2.2. HTTP 응답 헤더란?
HTTP 요청과 마찬가지로 HTTP 응답에는 응답 본문에서 전송되는 데이터의 언어 및 형식과 같은 중요한 정보를 전달하는 헤더가 함께 제공된다.
<img src = "https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-11-14-2.jpg?raw=true">

### 2.3. HTTP 응답 본문
'GET' 요청에 대한 성공적인 HTTP 응답에는 일반적으로 요청된 정보가 포함된 본문이 있다. 대부분의 웹 요청의 경우 이는 웹 브라우저에서 웹 페이지로 변환되는 HTML 데이터다.

# HTTP/1.X와 HTTP/2
* HTTP/1.X: 199X년 개발
* HTTP/2: 2015년 개발
* HTTP/1.X에서 HTTP/2로 개발하면서 해결하고자 한 것들
    1. latency 감소 -> 멀티플렉싱(Multiplexing)
    2. 서버에서 클라이언트로 먼저 데이터를 보낼 수 있는 방법 -> 서버 푸시(Server Push)
    3. 네트워크 통신에 필요한 데이터량 감소 -> 헤더 압축(Header Compression)

## 1. 멀티플렉싱(Multiplexing)
멀티플렉싱이란 **여러 개의 입력을 하나의 출력으로 만들어주는 기능**이다.
~~N -> 1~~
http/1.1은 한 개의 연결 당 한 개의 응답만 보낼 수 있었다.
http/2에서는  한 개의 연결에서 N 개의 응답을 보낼 수 있다.
~~1차선에서 8차선 고속 도로된 느낌~~
 
## 2. 서버 푸시(Server Push)
일반적으로 서버는 클라이언트가 요청하는 경우에만 클라이언트 장치에 콘텐츠를 제공한다.
그러나 이 접근 방식은 클라이언트가 요청해야 하는 수십 개의 개별 리소스를 포함하는 최신 웹 페이지에서는 항상 실용적인 것은 아니다.
HTTP/2는 클라이언트가 요청하기 전에 서버가 클라이언트에 콘텐츠를 "푸시"할 수 있도록 하여 이 문제를 해결한다.
서버는 또한 Bob이 모든 것을 보내기 전에 Alice에게 소설의 목차를 보낸 경우와 같이, 예상되는 콘텐츠를 푸시한 내용을 클라이언트에게 알려주는 메시지를 보낸다.

## 3. 헤더 압축(Header Compression)
작은 파일은 큰 파일보다 더 빨리 로드된다.
웹 성능 속도를 높이기 위해 HTTP/1.1 및 HTTP/2는 모두 HTTP 메시지를 압축하여 더 작게 만듭니다.
그러나 HTTP/2는 HTTP 헤더 패킷에서 중복 정보를 제거하는 **HPACK**이라는 고급 압축 방법을 사용합니다.
이렇게 하면 모든 HTTP 패킷에서 몇 바이트가 제거된다.
단일 웹 페이지를 로드하는 데 관련되는 HTTP 패킷의 양을 고려할 때, 이러한 바이트는 빠르게 합산되어 로드 속도가 빨라집니다.

# Q1. http/1.1이랑 http/2랑 호환 X?
ALPN protocol (Application Layer Protocol Negotiation)
HTTP2를 사용하는 쪽에서 TLS connection을 통해 상대측에게 '야, 너 HTTP2 가능하냐?'라고 물어봐서 무슨 말을 할 수 있는 지 확인하기 때문에 상관이 없다고 한다. 


# 참고
* [http란?](https://www.cloudflare.com/ko-kr/learning/ddos/glossary/hypertext-transfer-protocol-http/)
* [http란?](https://ko.wikipedia.org/wiki/HTTP)
* [hypertext](https://ko.wikipedia.org/wiki/%ED%95%98%EC%9D%B4%ED%8D%BC%ED%85%8D%EC%8A%A4%ED%8A%B8)
* [http/1.1 vs http/2](https://www.cloudflare.com/ko-kr/learning/performance/http2-vs-http1.1/)
* [http/1.1 vs http/2](https://blog.bespinglobal.com/post/http1-1-http2/)
* [http/1.1 vs http/2](https://seo-tory.tistory.com/82)
* [multiplexing](https://12bme.tistory.com/741)
* [http/1.1과 http/2 호환](https://stackoverflow.com/questions/36500050/what-if-an-http-1-1-client-talk-to-an-http-2-only-server-and-what-if-an-http-2-c)
* [http/1.1과 http/2 호환](https://stackoverflow.com/questions/63856886/if-a-browser-is-http1-x-compatible-is-it-also-http2-compatable)
* [웹, http, burp suite](https://fis.kr//ko/major_biz/cyber_safety_oper/attack_info/security_news?articleSeq=2504)
* [HTTP CONNECT METHOD](https://developer.mozilla.org/ko/docs/Web/HTTP/Methods/CONNECT)
* [HTTP PATCH METHOD](https://developer.mozilla.org/ko/docs/Web/HTTP/Methods/PATCH)