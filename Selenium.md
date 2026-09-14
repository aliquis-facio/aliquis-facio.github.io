`execute_cdp_cmd()`: Selenium4에서 크롬 개발자 도구 프로토콜(CDP) 명령어를 직접 실행할 수 있는 method

## 기본 사용법

- Chromium 기반 브라우저 드라이버에서만 작동
- 명령어 이름과 매개변수 딕셔너리를 전달

```python
from selenium import webdriver

driver = webdriver.Chrome()

# 예시: User-Agent 오버라이드
driver.execute_cdp_cmd(
	"Network.setUserAgentOverride",
	{"userAgent": "MyCustomAgent"},
)

driver.get("https://google.com")
driver.quit()
```

## 주요 활용처

- **네트워크 제어:** [Network.setBlockedURLs](https://medium.com/@david.henry.124/how-to-use-selenium-with-python-for-web-scraping-in-2026-2cbd99b427a6) 등을 통해 특정 이미지나 리소스 로딩 차단
- **네트워크 응답 가로채기:** `Network.getResponseBody`로 XHR/네트워크 응답 데이터 확인
- **디바이스 에뮬레이션:** 화면 크기, 위치 정보(Geolocation) 동적 변경
