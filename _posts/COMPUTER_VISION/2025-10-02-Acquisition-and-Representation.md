---
layout: post
comments: true
sitemap:
  changefreq:
  priority:
title: "[COMPUTER VISION] 획득과 표현"
excerpt: 사람의 눈과 카메라
date: 2025-10-02
last_modified_at: 2025-10-17
categories:
  - COMPUTER VISION
tags:
  - COMPUTER_VISION
---
e
# 목차

1. [획득과 표현(Acquisition & Representation)](#2-획득과-표현acquisition--representation)
	1. [사람의 눈과 카메라](#21-사람의-눈과-카메라)
	2. [A Photon’s Life Choices](#22-a-photons-life-choices)
	3. [Image Formation](#23-image-formation)
	4. [From Light Rays to Pixel Values](#24-from-light-rays-to-pixel-values)
	5. [투영 모델과 좌표 사상](#25-투영-모델과-좌표-사상)
	6. [디지털 표현(Representation)](#26-디지털-표현representation)

---

# 2. 획득과 표현(Acquisition & Representation)
### 2.1. 사람의 눈과 카메라

![Alt Images](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-10-14-11.jpg?raw=true)

| 사람의 눈                 | 카메라/이미지 파이프라인                                | 비고                                                      |
| --------------------- | -------------------------------------------- | ------------------------------------------------------- |
| **수정체(Lens)**         | **렌즈군(Lens)**                                | 굴절률·초점거리 $f$로 원근투영 $x=\tfrac{fX}{Z},y=\tfrac{fY}{Z}$ 실현 |
| **홍채(Iris)**          | **조리개(Aperture, f-number $N=f/D$)**          | 개구 지름 (D)로 **노출·심도** 제어                                 |
| **동공(Pupil)**         | **유효 구경(Entrance Pupil)**                    | 광량 제어(조리개와 동일하게 동작)                                     |
| **망막(Retina: 막대/원추)** | **CCD/CMOS 센서 + CFA(베이어)**                   | 광자→전자 변환(포토다이오드), **색 필터배열**로 RGB 분리                    |
| **시신경·피질 전처리**        | **ISP**(디모자이킹, 노이즈 억제, 색보정, 화밸, 감마/톤매핑, 샤프닝) | 눈은 생물학적 적응, 카메라는 명시적 알고리즘                               |

### 2.2. A Photon’s Life Choices

- Absorption(흡수)
	- ![Alt Images](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-10-14-13.jpg?raw=true)
	- 매질 내부에서 광자 소멸
- Diffuse Reflection(난반사)
	- ![Alt Images](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-10-14-14.jpg?raw=true)
	- 거친 표면에서 무작위 산란 → 방향 독립에 가까운 반사
- Specular Reflection(정반사)
	- ![Alt Images](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-10-14-15.jpg?raw=true)
	- 매끄러운 계면에서 거울같이 반사(뷰 의존)
- Transparency(투사)
	- ![Alt Images](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-10-14-16.jpg?raw=true)
	- 흡수·산란 거의 없음 → 선명 투과
- Refraction(굴절)
	- ![Alt Images](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-10-14-17.jpg?raw=true)
	- 굴절률(밀도) 차이로 진행 방향 변화
- Fluorescence(형광)
	- ![Alt Images](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-10-14-5.jpg?raw=true)
	- 흡수 직후 장파장 재방출(나노–마이크로초)
- Subsurface Scattering(표면하 산란, SSS)
	- ![Alt Images](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-10-14-6.jpg?raw=true)
	- 표면 아래 들어가 다중 산란 후 다른 지점에서 출사
- Phosphorescence(인광)
	- ![Alt Images](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-10-14-7.jpg?raw=true)
	- 삼중항 전이로 지연 방출(ms–시간)
- Interreflection(상호반사)
	- ![Alt Images](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-10-14-8.jpg?raw=true)
	- 표면 간 다중 반사로 색·광량 교환

### 2.3. Image Formation

![Alt Images|394x247](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-10-14-9.jpg?raw=true)
- 요소 사슬: **광원 → 표면 형상·방향 → 표면 반사특성 → 광학계 → 센서**(Exposure 포함). 이들이 합쳐져 영상이 형성된다.
- **기본 방사측정 관계**: 영상면 조사조도 $E$는 장면 복사휘도 $L$에 **선형**이며, **렌즈 구경(면적)** 에 비례, **렌즈–영상면 거리의 제곱**에 반비례, **시선각 증가에 따라 감소** 한다.
	- $$E = \big[\frac{\pi}{4}(\frac {d}{f})^2 \cos ^4 \alpha \big]L$$

### 2.4. From Light Rays to Pixel Values

![Alt Images](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-10-14-10.jpg?raw=true)

- **카메라 응답함수(CRF)**: 조사조도/노출량 → **픽셀값**으로의 비선형 매핑. **재질 추정**·**HDR 복원**에서 중요

### 2.5. 투영 모델과 좌표 사상

- **원근 투영식**: Optical center 기준
	- $$3D (P(X,Y,Z)) → 2D (P'(x,y))$$
	- $$x=f \frac{X}{Z},\quad y= f \frac{Y}{Z}$$
		- $f$(렌즈~상까지의 거리)가 $Z$(상~물체까지의 거리)와 같다면 3차원 크기 그대로 유지
- 수직적 거리의 평행성 유지 X, 수평적 거리의 평행성 유지 O
- 2D 차원에서는 소실점을 통해 간접적으로 거리감을 느낌
- **행렬 체인**: World→Camera(4×4) → Perspective(3×4) → Pixel(3×3). 구현 시 이 순서로 곱해 **한 번에** 사상.

### 2.6. 디지털 표현(Representation)

- **샘플링·양자화**
	- 센서 신호(연속)를 **ADC**가 **0–255(8-bit)** 정수값으로 변환해 그레이스케일 영상(컬러는 채널별 변환) 구성.
	- 2차원 영상 공간을 $M \times N$ (해상도)으로 샘플링
	- 명암을 L 단계로 양자화(L을 명암 단계라 부름, 즉 명암은 `[0, L-1]` 사이 분포)
- 영상 좌표계
	- 화소 위치는 $x = (i, j)$로 표기
	- 영상은 $f(x)$ 또는 $f(i, j)$, $0 ≤ i ≤ M-1$, $0 ≤ j ≤ N-1$로 표기
	- 컬러 영상은 $fr(x)$, $fg(x)$, $fb(x)$의 세 채널로 구성