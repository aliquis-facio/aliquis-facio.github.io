---
layout: post
comments: true
sitemap:

title: "[NETWORK] 데이터 전송(Data Transmission)이란?"
excerpt: "Data Transmission"

date: 2025-04-04
last_modified_at: 

categories: [NETWORK]
tags: [COMPUTER NETWORK, NETWORK, TIL]
---

<script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>

# 목차

# Digital Transmission
Digital Data -> Digital Signals
* Line Coding
* Block Coding
* Scrambling

## Line Coding
Line Coding: 디지털 데이터 -> 디지털 신호
다른 사람에게 전송하기 위해서는 변환 과정이 필요함.
송신자는 디지털 데이터를 디지털 신호로 변환하는 encoding이 필요하고, 수신자는 디지털 신호를 디지털 데이터로 변환하는 decoding이 필요함.

## Signal Elements VS Data Elements
신호 요소(signal element): 통신 채널에서 자료가 전송되는 기본 단위. 하나의 신호 요소는 채널의 상태와 조건에 따라 하나 이상의 디지털 정보 비트로 표현됨.
신호 속도의 단위는 보(baud)로 초당 발생하는 신호 변화의 수를 나타냄.
Signal elements carries data elements.

데이터 요소(data element): 정보를 의미할 수 있는 가장 작은 데이터 단위. 단위는 bit

r: 각 신호 요소가 옮기는 데이터 요소들의 비율
r = data elements / signal elements

Data rate(Bit rate)
Signal rate(pulse rate, modulation rate, baud rate, symbol rate)

S = N/r, r = N/S
S = signal rate
N = data rate
r = ratio of the number of data elements carried by each signal element

S(ave) = cN/r
c = case factor

e.g. r = 1, N = 100kbps, c = 1/2

Baseline Wandering(Drift): 긴 시간동안 값이 연속되게 올 경우 baseline이 이동함.
DC(Direct Current) Component: 전압값이 일정 시간 동안 같을 경우, 낮은 주파수가 만들어짐.
Self-Synchronization: 수신자의 bit 간격이 송신자와 같지 않아 신호를 송신자의 data와 다르게 해석할 수 있음.

line coding의 종류
* unipolar: NRZ
* polar: NRZ, RZ, biphase(Manchester)
* bipolar: AMI, pseudoternary
* multilevel: 2B/1Q, 8B/6T, 4D-PAM5
* multitransition: MLT-3

1. unipolar
all signal levels are no one side of the time axis either above or below
NRZ(Non Return to Zero)
신호가 0으로 돌아가지 않음.

1. polar
The voltages are on both sides of the time axis.
NRZ-L(Level): the level of the voltage determines the value of the bit

NRZ-I(Inverter): the change of lack of change in the level of the voltage determines the value of the bit
No inversion if next bit is 0, Inversion if next bit is 1

RZ(Return to Zero): Uses 3 values: +, -, 0

Biphase: Manchester and Differential Manchester
Manchester: RZ + NRZ-L
Differential Manchester: RZ + NRZ-I

Block Coding
4b/5b
8b/10b

3 steps of block coding
1. division
1. substitution
1. combination

# 참고
* [신호 요소, 信號要素, signal element](https://terms.tta.or.kr/dictionary/dictionaryView.do?word_seq=055625-1)
* [](https://terms.tta.or.kr/dictionary/dictionaryView.do?word_seq=040320-1)
* [](https://ideadummy.tistory.com/102)

<script>
mermaid.initialize({startOnLoad:true});
window.mermaid.init(undefined, document.querySelectorAll('.language-mermaid'));
</script>