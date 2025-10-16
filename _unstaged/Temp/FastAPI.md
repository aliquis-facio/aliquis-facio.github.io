# **개발 완료 시 비활성/제거**

## 디버깅 전용 (프로덕션 비활성)

1. **GET `/debug/measurements`**
    
    - 내부 스키마(`SHOW MEASUREMENTS`) 노출. 운영에 필요 없음. 성능/보안상 제거.
        
2. **임의 InfluxQL 실행 계열**(있다면)
    
    - 예: `/debug/query`, `/debug/series`, `/debug/rp`, `/debug/cq` 등 “SHOW …/RAW QUERY” 라우트. 운영 비활성.
        
3. **문서 UI**
    
    - **`/docs`(Swagger), `/redoc`, `/openapi.json`**: 운영 노출 불필요. 필요 시 관리자 보호.
        

> 주의: **`/influx/read`**는 프런트/서비스에서 실제로 쓰면 운영 유지 대상입니다. 다만 “임의 쿼리 문자열”을 받아 그대로 실행하는 형태라면 디버그 취급(운영 금지)입니다. 현재처럼 **measurement/tags/limit만 허용하는 정해진 읽기**라면 운영 유지 가능.

## 운영 유지 (필요)

- **`/fall`**(낙상 기록/알림)
    
- **`/healthz`**(헬스체크)
    
- **`/influx/read`**(※ 위 조건 충족 시) — measurement 화이트리스트/limit 상한/정렬 제한 필수
    

---

## 적용 스위치(예시)

### 1) 디버그 라우터 조건부 등록

```python
# app/main.py
from core.config import settings
from app.api.debug_routes import router as debug_router

if settings.env != "prod":
    app.include_router(debug_router, tags=["Debug"])
# prod에서는 미등록
```

### 2) 문서 UI 비활성(프로덕션)

```python
# app/__init__.py or main.py
from core.config import settings
app = FastAPI(
    title="CareDian Gateway",
    docs_url=None if settings.env == "prod" else "/docs",
    redoc_url=None if settings.env == "prod" else "/redoc",
    openapi_url=None if settings.env == "prod" else "/openapi.json",
)
```

### 3) `/influx/read`를 운영 라우트로 쓸 경우 최소 방어

- measurement 화이트리스트(예: `ppm, fall_events`),
    
- limit 상한(예: 최대 10_000),
    
- 정렬/시간 범위 강제(`$timeFilter` 유사),
    
- 태그 키/값 정규식 검증.
    

```python
ALLOWED_MEASUREMENTS = {"ppm", "fall_events"}
MAX_LIMIT = 10_000

def guard_read_params(measurement: str, limit: int, tags: dict):
    if measurement not in ALLOWED_MEASUREMENTS:
        raise HTTPException(400, "measurement not allowed")
    if not (1 <= limit <= MAX_LIMIT):
        raise HTTPException(400, "invalid limit")
    # 태그 키/값 화이트리스트/정규식 검사 추가 권장
```

---

### 체크리스트 요약

-  `/debug/measurements` 및 “SHOW/RAW” 계열 라우트 → **운영 미노출**
    
-  `/docs`/`/redoc`/`/openapi.json` → **운영 비활성 또는 관리자 보호**
    
-  `/influx/read`를 운영에 남길 경우 파라미터 **화이트리스트/상한** 적용
    
-  핵심 운영 라우트(`/fall`, `/healthz`)만 깔끔하게 유지