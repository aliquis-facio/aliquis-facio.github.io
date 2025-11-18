---
layout: post
comments: true
sitemap:
  changefreq:
  priority:
title: "[NETWORK] 콘텐츠 전송 네트워크(CDN)"
excerpt: CDN(Content Delivery Network)
date: 2025-11-19
last_modified_at: 2025-11-19
categories:
  - NETWORK
tags:
  - CDN
  - NETWORK
  - EDGE_COMPUTING
---

# 목차

1. [정의](#1-정의)
2. [구조 및 동작](#2-구조-및-동작)
3. [등장 배경](#3-등장-배경)
    1. [1세대: 정적 콘텐츠 전달 (Static Content Delivery)](#31-1세대-정적-콘텐츠-전달-static-content-delivery)
    2. [2세대: 동적 콘텐츠·스트리밍 지원 (Dynamic Content & Streaming)](#32-2세대-동적-콘텐츠스트리밍-지원-dynamic-content--streaming)
    3. [3세대: 보안 중심 CDN (Security-Focused CDN)](#33-3세대-보안-중심-cdn-security-focused-cdn)
    4. [4세대: 엣지 네트워크 & 엣지 컴퓨팅 (Edge Networks)](#34-4세대-엣지-네트워크--엣지-컴퓨팅-edge-networks)
4. [사용 이점](#4-사용-이점)
5. [사용처](#5-사용처)
6. [참고](#참고)

---

# CDN, Content Delivery Network
## 1. 정의

![512x288](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-11-19-00-30-04.png?raw=true)

웹 사이트의 이미지, 영상, JS, CSS 같은 정적 파일을 전 세계 여러 서버에 복제해 두고, 사용자와 가장 가까운 서버에서 대신 전달해 주는 시스템이다.

## 2. 구조 및 동작

![604x275](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-11-19-00-33-17.png?raw=true)

흐름 예시:
1. 사용자가 `example.com/image.png`을 요청한다.
2. DNS가 **CDN 서버 주소**로 유도한다.
3. CDN 엣지 서버에:
    - 캐시가 있으면 → 바로 응답한다. (캐시 히트)
    - 없으면 → 원본 서버(origin)에서 가져와서 저장해 두고, 동시에 유저에게 응답한다. (캐시 미스)
4. 다음 사용자부터는 엣지 서버 캐시에서 바로 응답한다.

## 3. 등장 배경
### 3.1. 1세대: 정적 콘텐츠 전달 (Static Content Delivery)

- **시기**: 1990년대 후반~ (CDN 등장 시점)
- 배경:
    - 1980~90년대: 텍스트 중심 정적 HTML에서 이미지·CSS·JS가 늘면서 “World Wide Wait”라 불릴 정도로 페이지 로딩이 느려졌다.
- 핵심 역할:
    - 이미지, HTML, CSS, JS 같은 **정적 파일을 전 세계 엣지 서버에 캐싱**한다.
    - 사용자와 가까운 서버에서 응답해 **왕복 시간(RTT)·지연(latency) 감소**시킨다.
    - 오리진 서버 부하 및 네트워크 혼잡 완화, 사용자 경험 개선한다.

### 3.2. 2세대: 동적 콘텐츠·스트리밍 지원 (Dynamic Content & Streaming)

- **시기**: 2000년대 초반 이후
- 배경:
    - 다이얼업에서 **광대역(broadband)** 으로 넘어가며 오디오·비디오 스트리밍 수요 급증했다.
    - 2000년대 중반: **YouTube, Netflix, Hulu, Amazon Prime Video**, 그리고 아이폰·안드로이드 등장으로 모바일 인터넷과 스트리밍이 본격화되었다.
    - Web 2.0 시대: 사용자가 **콘텐츠를 소비하고 생성(댓글, 좋아요, 게시글)** 하는 쌍방향 웹이다.
- 핵심 역할:
    - 사용자마다 다른 페이지/데이터를 제공하는 **동적 콘텐츠(dynamic content)** 전달을 지원한다.
        - DB 기반 사이트, 개인화 콘텐츠, 소셜 미디어, 스트리밍 서비스 등.
    - 온디맨드/라이브 비디오 스트리밍을 지원한다. (VoD, Live Streaming)

> 온디맨드(On-Demand): 방송사가 정한 시간에 맞춰 보는 게 아니라, **사용자가 보고 싶을 때 ‘요청하는 순간’ 바로 재생되는 방식**
> 다이얼업(Dial-Up): 공중 교환 전화망(PSTN)을 통하여 상대방과의 데이터 통신을 설정하기 위하여 **전화기의 다이얼**을 돌리거나 버튼을 누르는 것.

### 3.3. 3세대: 보안 중심 CDN (Security-Focused CDN)

- **시기**: 2010년대 전후 (특히 2015년 이후)
- 배경:
    - 2015년 기준 약 30억 명이 온라인 사용자가 5년 만에 50%가 증가했다. → 트래픽 폭발과 함께 공격 표면도 급증했다.
    - 전자상거래, 온라인 결제, 계정 기반 서비스가 확대되어 개인정보/결제정보 보호 이슈가 심각해졌다.
- 핵심 역할:
    - **SSL/TLS 암호화**, **WAF(Web Application Firewall)** , **DDoS 방어** 등 보안 기능을 CDN에 통합했다.
    - CDN이 **리버스 프록시(reverse proxy)** 로 동작하면서, 공격을 엣지에서 차단하고 안전한 트래픽만 백엔드 인프라로 전달한다.

### 3.4. 4세대: 엣지 네트워크 & 엣지 컴퓨팅 (Edge Networks)

- **시기**: 2020년대 (대략 2020년 전후부터 본격화)
- 배경: 실시간/인터랙티브 서비스, IoT, 5G, AI/ML 등으로 **초저지연 요구**가 커졌다.
- 핵심 역할:
    - **엣지 컴퓨팅(edge computing)**: 처리(코드 실행, 간단한 연산)를 사용자 근처의 엣지 서버에서 수행해 지연을 크게 줄인다.
    - 제공 기능 예시:
        - **서버리스/함수형 실행**: 서버 관리 없이 코드만 배포해 엣지에서 실행한다 (Functions at the Edge).
        - **AI 통합**: 콘텐츠 최적화, 사용자 행동 예측, 실시간 위협 탐지 등.
        - **트래픽 스마트 라우팅, 비용 최적화, 고급 이미지/콘텐츠 최적화** 기능.

## 4. 사용 이점

- **웹사이트 로드 시간 개선**:
	- **웹사이트 방문자에 가까운 CDN 서버를 사용하여 콘텐츠를 제공**하므로 페이지 로드 시간이 빨라진다.
	- 사이트 로드가 느리면 방문자는 이탈하기 때문에 CDN은 이탈률을 줄이고 방문자가 사이트에서 보내는 시간을 늘릴 수 있다.
- **대역폭 비용 절감**:
	- 들어오는 모든 웹 사이트 요청은 네트워크 대역폭을 사용하기 때문에 대역폭 비용이 상당히 높다.
	- 캐싱 및 기타 최적화를 통해 **오리진 서버가 제공해야 하는 데이터의 양을 줄여** 웹 사이트 소유자의 호스팅 비용을 절감할 수 있다.
- **콘텐츠 가용성 제고**:
	- 한 번에 너무 많은 방문자가 방문하거나 네트워크 하드웨어 오류가 발생하면 웹 사이트가 중단될 수 있다.
	- CDN 서비스는 **많은 웹 트래픽을 처리하고 웹 서버의 로드를 줄일 수 있다**.
	- 하나 이상의 CDN 서버가 오프라인으로 전환되면 다른 운영 서버가 해당 서버를 대체하여 서비스가 중단되지 않도록 할 수 있다.
- **웹 사이트 보안 강화**:
	- CDN은 **DDoS 완화**, 보안 인증 개선, 기타 최적화를 제공하여 보안을 강화할 수 있다.
	- 분산 서비스 거부(DDoS) 공격은 대량의 가짜 트래픽을 여러 중간 서버 간에 로드를 분산하여 오리진 서버에 미치는 영향을 줄임으로써 이러한 트래픽 급증을 처리할 수 있다.

## 5. 사용처

- 유튜브, 넷플릭스 같은 **영상 서비스**
- 이미지/정적 리소스 많은 **쇼핑몰, 포털, 블로그**
- SPA, React/Vue 빌드 결과물, JS/CSS 배포
- 예: Cloudflare, AWS CloudFront, Akamai, Fastly, 카카오/네이버/KT 등 통신사 CDN

---

# 참고

- [AWS: 콘텐츠 전송 네트워크(CDN)란 무엇인가요?](https://aws.amazon.com/ko/what-is/cdn/)
- [CLOUDFLARE: 콘텐츠 전송 네트워크(CDN)란? | CDN의 작동 방식은?](https://www.cloudflare.com/ko-kr/learning/cdn/what-is-a-cdn/)
- [IBM: CDN(Content Delivery Network)이란?](https://www.ibm.com/kr-ko/think/topics/content-delivery-networks)
- [Gabia: [클라우드 이해] CDN이란?](https://library.gabia.com/contents/infrahosting/8985/)
- [Akamai: CDN(콘텐츠 전송 네트워크)이란 무엇일까요?](https://www.akamai.com/ko/glossary/what-is-a-cdn)
- [Toss: CDN(Content Delivery Network)](https://docs.tosspayments.com/resources/glossary/cdn)
- [GCORE: CDN Evolution: From Static Content to Edge Computing](https://gcore.com/blog/cdn-evolution)
- [AZION: Edge Computing is the Evolution of CDNs](https://www.azion.com/en/learning/cdn/edge-computing-evolution-of-cdn/)
- [정보통신용어사전: 다이얼 업, dial-up](https://terms.tta.or.kr/dictionary/dictionaryView.do?subject=%EB%8B%A4%EC%9D%B4%EC%96%BC+%EC%97%85)