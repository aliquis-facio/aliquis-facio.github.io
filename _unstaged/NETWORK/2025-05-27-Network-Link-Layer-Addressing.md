---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[NETWORK] 링크 계층 주소"
excerpt: "L2 - Datalink Layer"

date: 2025-05-27
last_modified_at: 

categories: [NETWORK]
tags: [COMPUTER NETWORK, NETWORK, TIL]
---

# 목차

# 왜 링크 계층 주소가 필요한가?
IP 주소는 종단 간 주소지만, 실제 데이터 전송은 **링크 단위(hop-by-hop)**로 이루어진다.

라우터는 매 홉마다 프레임을 새로 구성하며, 해당 홉의 출발지/도착지 **링크 계층 주소(MAC)**를 사용한다.

즉, **네트워크 계층(IP)**은 출발지~목적지 전체 경로,
**데이터링크 계층(MAC)**은 링크 단위의 다음 홉 경로를 위한 주소 지정한다.

# MAC 주소란?
![PDU](https://github.com/aliquis-facio/aliquis-facio.github.io/blob/master/_image/2025-05-28-6.jpg)

NIC(Network Interface Card)에 전역적으로 고유하게 할당되어있는 주소이다. 총 48비트(6바이트), 16진수 12자리로 구성되어있다.
-> locally unique하다
e.g. A3:34:45:11:92:CC

다른 이름: Link-layer address, Physical address

확인 명령어:
Windows: ipconfig /all, getmac -v

# MAC 주소의 세 가지 유형
<table>
    <thead>
        <tr>
            <th>유형</th>
            <th>설명</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Unicast</td>
            <td>1:1 통신 (특정 수신자 MAC 주소 사용)</td>
        </tr>
        <tr>
            <td>Multicast</td>
            <td>1:N 통신 (MAC 주소의 첫 바이트의 LSB가 1인 경우)
            <br>e.g. 01:00:5E:01:02:03</td>
        </tr>
        <tr>
            <td>Broadcast</td>
            <td>1:ALL 통신 (모든 비트가 1인 주소)
            <br>e.g. FF:FF:FF:FF:FF:FF</td>
        </tr>
    </tbody>
</table>

# ARP (Address Resolution Protocol)
![ARP](https://github.com/aliquis-facio/aliquis-facio.github.io/blob/master/_image/2025-05-28-5.jpg)

ARP: IP 주소 → MAC 주소로 변환하는 프로토콜이다. 네트워크 계층과 링크 계층 간의 주소 변환 다리 역할을 한다.

동작 위치: TCP/IP 모델상 네트워크 계층, 그러나 MAC 주소를 다루므로 <mark>cross-layer</mark> 프로토콜

## ARP 동작 과정
1. 송신자 A는 수신자 B의 IP 주소는 알지만 MAC 주소는 모름
1. A는 **브로드캐스트(FF:FF:FF:FF:FF:FF)**로 ARP Request 전송
    * 포함 내용: B의 IP 주소, A의 MAC 주소
1. 수신자 B는 자신의 IP와 일치함을 확인하고, A에게 ARP Reply 전송
    * 포함 내용: B의 MAC 주소
1. A는 B의 MAC 주소를 ARP 캐시에 저장한 후 데이터 프레임 전송 시작

## ARP Packet 구조 (요약)
필드	설명
Hardware Type	1 (이더넷)
Protocol Type	0x0800 (IPv4)
Hardware Address Length	6 (MAC 주소 길이)
Protocol Address Length	4 (IPv4 주소 길이)
Operation	1=Request, 2=Reply

🗂️ 통신 예시 (Alice → Bob)
Alice는 Bob의 IP를 알고 있고, MAC 주소를 모름

ARP Request: Alice → 전체 브로드캐스트로 Bob의 MAC 주소 요청

ARP Reply: Bob → Alice에게 MAC 주소 응답

데이터 전송: Alice가 Bob의 MAC 주소로 프레임 캡슐화 후 전송

🔁 각 링크(R1, R2 등)에서 프레임은 새롭게 구성되며, 해당 홉의 MAC 주소를 사용

📌 핵심 개념 요약 정리
개념	설명
MAC 주소	네트워크 인터페이스 고유 주소 (링크 단위 주소)
IP 주소	종단 간 논리 주소 (전체 경로 지정)
ARP	IP 주소 → MAC 주소 변환 프로토콜
유니캐스트	단일 수신자 주소
멀티캐스트	그룹 통신 주소
브로드캐스트	네트워크 전체 대상 주소

