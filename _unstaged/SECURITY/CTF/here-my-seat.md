<!-- markdownlint-disable MD007 MD010 MD025 -->

# 여기, 내 자리

## Vuln

CSRF
XSS

## Code

```python
from flask import Flask, request, jsonify, make_response
from urllib.parse import urlsplit
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time
import secrets
import threading
import hashlib

# 앱 설정
app = Flask(__name__)
app.secret_key = "kimboan"

# 쿠키 이름: SESSION
COOKIE_NAME = "SESSION"
FLAG_VALUE = "FAKE_FLAG"

# 서버 전역 딕셔너리
_store = {}
_lock = threading.RLock()

# 새 sid 발급
def newSid():
	return secrets.token_urlsafe(24)

# 해시 적용
def sha256_hex(s):
	return hashlib.sha256(s.encode("utf-8")).hexdigest()

# /login (GET)
@app.get("/login")
def login():
	sid = request.cookies.get(COOKIE_NAME)
    # 쿼리 id, password를 받음
	userId = request.args.get("id", "")
	password = request.args.get("password", "")

	resp = make_response(jsonify(ok=True))

	with _lock:
        # id == admin이고 sha256(password)가 해시값과 같으면 admin 처리
		if userId == "admin" and sha256_hex(password) == "80c0a354393511c1201de46b51ef4a2f009aab55e7a151fa413d5c260196f79f":
            # 쿠키에 sid값이 없거나 딕셔너리에 sid가 없으면
			if (not sid) or (sid not in _store):
				sid = newSid()
            # 새 sid 발급
			_store[sid] = {"role": "admin"}
		else:
            # admin이 아니면 새 sid 발급 후 guestㄹ 저장
			sid = newSid()
			_store[sid] = {"role": "guest"}

	resp.set_cookie(COOKIE_NAME, sid, httponly=True, path="/")
	return resp    

# /flag (GET)
@app.get("/flag")
def flag():
    sid = request.cookies.get(COOKIE_NAME)
    with _lock:
        # 쿠키에 sid 값이 없거나 딕셔너리에 없으면
        if not sid or sid not in _store:
            return jsonify({"error": "no session"}), 401
        
		# role == admin이면
        if _store[sid].get("role") == "admin" :
            return jsonify({"flag": FLAG_VALUE}), 200
        
        # 현재 role 정보 반환
        return jsonify(_store[sid]), 200    

@app.get("/")
def root():
	return "hello~"

# /xss (GET)
@app.get("/xss")
def xss():
    # payload 파라미터를 받음
	payload = request.args.get("payload", "")
    
	# blacklist
	blacklist = [
		"<img", "</img",
		"<svg", "</svg",
		"<iframe", "</iframe",
		"<object", "</object",
		"<embed", "</embed",
		"<link", "</link",
		"<meta", "</meta",
		"<style", "</style",
		"<base", "</base",
		"<form", "</form",
		"<input", "</input",
		"<textarea", "</textarea",
		"<button", "</button",
		"<video", "</video",
		"<audio", "</audio",
		"<source", "</source",
		"<track", "</track",
		"<math", "</math",
		"<applet", "</applet",
		"<frame", "</frame",
		"<frameset", "</frameset",
		"onerror=",
		"onload=",
		"onclick=",
		"onmouseover=",
		"onfocus=",
		"onblur=",
		"onsubmit=",
        "window",
		"oninput=",
		"onchange=",
		"onkeydown=",
		"onkeypress=",
		"onkeyup=",
		"srcdoc=",
		"javascript:",
		"vbscript:",
		"data:",
		"document.cookie",
		"eval(",
		"settimeout(",
		"setinterval(",
        "[",
        "/*",
        "*/"
	]

	t = payload.lower()

    # blacklist 문자열이 하나라도 포함되면 melong 반환
	for bad in blacklist:
		if bad in t:
			return "melong"

    # payload 반환    
	return payload

# /admin (GET)
@app.get("/admin")
def testPage():
    # path 파라미터를 받음
    raw_path = request.args.get("path", "")

	# path 값이 없을 경우
    if not raw_path:
        return "missing path", 400

	# 절대 URL 금지 + scheme/netloc 금지 + // 금지 + CRLF 금지
    s = urlsplit(raw_path)
    if s.scheme or s.netloc or raw_path.startswith("//") or ("\r" in raw_path or "\n" in raw_path):
        return "only path is allowed", 400

	# path가 /로 시작하지 않을 경우
    if not raw_path.startswith("/"):
        raw_path = "/" + raw_path

	# 최종 target url 설정
    BASE = "http://localhost:5000"
    target = BASE + raw_path
    login_url = BASE + "/login?id=admin&password=[FAKE_PASSWORD]"

    # bot 설정
    opts = Options()
    opts.add_argument("--headless=new")
    opts.add_argument("--no-sandbox")
    opts.add_argument("--disable-dev-shm-usage")
    opts.add_argument("--disable-gpu")

    driver = None

    try:
        driver = webdriver.Chrome(options=opts)

        # 1. GET /
        driver.get(BASE + "/")
        # 2. GET target
        driver.get(target)
        time.sleep(5)

        # 3. GET /login?id=admin&password=...
        driver.get(login_url)
        time.sleep(1)

        return jsonify({"success": True})
    except Exception:
        return jsonify({"success": False}), 500
    finally:
        if driver:
            driver.quit()

if __name__ == "__main__":
	app.run("0.0.0.0", 5000, threaded=True, use_reloader=False)
```

1. /xss
`payload`를 그대로 응답 바디로 내보낸다.
`<script>`를 차단하지 않는다.
같은 오리진에서 권한 있는 요청을 대신 보낼 수 있다.
DOM 변조, 피싱 UI, 내부 기능 호출이 가능하다.

2. /login
`/login`이 GET 방식이고, CSRF 토큰이 없고, `SameSite`도 설정하지 않았다.

```python
# 쿠키에 sid값이 없거나 딕셔너리에 sid가 없으면
if (not sid) or (sid not in _store):
    sid = newSid()
# 새 sid 발급
_store[sid] = {"role": "admin"}
```

이미 존재하는 sid를 재사용하여 권한 상승이 가능하다.

## Payload

1. admin이 접속한 쿠키값 정보를 들고
2. flag에 접속을 하면 됨
admin에 접속하면 bot이 새로운 브라우저를 생성하기 때문에 쿠키값을 가져오는 것이 쉽지 않음


xss?payload=
<script>(async () => {const r = await fetch("127.0.0.1:5000/admin?path=login", { credentials: "include" });console.log("status:", r.status);console.log(await r.text());})();</script>

## 참고
