---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[DATA SCIENCE] 한글 텍스트 데이터 토큰화(Tokenization)"
excerpt: "토큰화와 한글 텍스트 데이터 토큰화 실습"

date: 2025-03-16
last_modified_at: 

categories: [DATA SCIENCE]
tags: [DATA SCIENCE, TIL]
---

# 토큰화(Tokenization)
토큰화(tokenization): 주어진 <abbr title="말뭉치">코퍼스(corpus)</abbr>에서 토큰(token)이라 불리는 단위로 나누는 작업. 토큰의 단위가 상황에 따라 다르지만, 보통 의미있는 단위로 토큰을 정의함.

## 1. 단어 토큰화(Word Tokenization)
단어 토큰화(word tokenization): 토큰의 기준이 단어(word)임. 다만, 여기서 단어(word)는 단어 단위 외에도 단어구, 의미를 갖는 문자열로도 간주되기도 함.

* 구두점(punctuation): 마침표(.), 쉼표(,), 물음표(?), 세미콜론(;), 느낌표(!) 등과 같은 기호

## 2. 토큰화 중 생기는 선택의 순간
토큰화를 하다보면, 예상하지 못한 경우가 있어서 토큰화의 기준을 생각해봐야 하는 경우가 발생한다. 물론, 이러한 선택은 해당 데이터를 가지고 어떤 용도로 사용할 것인지에 따라서 그 용도에 영향이 없는 기준으로 정하면 됨.
* NLTK: 영어 코퍼스를 토큰화하기 위한 도구들을 제공함.

## 3. 토큰화에서 고려해야 할 사항
### 1) 구두점이나 특수 문자를 단순 제외해서는 안 된다.
갖고있는 코퍼스에서 단어들을 걸러낼 때, 구두점이나 특수 문자를 단순히 제외하는 것은 옳지 않음. 코퍼스에 대한 정제 작업을 진행하다보면, 구두점조차도 하나의 토큰으로 분류하기도 함.
* 마침표(.): 문장의 경계를 알 수 있는데 도움이 되므로 단어를 뽑아낼 때, 마침표(.)를 제외하지 않을 수 있음
* 단어 자체에 구두점을 갖고 있는 경우: m.p.h, AT&T
* 특수 문자: $45.55, 25/03/12
* 쉼표(,): 123,456,789

### 2) 줄임말과 단어 내에 띄어쓰기가 있는 경우
* 접어(clitic): 단어가 줄임말로 쓰일 때 생기는 형태 e.g. I'm -> m
* 하나의 단어이지만 중간에 띄어쓰기가 존재하는 경우: New York, rock 'n' roll

### 3) 표준 토큰화 예제
<abbr title="표준 토큰화 방법 중 하나">Penn Treebank Tokenization</abbr>  
규칙 1. 하이푼으로 구성된 단어는 하나로 유지한다.  
규칙 2. doesn't와 같이 아포스트로피로 '접어'가 함께하는 단어는 분리해준다.

## 4. 문장 토큰화(sentence tokenization)
문장 분류(sentence segmentation): 갖고 있는 코퍼스 내에서 문장 단위로 구분하는 작업. 보통 갖고 있는 코퍼스가 정제되지 않은 상태라면, 코퍼스는 문장 단위로 구분되어 있지 않아서 이를 사용하고자 하는 용도에 맞게 문장 토큰화가 필요할 수 있다.  
!나 ?는 문장의 구분을 위한 꽤 명확안 구분자(boundary) 역할을 하지만 마침표는 그렇지 않음. 마침표는 문장의 끝이 아니더라도 등장할 수 있음. e.g. 192.168.1.1, example@example.com, Dr.Dre
한국어의 경우 KSS(Korean Sentence Splitter)를 추천함  
`pip install kss`  
KSS를 통해서 문장 토큰화 진행하기
```python
import kss
text = '~'
result = kss.split_sentences(text)
```

## 5. 한국어에서의 토큰화의 어려움
어절: 띄어쓰기 단위가 되는 단위  
어절 토큰화는 한국어 NLP에서 지양되고 있다. 어절 토큰화와 단어 토큰화는 같지 않기 때문.
그 이유는 한국어가 교착어임.  
교착어: 조사, 어미 등을 붙여서 말을 만드는 언어  

