---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[NETWORK] 데이터 변조(Data Modulation)란?"
excerpt: "Data Modulation"

date: 2025-04-04
last_modified_at: 

categories: [NETWORK]
tags: [COMPUTER NETWORK, NETWORK, TIL]
---

<script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>

# 목차

# 데이터 변조(Data Modulation)
## 변조(Modulation)란?
변조(Modulation): 아날로그 혹은 디지털로 부호화된 신호를 전송 매체에 전송할 수 있도록 주파수 및 대역폭을 갖는 신호를 생성하는 일련의 과정이다.
부호화(Encoding): 신호를 현재 정보나 신호가 아닌 다른 형태로 변환하는 것이다.

* 변조 방식

```mermaid
flowchart TB
subgraph "디지털"
디지털 데이터 --> 아날로그 부호화
디지털 데이터 --> 디지털 부호화
end
subgraph "아날로그"
아날로그 데이터 --> 아날로그 부호화
아날로그 데이터 --> 디지털 부호화
end
```

## 디지털 변조
디지털 변조: 디지털 신호를 아날로그 신호로 변조하는 것으로 진폭 편이 변조(ASK: Amplitude Shift Keying), 주파수 편이 변조(FSK: Frequency Shift Keying), 위상 편이 변조(PSK: Phase Shift Keying) 등이 있다.

### 진폭 편이 변조(ASK, Amplitude Shift Keying)

### 아날로그 변조

# 참고

<script>
mermaid.initialize({startOnLoad:true});
window.mermaid.init(undefined, document.querySelectorAll('.language-mermaid'));
</script>