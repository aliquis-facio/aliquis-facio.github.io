---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[DATE SCIENCE] 한글 텍스트 자연어 처리 실습"
excerpt: "한글 텍스트 자연어 처리: 소설 속 등장인물 감정 흐름 변화 추적"

date: 2025-03-26
last_modified_at: 

categories: [DATE SCIENCE]
tags: [DATE SCIENCE, NLP, TIL]
---

# 목차

# 한글 텍스트 자연어 처리 실습(Korean NLP Practice)
## 텍스트 전처리
1. 문장 단위 토큰화
1. 토큰화: 텍스트를 단어, 문장, 구와 같은 더 작은 단위로 나눈다.
1. 불용어 제거: 'is' 또는 'the'같이 자주 사용되지만 텍스트에 큰 의미를 더하지 않는 단어를 필터링하여 제거한다.
1. 형태소 분석: '달리기'를 '달리다'로 바꾸는 것처럼 단어를 어근 형태로 줄이고 동일한 단어의 다양한 형태를 그룹화하여 언어를 더 쉽게 분석할 수 있게 만든다.
1. 정규표현: 구두점, 특수 문자, 숫자 등 분석을 복잡하게 만들 수 있는 원치 않는 요소를 제거한다.

## 특징 추출
Bag of Words
TF-IDF
워드 임베딩: Word2Vec, GloVe
문장 임베딩: BERT, GPT

## 텍스트 분석
* 품사(POS) 태깅: 단어의 문법적 역할을 식별한다.
* 명명된 엔티티 인식(NER): 이름, 위치, 날짜 등의 특정 엔티티를 감지한다.
* 종속성 구문 분석: 단어 간의 문법적 관계를 분석하여 문장 구조를 이해한다.
* 감정 분석: 텍스트의 감정적 어조를 결정하고 텍스트가 긍정적, 부정적 또는 중립적인지 평가한다.
* 주제 모델링: 텍스트 내에서 또는 문서 말뭉치 전체에서 기본 테마 또는 주제를 식별한다.
* 자연어 이해(NLU): 문장의 숨겨진 의미를 분석, NLU를 사용하여 다른 문장에서 유사한 의미를 찾거나 다른 의미를 가진 단어를 처리할 수 있다.

## 모델 학습

# 참고
* [git: KoBookNLP](https://github.com/storidient/KoBookNLP)
* [KoBERT를 활용한 감정분류 모델 구현 with Colab](https://bbarry-lee.github.io/ai-tech/KoBERT%EB%A5%BC-%ED%99%9C%EC%9A%A9%ED%95%9C-%EA%B0%90%EC%A0%95%EB%B6%84%EB%A5%98-%EB%AA%A8%EB%8D%B8-%EA%B5%AC%ED%98%84.html)
* [감정분류(한국어)- 리뷰데이터 학습, 평가, 예측까지](https://wonhwa.tistory.com/35)
* [텍스트 정보 추출 모델 (with. 개체명 인식(NER))](https://chocochip125.tistory.com/220)
* [git: KoBERT](https://github.com/SKTBrain/KoBERT)
* [git: Korean NER based BERT+CRF](https://github.com/eagle705/pytorch-bert-crf-ner)