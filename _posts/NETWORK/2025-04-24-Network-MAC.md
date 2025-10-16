---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[NETWORK] MAC 계층"
excerpt: "MAC 계층의 개념과 이슈, 프로토콜 분류"

date: 2025-04-24
last_modified_at: 2025-05-14

categories: [NETWORK]
tags: [COMPUTER NETWORK, NETWORK, TIL]
---

# 목차
1. [들어가면서](#1-들어가면서)
    1. [데이터 통신 방식](#11-데이터-통신-방식)
1. [주요 이슈](#2-mac-protocol의-주요-issues)
1. [주요 과제](#3-mac-protocol의-주요-과제)
1. [MAC 프로토콜](#4-mac-프로토콜)
    1. [MAC 프로토콜 분류](#41-mac-protocol-분류)
1. [참고](#참고)

# Media Access Control
**MAC 계층**: 물리 계층 위에 위치하며, 어떤 장치가 언제 데이터를 전송할 수 있는지를 결정한다.

## 1. 들어가면서
데이터 링크 계층을 이해하기 위해, 다음 두 소계층으로 나눌 수 있다.

| 소계층 | 주요 기능 |
| --- | --- |
| Data Link Control Sublayer | Framing, Error Control, Flow Control |
| Media Access Control Sublayer | 매체 접근 제어 (MAC) |

### 1.1. 데이터 통신 방식
채널 서비스 장치(CSU, Channel Service Unit): 디지털 전용 회선 서비스의 회선 종단 장치

![그림](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-04-24-1.jpg?raw=true)

* **Point-to-Point Link**: 1:1 전용 회선 -> MAC 프로토콜 불필요
* **Multi-Point/Broadcast/Shared Link**: 다수 공유 회선 -> Broadcast Link에서 한 번에 한 쌍씩(송신 장치와 수신 장치)가 link를 독점적으로 사용한다 -> MAC 프로토콜 필요

![그림](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-04-24-2.jpg?raw=true)

## 2. MAC Protocol의 주요 issues
* **매체 접근 시점 결정**: medium(매체)에 언제 접근할거냐?
* **매체 상태 대응**: medium(매체)가 바쁘면 뭐할거냐?
* **전송 성공/실패 판단**: 전송이 성공했는지 실패했는지 어떻게 알아낼거냐?
* **충돌 처리**: 만약에 전송 실패(충돌)했다면 뭐할거냐?

## 3. MAC Protocol의 주요 과제
1. 공유하는 process 관리
    1. 노드들간의 충돌 예방
    1. 충돌 관리
1. 데이터 전송

* **다수의 장치 간의 매체 공유**: 여러 장치가 같은 전송 매체를 사용할 때, 어떤 장치가 데이터를 보낼지 결정하는 규칙을 정해야 한다. 예를 들어, 이더넷 네트워크에서는 여러 컴퓨터가 동일한 유선 네트워크를 공유한다.
* **충돌 방지 및 효율적인 전송**: 동일 매체를 여러 장치가 동시에 사용하면 충돌이 발생할 수 있다. 충돌을 피하고, 효율적으로 전송할 수 있는 규칙을 마련해야 한다.
* **공정성 유지**: 여러 장치가 공평하게 매체를 사용할 수 있도록 전송 우선순위와 전송 기회를 공정하게 배분해야 한다.

## 4. MAC 프로토콜
**MAC 프로토콜**: 네트워크 내 여러 장치가 동일한 통신 매체를 사용할 때 어떤 방식으로 전송 권한을 부여할 것인지를 정의한다.

MAC 프로토콜은 크게 채널 접근 방식을 제어하는 규칙에 따라 나뉜다.

### 4.1. MAC Protocol 분류
1. Random Access Protocol
    * ALOHA
    * CSMA(Carrier Sense Multiple Access)
    * CSMA/CD(CSMA/Collision Detection)
    * CSMA/CA(CSMA/Collision Avoidance)
1. Controlled Access Protocol
    * Reservation
    * Polling
    * Token Passing
1. Channelization Protocol
    * FDMA(Frequency Division Multiple Access)
    * TDMA(Time DMA)
    * CDMA(Code DMA)

# 참고
* [CSU - 정보통신용어사전](https://terms.tta.or.kr/dictionary/dictionaryView.do?subject=%EC%B1%84%EB%84%90+%EC%84%9C%EB%B9%84%EC%8A%A4+%EC%9E%A5%EC%B9%98)
* [CSU/DSU (Channel Service Unit/Digital Service Unit)](https://blog.naver.com/jjws666/57133035)
* [데이터 링크 계층의 역할과 이더넷](https://velog.io/@kimmainsain/%EB%AA%A8%EB%91%90%EC%9D%98-%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%81%AC-%EC%A0%95%EB%A6%AC-4)
* *Data Communications and Networking with TCP/IP Protocol Suite, Sixth Edition* - Behrouz A, Forouzan