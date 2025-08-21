---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[NETWORK] MAC Protocol 2"
excerpt: "Controlled Access Protocol"

date: 2025-04-30
last_modified_at: 

categories: [NETWORK]
tags: [COMPUTER NETWORK, NETWORK, TIL]
---

# 목차

# Media Access Control
**MAC 프로토콜**: 네트워크 내 여러 장치가 동일한 통신 매체를 사용할 때 어떤 방식으로 전송 권한을 부여할 것인지를 정의한다.

1. Random Access Protocol
1. <mark>Controlled Access Protocol</mark>
1. Channelization Protocol

## Controlled Access Protocol
### Token Passing
Token Passing 방식은 토큰이라는 특수한 패킷이 네트워크를 순차적으로 순회하면서 토큰을 가진 장치만 전송할 수 있는 방식입니다. 이는 충돌을 예방할 수 있는 방식입니다.

작동 원리:

네트워크에서 단 하나의 토큰이 순차적으로 순환하며, 토큰을 가진 장치만 데이터를 전송합니다.

토큰이 없으면 장치는 전송을 기다림.

충돌 없음: 단 하나의 장치만 토큰을 가질 수 있기 때문에 충돌이 발생하지 않습니다.

응용 예: Token Ring 네트워크에서 사용됩니다.

### Polling
Polling은 중앙 제어 장치(예: 서버)가 각 클라이언트 장치에 순차적으로 전송 권한을 부여하는 방식입니다.

작동 원리:

중앙 제어 장치가 모든 장치에 대해 순차적으로 요청합니다.

각 장치는 요청을 받은 경우만 데이터를 전송합니다.

중앙 제어 장치가 다시 요청을 보내는 방식으로, 매번 순차적으로 전송 권한을 부여합니다.

장점: 충돌을 방지하고 효율적인 통제가 가능합니다.

단점: 중앙 제어 장치가 필요하고, 대규모 네트워크에서는 비효율적일 수 있습니다.

# 참고
* *Data Communications and Networking with TCP/IP Protocol Suite, Sixth Edition* - Behrouz A, Forouzan