---
layout: post
comments: true
sitemap:

title: "[DEVELOP] API Gateway"
excerpt: ""

date: 
last_modified_at: 

categories: []
tags: [ESW]
---

# API Gateway

## 개요

클라이언트와 backend 서비스 사이에 위치해 API 요청을 관리하고 중개하는 역할을 하는 서비스 또는 시스템이다.
여러 backend 서비스를 추상화하고 단일 end-point로 노출해 클라이언트의 접근을 단순화하고, 보안, 인증, 권한 부여, 요청 변환, load balancing 등 다양한 기능을 제공한다.
API(Application Programming Interface): 소프트웨어 애플리케이션이 서로 통신해 데이터, 특징 및 기능을 교환할 수 있도록 하는 일련의 규칙 또는 프로토콜이다. 클라이언트에서 API로 데이터를 요청하는 것을 API 호출이라고 한다.

## 주요 기능

* 단일 진입점: 여러 backend 서비스에 대한 요청을 하나의 end-point로 통합해 클라이언트의 복잡성을 줄인다.
* 요청 routing: 클라이언트 요청을 적절한 backend 서비스로 전달한다.
* 인증 및 권한 부여: API 사용자의 신원을 확인하고 접근 권한을 제어한다.
* 보안: DDoS 공격, 악성 요청 등으로부터 시스템을 보호한다.
* 요청 변환: 클라이언트 요청 형식을 backend 서비스에 맞게 변환하거나, backend 서비스 응답을 클라이언트 형식에 맞게 변환한다.
* load balancing: 여러 backend 서비스 인스턴스에 요청을 분산해 가용성과 성능을 향상시킨다.
* caching: 자주 요청되는 데이터에 대한 응답을 caching해 backend 서비스 로드를 줄이고 응답 시간을 단축한다.
* 모니터링 및 logging: API 사용량, 오류 발생 등을 모니터링하고 logging하여 시스템 문제를 신속하게 파악하고 해결할 수 있도록 지원한다.
* API 관리: API 버전 관리, 문서화, 개발자 포털 등을 제공해 API 생태계를 관리하고 개발자 경험을 개선한다.

## 장점

* 마이크로 서비스 아키텍처 지원: backend 서비스의 변경이나 확장에 유연하게 대응할 수 있다.
* 보안 강화: 중앙 집중식 보안 정책 적용으로 시스템 전반의 보안 수준을 높인다.
* 성능 향상: caching, load balacing 등을 통해 시스템 성능을 개선한다.
* 개발 효율성 증대: API 관리 기능을 통해 개발 생산성을 향상시킨다.
* 운영 효율성 증대: 모니터링, logging 기능을 통해 운영 효율성을 높인다.

## 예시

* [AWS API Gateway](): 아마존 웹 서비스에서 제공하는 완전 관리형 API Gateway Service
* [Azure API Management](): Microsoft Azure에서 제공하는 API 관리 플랫폼
* [Kong](): 오픈 소스 API Gateway
* [Tyk](): 오픈 소스 API Gateway

---

## 참고

* [API Gateway란 무엇인가요?](https://www.ibm.com/kr-ko/think/topics/api-gateway#:~:text=API%20Gateway%EB%8A%94%20API%20%ED%98%B8%EC%B6%9C(API%20%EC%9A%94%EC%B2%AD%EC%9D%B4%EB%9D%BC%EA%B3%A0%EB%8F%84%20%ED%95%A8)%EC%9D%84,%EB%B3%B4%EC%95%88%20%EA%B8%B0%EB%8A%A5%EB%8F%84%20%EC%A0%9C%EA%B3%B5%ED%95%A9%EB%8B%88%EB%8B%A4.)
* [Amazon API Gateway](https://aws.amazon.com/ko/api-gateway/#:~:text=Amazon%20API%20Gateway%EB%8A%94%20%EC%96%B4%EB%96%A4%20%EA%B7%9C%EB%AA%A8%EC%97%90%EC%84%9C%EB%93%A0%20%EA%B0%9C%EB%B0%9C%EC%9E%90%EA%B0%80%20API%EB%A5%BC,Gateway%EB%A5%BC%20%EC%82%AC%EC%9A%A9%ED%95%98%EB%A9%B4%20%EC%8B%A4%EC%8B%9C%EA%B0%84%20%EC%96%91%EB%B0%A9%ED%96%A5%20%ED%86%B5%EC%8B%A0%20%EC%95%A0%ED%94%8C%EB%A6%AC%EC%BC%80%EC%9D%B4%EC%85%98%EC%9D%B4%20%EA%B0%80%EB%8A%A5)
* [MSA 아키텍쳐 구현을 위한 API 게이트웨이의 이해 (API GATEWAY)](https://bcho.tistory.com/1005)
* [[AWS] 📚 API Gateway 개념 & 기본 사용법 정리](https://inpa.tistory.com/entry/AWS-%F0%9F%93%9A-API-Gateway-%EA%B0%9C%EB%85%90-%EA%B8%B0%EB%B3%B8-%EC%82%AC%EC%9A%A9%EB%B2%95-%EC%A0%95%EB%A6%AC)
* [REST API](https://developers.home-assistant.io/docs/api/rest/)
