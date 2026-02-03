---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[CTF] Dreamhack 문제 풀이: {\"role\": \"admin\"}"
excerpt: "JSON Injection"

date: 2026-02-03
last_modified_at: 2026-02-03

categories: [CTF]
tags: [TIL, WEB, CTF]
---

<!-- markdownlint-disable MD010 MD025 -->

# {"role": "admin"}

## 목차

1. [Vuln](#1-vuln)
2. [Code](#2-code)
3. [Payload](#3-payload)
4. [참고](#참고)

---

## 1. Vuln

Injection

- 애플리케이션이 사용자 제공 데이터를 검증, 필터링 하지 않는다.
- 악성 데이터가 직접 사용되거나 이어붙여진다. 즉, 동적 쿼리/명령/저장 과정에서 명령 문자열이 "구조 + 악성 데이터" 형태로 구성된다.

## 2. Code

```python
from flask import Flask, request, session, redirect, url_for, jsonify, render_template
import json, uuid, os, hashlib

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "FAKE_KEY")
FLAG = os.environ.get("FLAG", "DH{FAKE_FLAG}")

USERS = {}
UID = {}

# 비밀번호 hash
def pw_hash(pw: str) -> str:
    return hashlib.sha256(pw.encode("utf-8")).hexdigest()


USERS[1] = {
    "uid": 1,
    "username": "admin",
    "pw": pw_hash("**REDACTED**"),
    "role": "admin",
}
UID["admin"] = 1

USERS[2] = {
    "uid": 2,
    "username": "guest",
    "pw": pw_hash("guest"),
    "role": "user",
}
UID["guest"] = 2


def current_user():
    # session에서 uid를 가져옴
    uid = session.get("uid")
    # uid가 없을 경우 아무것도 리턴 안 함
    if not uid:
        return None
    # 딕셔너리 USERS에서 uid를 키로 user 정보를 가져옴
    return USERS.get(uid)

# 루트 페이지, GET
@app.route("/", methods=["GET"])
def index():
    # uid 확인
    user = current_user()
    # uid가 없을 경우 로그인 창으로 리다이렉트
    if not user:
        return redirect(url_for("login"))
    # index.html 렌더링
    return render_template("index.html", title="Home", username=user.get("username"), role=user.get("role"))


# 회원가입 페이지, GET, POST
@app.route("/register", methods=["GET", "POST"])
def register():
    # GET -> 회원가입 페이지 렌더링
    if request.method == "GET":
        return render_template("register.html", title="Register")

    # 입력 정보 가져오기: username, password
    username = request.form.get("username").strip()
    password = request.form.get("password")
	
	# 입력값에 대한 검증이 없음
    # username, password 중 입력 X -> 에러 띄우기
    if not username or not password:
        return render_template("register.html", title="Register", error="username/password가 필요합니다."), 400

    # uid, hashed pw 생성
    uid = str(uuid.uuid4())
    pw = pw_hash(password)
	
    # raw_user 데이터, 입력값을 문자열로 만듦.
    raw_user = (
        f'{{"role":"user",'
        f'"username":"{username}",'
        f'"pw":"{pw}",'
        f'"uid":"{uid}"}}'
    )

    # json으로 올리기
    try:
        user = json.loads(raw_user)
    except Exception:
        return render_template("register.html", title="Register", error="회원가입에 실패했습니다."), 400

    # json 데이터 user에서 username을 가져옴
    final_username = str(user.get("username", "")).strip()
    # 딕셔너리 UID에 존재한다면
    if final_username in UID:
        return render_template("register.html", title="Register", error="이미 존재하는 username입니다."), 409

    # 딕셔너리 USERS에 uid 값을 기준으로 user를 저장함
    USERS[user["uid"]] = user
    # 딕셔너리 UID에 username을 기준으로 uid를 저장함
    UID[final_username] = user["uid"]

    return redirect(url_for("login"))


# 로그인 페이지, GET, POST
@app.route("/login", methods=["GET", "POST"])
def login():
    # GET 방식일 땐 로그인 페이지 렌더링
    if request.method == "GET":
        return render_template("login.html", title="Login")

    # 입력값 가져오기
    username = request.form.get("username").strip()
    password = request.form.get("password")

    # 딕셔너리 UID에서 username으로 uid를 가져옴
    uid = UID.get(username)
    if not uid:
        return render_template("login.html", title="Login", error="로그인 실패"), 401

    # 딕셔너리 USERS에서 user 정보를 가져옴
    user = USERS.get(uid)
    # 존재하지 않거나 비밀번호가 틀리면 실패
    if not user or user.get("pw") != pw_hash(password):
        return render_template("login.html", title="Login", error="로그인 실패"), 401

    # session값 uid 설정
    session["uid"] = uid
    return redirect(url_for("index")) 


# 로그아웃 페이지, GET
@app.route("/logout", methods=["GET"])
def logout():
    session.pop("uid", None)
    return redirect(url_for("login"))


# 개인정보 페이지, GET
@app.route("/me", methods=["GET"])
def me():
    # uid 값 가져오기
    user = current_user()
    # uid가 없을 경우
    if not user:
        return jsonify(error="not logged in"), 401

    # user 정보에서 pw를 제외함
    u = dict(user)
    u.pop("pw", None)
    # json화해서 리턴
    return jsonify(user=u)

@app.route("/flag", methods=["GET"])
def flag():
    # uid 값이 없을 경우
    user = current_user()
    if not user:
        return jsonify(error="not logged in"), 401

    # user의 역할이 admin일 경우
    if user.get("role") == "admin":
        # flag 반환
        return jsonify(flag=FLAG)

    # 에러 출력
    return jsonify(error="forbidden"), 403


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
```

회원가입에서 입력값의 검증이 없다.
유저 입력을 포함한 JSON을 문자열로 조립하고 있다.
파이썬 json은 중복 키가 나오면 뒤의 값이 최종값이 된다.

## 3. Payload

flag를 얻기 위해서 `role`이 `admin`이면 된다. 내가 생각한 방법으로는 두 가지가 있다.

1. admin 계정을 탈취한다.
2. 내 계정의 `role`을 `admin`으로 승격시킨다.

첫 번째로, admin 계정을 탈취하기 위해서는

1. admin의 session `uid` 값을 알아내거나,
2. admin의 session `uid` 값을 탈취하거나,
3. admin의 `pw` 값을 알아내면 된다.

하지만 `uid`와 `pw`는 난수화되어 있고, admin은 데이터로만 존재하기 때문에 XSS 등으로 session 값을 가져올 수도 없다.

두 번째로, 내 계정의 역할을 admin으로 승격시키기 위해서는 사용자로부터 입력을 받는 곳을 찾아 `role`을 `admin`으로 바꾸면 된다.

1. `/flag`, `/me` 페이지에서 GET 방식으로 입력 받고 있으니 JSON 값으로 `{"role": "admin"}`을 넣어봤으나 `current_user`로 받아오는 `user` 데이터만 확인해서 의미가 없다.
2. `/register`에서 내 `role`을 `admin`인 계정을 생성한다.

[Code](#2-code) 부분에서 분석했듯이 `register`에서 사용자 입력값의 검증 없이 문자열로 조합해 JSON을 만들고 있다. 여기에서 `"`/`,` 문자를 섞으면 기존 JSON 구조가 깨지면서 중간에 임의의 값을 삽입할 수 있고, `role`을 덮어쓰면 `admin`으로 바로 만들 수 있게 된다.

![500x308](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-02-03-15-42-05.png)

id: `asdf","role":"admin`
pw: `asdf`

![500x225](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-02-03-15-43-12.png)
> `asdf` 계정으로 로그인을 한 모습

![500x120](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-02-03-15-44-08.png)
> flag가 보인다.

---

## 참고

- [OWASP: Injection](https://owasp.org/Top10/2021/A03_2021-Injection/index.html)
