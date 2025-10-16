---
layout: post
comments: true
published: true
sitemap:
    changefreq:
    priority:

title: "[NETWORK] Protocol이란?"
excerpt: "Protocol의 의미와 인터넷 모델"

date: 2025-04-02
last_modified_at: 

categories: [NETWORK]
tags: [COMPUTER NETWORK, NETWORK, TIL]
---

# 목차
1. [Protocol](#protocol)
    1. [Protocol이란?](#1-protocol이란)
    1. [다계층 네트워크 모델](#2-다계층-네트워크-모델)
        1. [OSI 7계층](#21-osi-7계층)
        1. [TCP/IP 4계층](#22-tcpip-4계층)

# Protocol
## 1. Protocol이란?

**Protocol**: 전송자와 수신자 그리고 모든 통신 매체에서 효과적으로 통신하기 위해 필요한 약속이다.
통신이 간단할 경우, 하나의 단순한 protocol만 필요하다. 그렇지만 복잡할 경우, 우리는 다른 protocol 층별 간에 업무를 나눌 필요가 있다.

reply VS response

계층들은 몇몇의 방법으로 네트워킹의 단순함을 따른다

Protocol: 각 계층별로 어떻게 소통할 것인지와 어떻게 인접한 네트워크 모델의 계층끼리 연결할 것인지에 대해 정의한 표준 약속들의 집합체이다.

## 2. 다계층 네트워크 모델

- OSI 7 Layer(Open Systems Interconnection Model): 1984년에 ISO(International Standards Organization)에서 컴퓨터 네트워크 표준 체제를 만들었다.
- Internet 5 Layer(TCP/IP)(Internet Model): DARPA에서 1970년 초기에 만들었다. 내부망 문제를 해결하기 위해 개발되었다. 5계층을 기초로 한다. TCP(Transmission Control Protocol)/IP(Internet Protocol)을 기반으로 한다.
<!-- [OSI 7계층]()
[TCP/IP 모델]() -->

### 2.1. OSI 7계층
- L7. 응용계층: 사용자 소프트웨어를 네트워크에 접근 가능하도록 함. 사용자에게 최종 서비스를 제공
- L6. 표현계층: 포맷 기능, 압축, 암호화. 텍스트 및 그래픽 정보를 컴퓨터가 이해할 수 있는 16진수 데이터로 변환
- L5. 세션계층: 세션 연결 및 동기화 수행, 통신 방식 결정. 가상 연결을 제공하여 Login/Logout 수행
- L4. 전송계층: 가상연결, 에러제어, Data 흐름제어, Segment 단위. 두 개의 종단 간 End-to-End 데이터 흐름이 가능하도록 논리적 연결. 신뢰도, 품질 보증, 오류 탐지 및 교정 기능 제공. 다중화(Multiplexing) 발생
- L3 네트워크계층: 경로 선택, 라우팅 수행, 논리적 주소 연결(IP). 데이터 흐름 조절, 주소 지정 메커니즘 구현. 네트워크에서 노드에 전송되는 패킷 흐름을 통제하고, 상태 메시지가 네트워크 상에서 어떻게 노드로 전송되는가를 정의, Datagram 단위
- L2. 데이터링크계층: 물리주소 결정, 에러제어, 흐름제어, 데이터 전송. Frame 단위, 전송 오류를 처리하는 최초의 계층
- L1. 물리계층: 전기적, 기계적 연결 정의, 실제 Data bit 전송. Bit 단위, 전기적 신호, 전압 구성, 케이블, 인터페이스 등을 구성.

### 2.2. TCP/IP 4계층

<table>
    <thead>
        <tr>
            <th>OSI 7 계층</th>
            <th>TCP/IP 4 계층</th>
            <th>주요 기능</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Application</td>
            <td rowspan = "3">Application</td>
            <td rowspan = "3">네트워크를 실제로 사용하는 응용 프로그램으로 구성<br>
            FTP, telnet, DHCP, TFTP, HTTP, SMTP, DNS, SNMP 등이 있음</td>
        </tr>
        <tr>
            <td>Presentation</td>
            <!-- <td></td>
            <td></td> -->
        </tr>
        <tr>
            <td>Session</td>
            <!-- <td></td>
            <td></td> -->
        </tr>
        <tr>
            <td>Transport</td>
            <td>Transport</td>
            <td>도착하고자 하는 시스템까지 데이터를 전송<br>
            프로세스틑 연결해서 통신함<br>
            TCP, UDP</td>
        </tr>
        <tr>
            <td>Network</td>
            <td>Inernet</td>
            <td>Datagram을 정의하고 routing 하는 일을 담당<br>
            IP, ARP, RARP, ICMP</td>
        </tr>
        <tr>
            <td>Data Link</td>
            <td>Network Access(Data Link)</td>
            <td rowspan = "3">케이블, 송수신기, 링크 프로토콜, LAN 접속과 같은 물리적 연결 구성을 정의</td>
        </tr>
        <tr>
            <td>Physical</td>
            <td>Network Access(Physical)</td>
            <!-- <td></td> -->
        </tr>
    </tbody>
</table>

<!-- [OSI vs TCP/IP]()
[계층 framework]() -->
