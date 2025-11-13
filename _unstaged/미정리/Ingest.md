---
tags:
  - ESW
  - meaning
---
# Ingest 서비스란?

## 개요

Ingest 서비스는 테이프, 라이브 방송, 파일 등 다양한 형태의 원본 데이터를 컴퓨터나 시스템에서 처리하고 저장할 수 있는 표준 형식으로 변환하고, 이를 중앙 시스템에 저장하는 과정을 의미한다.
방송, 미디어 관리, 데이터 분석 등 다양한 분야에서 사용되며, 원본 데이터를 편집, 보관, 분석에 용이한 형태로 가공하는 것을 목표로 한다.

## 주요 기능 및 특징

* 데이터 변환 및 표준화: 다양한 형식의 원본 데이터를 편집이나 저장에 적합한 표준 포맷으로 변환한다.
* 데이터 통합: 여러 소스에서 수집된 데이터를 중앙 시스템(예: 미디어 자산 관리 시스템, 데이터 스토리지)에 모아 관리한다.
* 실시간 처리 및 편집: 실시간으로 들어오는 미디어 데이터를 편집 중에 미리 보거나 바로 편집할 수 있는 기능을 지원한다.
* 다양한 코덱 지원: DVCPRO, ProRes, H.264 등 다양한 코덱으로 변환해 여러 코덱의 편집 파일을 동시에 생성할 수 있다.
* 데이터 가공 및 보강: 데이터에 정보를 추가하거나 구문을 분석하는 등의 전처리 과정을 거쳐 데이터의 가치를 높인다.

## 주요 활용 분야
* 방송 및 미디어: 테이프, 파일 등의 방송 콘텐츠를 수집해 방송사의 미디어 자산 관리(MAM) 시스템에 등록하고, 편집 및 배포를 위한 준비를 한다.
* 데이터 분석: 다양한 소스에서 들어오는 로그 데이터나 정형/비정형 데이터를 수집하고 가공해 분석 시스템에 저장한다.
* 클라우드 서비스: Amazon OpenSearch Service와 같은 클라우드 플랫폼에서 데이터를 수집하고 처리하기 위해 사용된다.

## 방법

* MQTT
* ThinQ Poller
* [Webhook](Webhook.md)

# 참고

* [What is the Ingest server and how is it compared to Sony Vegas Pro?](https://www.quora.com/What-is-the-Ingest-server-and-how-is-it-compared-to-Sony-Vegas-Pro)
* [NPS - 인제스트 시스템](https://blog.naver.com/t_rex_one/220979406065)
* [미디어 수집 Ingest](https://www.gemiso.co.kr/ariel-v2-1#:~:text=%EB%AF%B8%EB%94%94%EC%96%B4%EB%A5%BC%20%EC%88%98%EC%A7%91%ED%95%98%EB%8A%94%20%EC%9D%B8%EC%A0%9C%EC%8A%A4%ED%8A%B8(Ingest)%EB%8A%94%20%ED%85%8C%EC%9D%B4%ED%94%84%2C%20%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EB%B0%A9%EC%86%A1%2C%20%ED%8C%8C%EC%9D%BC,%EC%8B%A0%EC%86%8D%ED%95%98%EA%B3%A0%20%EC%95%88%EC%A0%95%EC%A0%81%EC%9D%B4%EB%A9%B0%20%ED%8E%B8%EB%A6%AC%ED%95%98%EA%B2%8C%20MAM%EC%97%90%20%EB%93%B1%EB%A1%9D%ED%95%A0%20%EC%88%98%20%EC%9E%88%EC%8A%B5%EB%8B%88%EB%8B%A4.)