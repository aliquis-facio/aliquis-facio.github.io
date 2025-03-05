---
layout: post
comments: true
sitemap:
    changefreq: daily
    priority: 0.5

title: "[COMPUTER NETWORK] Data Communications란?"
excerpt: "Data Communication 의미, 특징과 요소"

date: 2025-03-05
last_modified_at: 

tags: [COMPUTER NETWORK, NETWORK, TIL]
---

# 1.1. Data Communications
## Data Communications
우리가 서로 소통을 할 때, information 또는 data를 공유한다.
이 공유는 지역적이거나 원격적일 수 있다.
Telecommunication: 거리를 두고 하는 소통
Data communication: 특정한 형태의 전송매체를 통한 두 개의 기기간의 data 교환 

## Data communication 4가지 특징
1. Delivery(전달): 정확한 목적지에 data를 전달해야 한다.
1. Accuracy(정확성): data를 distortion(왜곡)이나 corruption(부패) 없이 정확하게 전달해야 한다.
1. Timeless()
    * data를 시기적절하게 전달해야 한다.
    * data의 전송이 늦으면 의미가 없다.
    * 영상이나 음성 data에 경우, 시기적절하게 전달한다는 것은 유의미한 delay 없이 data를 생성된 순서대로 전달한다는 것이다.
    * 이러한 종류의 전달은 real-time transmission(실시간 전송)
1. Jitter()
    * packet 도착 시간의 진동을 의미한다
    * 영상이나 음성 packet들의 전송에서 even(균등)하지 않은 delay
    * 예를 들면, 영상 packet들이 매 30초마다 전송된다고 해보자. 그 packet들 중 일부는 30ms 후에, 나머지는 40ms 후에 도착하는 상황인 것이다. 그렇게 되면 영상의 질은 even하지 못 하다.

## Data communications System의 5가지 요소

<img src = "https://github.com/aliquis-facio/aliquis-facio.github.io/blob/master/_image/2025-03-05-1.jpg?raw=true">

1. Message(메시지, 보내는 내용)
1. Sender(송신자, 보내는 사람)
1. Receiver(수신자, 받는 사람)
1. Transmission Medium(전송 매체)
1. Protocol(프로토콜, 전송 규약, 어떻게 보내고 받을 건지에 대한 약속)

## Message
오늘날 Information은 다양한 형태를 이루고 있다. 글, 숫자, 사진, 음성, 영상 등

### Text
* text는 0과 1로 이뤄진 일련의 bit들이다.
* text symbols마다 다른 bit pattern들을 가지고 있다.
* 오늘날 일반적으로 사용하는 것은 unicode로 32bit를 이용하여 전세계 어떤 언어라도 표현할 수 있다.

### Numbers
* numbers 또한 0과 1로 이뤄진 일련의 bit들이다.
* number는 이진수로 변환되어 표현된다.

### Images
* images은 pixels(picture elements)의 행렬 형태로 구성되어 있다.
* color images를 표현하는 방법
    * RGB: Red(빨강), Green(초록), Blue(파랑)
    * YCM: Yellow(노랑랑), Cyan(청록), Magenta(자홍)

### Audio
* Audio는 소리나 음악을 녹음한 것이나 방송한 것을 말한다
* Audio는 text, numbers, images와는 다르게 자연스럽다. 끊어진 data가 아니라 연속적인 data이다.
* 전기 신호로 바꿀 때에도 연속적인 신호로 만든다.

### Video
* Video는 사진이나 영상을 녹화한 것이나 방송한 것을 말한다