### 1) 교착어의 특성
한국어 토큰화에서는 형태소(morpheme)란 개념을 반드시 이해해야 한다.  
형태소(morpheme): 뜻을 가진 가장 작은 말의 단위
  * 자립 형태소: 접사, 어미, 조사와 상관없이 자립하여 사용할 수 있는 형태소. 그 자체로 단어가 된다. e.g. 체언(명사, 대명사, 수사), 수식언(관형사, 부사), 감탄사 등
  * 의존 형태소: 다른 형태소와 결합하여 사용되는 형태소 e.g. 접사, 어미, 조사, 어간

e.g. 에디가 책을 읽었다  
어절 토큰화 -> '에디가', '책을', '읽었다'
형태소 단위로 분해  
  * 자립 형태소: 에디, 책
  * 의존 형태소: -가, -을, 읽-, -었-, -다

-> 한국어에서는 형태소 토큰화를 수행해야 함

### 2) 한국어는 띄어쓰기가 영어보다 잘 지켜지지 않는다.
한국어는 영어권 언어와 비교해 띄어쓰기가 어렵고 잘 지켜지지 않는 경향이 있음. 그 이유는 여러 견해가 있으나, 가장 기본적인 견해는 한국어의 경우 띄어쓰기가 지켜지지 않아도 글을 쉽게 이해할 수 있는 언어라는 점임.

## 6. 품사 태깅(Part-of-speech tagging)
단어는 표기는 같지만 품사에 따라서 단어의 의미가 달라지기도 함.
e.g. 못(명사): 망치를 사용해 목재 따위를 고정하는 물건  
못(부사): '먹다', '하다' 등과 같은 동작 동사를 할 수 없다는 의미를 나타냄  
품사 태깅(part-of-speech tagging): 단어 토큰화 과정에서 각 단어가 어떤 품사로 쓰였는지를 구분하는 작업

## 7. KoNLPy를 이용한 한국어 토큰화 실습
KoNLPy를 통해서 사용할 수 있는 형태소 분석기: Okt(Open Korea Text), Mecab, Komoran, Hannanum, KKma(꼬꼬마)

1. okt 형태소 분석기

```python
from konlpy.tag import Okt
okt = Okt()
kkma = Kkma()
print('OKT 형태소 분석 :',okt.morphs("열심히 코딩한 당신, 연휴에는 여행을 가봐요"))
print('OKT 품사 태깅 :',okt.pos("열심히 코딩한 당신, 연휴에는 여행을 가봐요"))
print('OKT 명사 추출 :',okt.nouns("열심히 코딩한 당신, 연휴에는 여행을 가봐요"))
```

1) morphs: 형태소 추출  
2) post: 품사 태깅(Part-of-speech tagging)
3) nouns: 명사 추출  

2. KKma(꼬꼬마) 형태소 분석기

```python
from konlpy.tag import Kkma
print('꼬꼬마 형태소 분석 :',kkma.morphs("열심히 코딩한 당신, 연휴에는 여행을 가봐요"))
print('꼬꼬마 품사 태깅 :',kkma.pos("열심히 코딩한 당신, 연휴에는 여행을 가봐요"))
print('꼬꼬마 명사 추출 :',kkma.nouns("열심히 코딩한 당신, 연휴에는 여행을 가봐요"))
```

---
각 형태소 분석기는 성능과 결과가 다르게 나오기 때문에, 형태소 분석기의 선택은 사용하고자 하는 필요 용도에 어떤 형태소 분석기가 가장 적절한지를 판단하고 사용해야 함.

# 출처
* [okt github](https://github.com/open-korean-text/open-korean-text)
* [KoNLPy tag Package](https://konlpy.org/en/latest/api/konlpy.tag/)
* [텍스트 전처리(Text preprocessing)](https://wikidocs.net/21694)
* [정규표현식(Regular Expression) with 파이썬](https://jh2021.tistory.com/8)
* [한국어 소설 텍스트를 위한 자연어처리 라이브러리](https://github.com/storidient/KoBookNLP)