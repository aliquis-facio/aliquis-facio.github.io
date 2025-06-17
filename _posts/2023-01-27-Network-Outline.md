---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[NETWORK] 네트워크(Network)란?"
excerpt: "네트워크(Network)"

date: 2023-01-25
last_modified_at: 2025-04-04

categories: [NETWORK]
tags: [NETWORK]
---

# 목차
1. [네트워크란?](#1-네트워크란)
1. [거리 기반 네트워크 종류](#12-거리-기반-네트워크의-종류)
    1. [거리 기반 네트워크 유형](#121-거리에-따른-네트워크-유형)
1. [데이터 전송 방식](#13-데이터-전송data-transfer-방식)

# 네트워크(Network)
## 1. 네트워크란?
**Network**: <mark>송신자의 메시지를 수신자에게 전달</mark>하는 과정으로 한 지점에서 원하는 다른 지점까지 의미 있는 정보를 보다 정확하고 빠르게 상대방이 이해할 수 있도록 전송하는 것.
* **인터넷(Internet)**: 인터넷 프로토콜 스위트(TCP/IP)를 기반으로 하여 전 세계적으로 연결되어 있는 컴퓨터 네트워크 통신망을 일컫는 말.
* **WWW(World Wide Web)**: 인터넷에 연결된 컴퓨터를 이용해 사람들과 정보를 공유할 수 있는 거미줄(web)처럼 얼기설기 엮인 공간을 뜻한다.

## 2. 거리 기반 네트워크의 종류
IEEE 802에서 신호(Signal)가 전송되는 거리에 따라 네트워크를 분류함.
1. PAN(Personal Area Network): 약 3 ~ 5m
2. **LAN(Local Area Network)**: 약 50m
3. MAN(Metropolitan Area Network): 20 ~ 30km
4. **WAN(Wide Area Network)**: 서울과 부산 정도의 거리

### 2.1. 거리에 따른 네트워크 유형
<table>
    <thead>
        <tr>
            <th>구분</th>
            <th>개념</th>
            <th>특성</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>PAN<br>(Personal Area Network)</td>
            <td>약 5m 이내의 인접지역 간의 통신방법</td>
            <td>짧은 거리로 인해 보통 유선보다 <mark>무선의 WPAN(Wireless PAN)이 많이 활용</mark>됨.</td>
        </tr>
        <tr>
            <td><b>LAN<br>(Local Area Network)</b></td>
            <td><mark>근거리 영역</mark>의 네트워크. 동일한 지역(공장, 사무실 등) 내의 고속의 전용회선을 연결해 구성하는 통신망.</td>
            <td>1. 단일 기관 소유의 네트워크로 50m 범위 이내 한정된 지역<br>
            2. Client/Server와 P2P(peer to peer) 모델<br>
            3. WAN보다 빠른 통신 속도</td>
        </tr>
        <tr>
            <td>MAN<br>(Metropolitan Area Network)</td>
            <td>LAN과 WAN의 중간 형태의 네트워크.<br>
            데이터, 음성, 영상 등을 지원하기 위해 개발.</td>
            <td>1. 전송 매체: 동축 케이블, 광케이블<br>
            2. DQDB(Distributed Queue Dual Bus)</td>
        </tr>
        <tr>
            <td><b>WAN<br>(Wide Area Network)</b></td>
            <td><mark>광대역</mark> 네트워크망.<br>
            서로 관련이 있는 LAN 사이를 연결하는 상호 연결망.</td>
            <td>1. LAN에 비해 선로 에러율이 높고, 전송 지연이 큼.<br>
            2. WAN의 설계 시 전송 효율과 특성 고려.<br>
            3. 두 목적지 간을 최단 경로로 연결시켜주는 라우팅 알고리즘 필요.<br>
            4. 제한된 트래픽 조건 하에서 흐름 제어와 과도한 지연을 제거.</td>
        </tr>
    </tbody>
</table>

## 3. 데이터 전송(Data Transfer) 방식
* **단방향 통신(Simplex)**: 데이터를 전송만 할 수 있고 받을 수 없다.
* **반이중 통신(Half Duplex)**: 데이터를 송신하고 수신할 수 있지만, 동시에 할 수는 없다.
* **전이중 통신(Full Duplex)**: 동시에 데이터를 송신 및 수신할 수 있다.

# 참고
* [나무위키: 인터넷](https://namu.wiki/w/%EC%9D%B8%ED%84%B0%EB%84%B7)
* [나무위키: WWW](https://namu.wiki/w/%EC%9B%94%EB%93%9C%20%EC%99%80%EC%9D%B4%EB%93%9C%20%EC%9B%B9)
* [나무위키: 동축 케이블](https://namu.wiki/w/%EB%8F%99%EC%B6%95%20%EC%BC%80%EC%9D%B4%EB%B8%94?from=%EB%8F%99%EC%B6%95%EC%BC%80%EC%9D%B4%EB%B8%94)
* [DQDB(Distributed Queue Dual Bus)](https://itdexter.tistory.com/168)
* [나무위키: P2P](https://namu.wiki/w/P2P)