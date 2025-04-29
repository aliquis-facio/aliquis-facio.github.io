---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[NETWORK] Data Communications란?"
excerpt: "Data Communication 의미, 특징과 요소"

date: 2025-04-24
last_modified_at: 2025-03-28

categories: [NETWORK]
tags: [COMPUTER NETWORK, NETWORK, TIL]
---

# 목차

# Media Access Control
MAC: 네트워크 내 여러 장치가 동일한 통신 매체를 사용할 때 어떤 방식으로 전송 권한을 부여할 것인지를 정의하는 프로토콜이다. MAC 계층은 물리 계층 위에 위치하며, 어떤 장치가 언제 데이터를 전송할 수 있는지를 결정합니다.

## 1. 들어가면서
데이터 링크 계층을 이해하기 위해, 다음 두 소계층으로 나눌 수 있다

| 소계층 | 주요 기능 |
| --- | --- |
| Data Link Control Sublayer | Framing, Error Control, Flow Control |
| Media Access Control Sublayer | 매체 접근 제어 (MAC) |

데이터 통신 방식:

![그림](https://github.com/aliquis-facio/aliquis-facio.github.io/blob/master/_image/2025-04-24-1.jpg?raw=true)

* Point-to-Point Link: 1:1 전용 회선 → MAC 프로토콜 불필요
* Multi-Point/Broadcast/Shared Link: 다수 공유 회선 → MAC 프로토콜 필요

![그림](https://github.com/aliquis-facio/aliquis-facio.github.io/blob/master/_image/2025-04-24-2.jpg?raw=true)

## 2. MAC의 주요 issues
* 매체 접근 시점 결정: medium(매체)에 언제 접근할거냐?
* 매체 상태 처리: medium(매체)가 바쁘면 뭐할거냐?
* 전송 성공/실패 판단: 전송이 성공했는지 실패했는지 어떻게 알아낼거냐?
* 충돌 처리: 만약에 전송 실패(충돌)했다면 뭐할거냐?

## 3. MAC의 주요 과제
다수의 장치 간의 매체 공유:
여러 장치가 같은 전송 매체를 사용할 때, 어떤 장치가 데이터를 보낼지 결정하는 규칙을 정해야 합니다.
예를 들어, 이더넷 네트워크에서는 여러 컴퓨터가 동일한 유선 네트워크를 공유합니다.

충돌 방지 및 효율적인 전송:
동일 매체를 여러 장치가 동시에 사용하면 충돌이 발생할 수 있습니다. 충돌을 피하고, 효율적으로 전송할 수 있는 규칙을 마련해야 합니다.

공정성 유지:
여러 장치가 공평하게 매체를 사용할 수 있도록 전송 우선순위와 전송 기회를 공정하게 배분해야 합니다.

## 4. MAC 프로토콜 종류
MAC 프로토콜은 크게 채널 접근 방식을 제어하는 규칙에 따라 나뉩니다. 여기서는 중요한 MAC 프로토콜과 그들의 작동 원리를 정리해 보겠습니다.

MAC Protocol
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

## Random Access(무작위 접근)/Contention Based(경쟁 기반) 방식
* 모든 노드가 평등하다: 중앙국에 의한 제어가 없다
* 소음에 강함
* 비계획적 전송: 노드가 데이터를 전송할 시간이 미리 정해져 있지 않다.
* 규칙 부재: 다음 전송 노드를 지정하는 규칙이 없다.
* 경쟁 발생: 여러 노드들이 동시에 전송을 시도할 경우 충돌이 발생할 수 있다.

![그림](https://github.com/aliquis-facio/aliquis-facio.github.io/blob/master/_image/2025-04-24-3.png?raw=true)

한 개 이상의 노드가 전송하려고 할 경우, 전송 데이터가 파괴되거나 변형될 수 있다

## Random Access 프로토콜
Random Access 방식에 기반한 대표적인 MAC 프로토콜은 다음과 같습니다:

2.1. ALOHA
ALOHA는 가장 기본적인 Random Access 방식 중 하나로, 장치가 자유롭게 전송을 시도하며 충돌이 발생하면 재전송하는 방식입니다.

Pure ALOHA (순수 ALOHA):
작동 원리: 장치는 언제든지 전송을 시도할 수 있으며, 전송 중에 충돌이 발생하면, 랜덤 시간 후에 재전송을 시도합니다.

문제점: 충돌이 자주 발생할 수 있으며, 트래픽이 많으면 전송 효율성이 낮아집니다.

Throughput: 최대 **18.4%**의 효율성을 가집니다. (효율성 = 18.4%가 최적의 상태)

Slotted ALOHA (슬롯형 ALOHA):
작동 원리: 전송을 시간 슬롯에 맞춰 시도합니다. 각 장치는 정해진 슬롯에 전송을 시도하고, 충돌이 발생하면 랜덤한 슬롯 후에 재전송을 시도합니다.

장점: Pure ALOHA보다 충돌 확률이 낮아지고, 효율성이 **37%**로 증가합니다.

Throughput: 최대 **37%**의 효율성을 가집니다.

2.2. CSMA (Carrier Sense Multiple Access)
CSMA는 장치가 채널을 감지하고 빈 채널에서만 전송하는 방식입니다. 즉, 전송 전에 채널을 감지하고 채널이 비어있을 때만 데이터를 전송합니다.

1-persistent CSMA:
작동 원리: 채널을 감지한 후, 채널이 비어 있으면 바로 전송을 시작합니다. 만약 채널이 사용 중이면, 계속 감지하다가 채널이 비면 바로 전송합니다.

문제점: 채널이 비어 있을 때만 전송하므로, 여러 장치가 동시에 전송을 시도할 경우 충돌이 발생할 수 있습니다.

Non-persistent CSMA:
작동 원리: 채널을 감지하고 채널이 비어 있을 때만 전송하지만, 채널이 사용 중이면 랜덤 시간 후 다시 시도합니다.

장점: 충돌 확률이 낮아지고, 비효율적인 채널 사용을 방지할 수 있습니다.

p-persistent CSMA:
작동 원리: 슬롯 방식으로 채널이 비어 있을 때, 전송 시도를 확률적으로 결정합니다. 전송 시도 확률이 p로 주어집니다.

예를 들어, 확률 p에 따라 전송 시도를 하고, **확률 (1-p)**에 따라 다시 기다린다는 방식입니다.

2.3. CSMA/CD (Carrier Sense Multiple Access with Collision Detection)
CSMA/CD는 충돌 감지를 통해 충돌 발생 시 재전송하는 방식입니다. 이는 이더넷과 같은 유선 네트워크에서 사용됩니다.

작동 원리: 장치는 채널을 감지하고, 채널이 비어 있을 때만 전송합니다. 충돌이 발생하면, 충돌 감지 후 전송을 중지하고, 랜덤 시간 후 재전송합니다.

장점: 충돌을 감지하여 빠르게 재전송을 시도함으로써 전송 효율을 높입니다.

단점: 충돌이 자주 발생하면 효율이 떨어지고, 재전송 시간이 비효율적일 수 있습니다.

3.2. CSMA (Carrier Sense Multiple Access)
CSMA는 네트워크 상의 장치들이 채널을 감지하여 다른 장치가 전송을 하지 않는 경우에만 데이터를 전송하는 방식입니다.

작동 원리:

장치는 채널을 감지하여 사용 중인지를 확인합니다.

채널이 비어있다면, 데이터를 전송합니다.

채널이 사용 중이라면, 대기 후 다시 감지하고 전송을 시도합니다.

문제점: 충돌이 발생할 수 있습니다. 충돌 후 재전송을 위해 Backoff 방식을 사용해야 합니다.

CSMA의 종류:
1-persistent CSMA:

채널이 비어있을 때 전송하며, 채널이 사용 중일 경우에는 계속 기다림.

Non-persistent CSMA:

채널이 비어있을 때만 전송하고, 사용 중일 경우에는 무작위 시간 후에 다시 채널을 감지하고 전송합니다.

p-persistent CSMA:

슬롯 기반으로, 채널이 비어 있을 확률에 따라 전송 시도를 결정합니다.

## Random Access 방식의 장점과 단점
장점:
* 단순성: 구현이 간단하고, 별도의 동기화나 시간 분할 없이 자유롭게 전송할 수 있습니다.
* 자원 효율성: 사용 가능한 대역폭을 동적으로 공유할 수 있어, 사용자 수가 적을 때 효율적입니다.
* 유연성: 네트워크에 새로운 장치가 추가될 때, 동적으로 매체를 사용할 수 있습니다.

단점:
* 충돌 발생: 충돌이 자주 발생할 수 있으며, 충돌이 발생하면 재전송을 해야 하므로 전송 효율이 떨어질 수 있습니다.
* 스케일 문제: 사용자 수가 많을수록 충돌 확률이 높아져, 네트워크가 비효율적으로 변할 수 있습니다.
* 성능 저하: 네트워크 트래픽이 많아지면, Throughput이 급격히 감소할 수 있습니다.

## Token Passing
Token Passing 방식은 토큰이라는 특수한 패킷이 네트워크를 순차적으로 순회하면서 토큰을 가진 장치만 전송할 수 있는 방식입니다. 이는 충돌을 예방할 수 있는 방식입니다.

작동 원리:

네트워크에서 단 하나의 토큰이 순차적으로 순환하며, 토큰을 가진 장치만 데이터를 전송합니다.

토큰이 없으면 장치는 전송을 기다림.

충돌 없음: 단 하나의 장치만 토큰을 가질 수 있기 때문에 충돌이 발생하지 않습니다.

응용 예: Token Ring 네트워크에서 사용됩니다.

## Polling
Polling은 중앙 제어 장치(예: 서버)가 각 클라이언트 장치에 순차적으로 전송 권한을 부여하는 방식입니다.

작동 원리:

중앙 제어 장치가 모든 장치에 대해 순차적으로 요청합니다.

각 장치는 요청을 받은 경우만 데이터를 전송합니다.

중앙 제어 장치가 다시 요청을 보내는 방식으로, 매번 순차적으로 전송 권한을 부여합니다.

장점: 충돌을 방지하고 효율적인 통제가 가능합니다.

단점: 중앙 제어 장치가 필요하고, 대규모 네트워크에서는 비효율적일 수 있습니다.

## MAC 프로토콜의 선택 기준

어떤 MAC 프로토콜을 사용할지는 네트워크 환경, 요구되는 성능 및 전송 효율성에 따라 달라집니다. 예를 들어:

Low Traffic Networks: ALOHA나 CSMA와 같은 간단한 방식이 적합할 수 있습니다.

High Traffic Networks: Token Passing 방식처럼 충돌 방지가 필요한 환경에 적합합니다.

Real-time Applications: Polling이나 Token Passing처럼 충돌이 없는 안정적인 프로토콜이 적합합니다.

https://velog.io/@kimmainsain/%EB%AA%A8%EB%91%90%EC%9D%98-%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%81%AC-%EC%A0%95%EB%A6%AC-4