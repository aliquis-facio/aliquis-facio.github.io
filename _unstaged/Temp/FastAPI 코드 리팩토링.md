아래처럼 **레이어 분리 + 의존성 역전**을 적용해 SOLID에 맞게 리팩토링했습니다.  
기존 엔드포인트는 유지하면서, 테스트/교체가 쉬운 구조로 바꿉니다.

---

# 1) 도메인 포트(인터페이스) 정의

`app/domain/ports.py`

```python
from __future__ import annotations
from typing import Protocol, List, Dict, Any, Union

class InfluxReadRepository(Protocol):
    def healthy(self) -> bool: ...
    def list_measurements(self, limit: int = 100) -> List[Dict[str, Any]]: ...
    def query_raw(self, q: str) -> List[Dict[str, Any]]: ...
    def select_range(
        self,
        measurement: str,
        start_ago: str = "1h",
        fields: List[str] | None = None,
        tags: Dict[str, str] | None = None,
        limit: int = 100,
        desc: bool = True,
    ) -> List[Dict[str, Any]]: ...

class InfluxWriteRepository(Protocol):
    def write_json(self, points: List[Dict[str, Any]], time_precision: str = "ms") -> int: ...
    def write_line(self, lines: Union[str, List[str]]) -> int: ...

class InfluxRepository(InfluxReadRepository, InfluxWriteRepository, Protocol):
    """읽기/쓰기 통합 포트"""
    pass
```

- **SRP/ISP**: API가 필요한 기능만 의존(읽기만 필요하면 `InfluxReadRepository` 주입).
    

---

# 2) 인프라 구현(기존 클라이언트 재사용)

`app/infrastructure/influx_repo.py`

```python
from __future__ import annotations
from typing import List, Dict, Any, Union
from app.domain.ports import InfluxRepository
from app.services.influx_v1 import InfluxServiceV1

class InfluxRepo(InfluxRepository):
    """Infrastructure: InfluxServiceV1를 감싼 어댑터(Repository)"""
    def __init__(self, client: InfluxServiceV1):
        self._c = client

    # Health
    def healthy(self) -> bool:
        return self._c.healthy()

    # Read
    def list_measurements(self, limit: int = 100) -> List[Dict[str, Any]]:
        return self._c.query_raw(f"SHOW MEASUREMENTS LIMIT {int(limit)}")

    def query_raw(self, q: str) -> List[Dict[str, Any]]:
        return self._c.query_raw(q)

    def select_range(
        self,
        measurement: str,
        start_ago: str = "1h",
        fields: List[str] | None = None,
        tags: Dict[str, str] | None = None,
        limit: int = 100,
        desc: bool = True,
    ) -> List[Dict[str, Any]]:
        return self._c.select_range(measurement, start_ago, fields, tags, limit, desc)

    # Write
    def write_json(self, points: List[Dict[str, Any]], time_precision: str = "ms") -> int:
        return self._c.write_json(points, time_precision)

    def write_line(self, lines: Union[str, List[str]]) -> int:
        return self._c.write_line(lines)
```

- **LSP**: 포트(Protocol) 계약을 그대로 구현 → 다른 저장소로 대체 가능.
    

---

# 3) 유스케이스 계층

`app/application/use_cases.py`

```python
from __future__ import annotations
from typing import List, Dict, Any, Optional
from dataclasses import dataclass
from app.domain.ports import InfluxReadRepository, InfluxRepository

@dataclass(frozen=True)
class GetMeasurements:
    repo: InfluxReadRepository
    def __call__(self, limit: int = 100) -> List[Dict[str, Any]]:
        return self.repo.list_measurements(limit)

@dataclass(frozen=True)
class GetLatestPoints:
    repo: InfluxReadRepository
    def __call__(self, measurement: str, limit: int = 5) -> List[Dict[str, Any]]:
        q = f'SELECT * FROM "{measurement}" ORDER BY time DESC LIMIT {int(limit)}'
        return self.repo.query_raw(q)

@dataclass(frozen=True)
class SelectRange:
    repo: InfluxReadRepository
    def __call__(
        self, measurement: str, start_ago: str = "1h",
        fields: Optional[List[str]] = None, tags: Optional[Dict[str, str]] = None,
        limit: int = 100, desc: bool = True
    ) -> List[Dict[str, Any]]:
        return self.repo.select_range(measurement, start_ago, fields, tags, limit, desc)

@dataclass(frozen=True)
class WriteJsonPoints:
    repo: InfluxRepository
    def __call__(self, points: List[Dict[str, Any]]) -> int:
        return self.repo.write_json(points)

@dataclass(frozen=True)
class WriteLinePoints:
    repo: InfluxRepository
    def __call__(self, lines: str) -> int:
        return self.repo.write_line(lines)
```

- **OCP**: 새 유스케이스는 기존 인터페이스를 통해 추가(기존 코드 수정 최소화).
    

---

# 4) DI(의존성 주입) 팩토리

`app/api/di.py`

```python
from __future__ import annotations
from functools import lru_cache
from app.core.config import settings
from app.services.influx_v1 import InfluxServiceV1
from app.infrastructure.influx_repo import InfluxRepo
from app.domain.ports import InfluxRepository

@lru_cache
def get_influx_repo() -> InfluxRepository:
    verify_arg = getattr(settings, "influx_ca_cert", None) or settings.influx_verify_tls
    client = InfluxServiceV1(
        url=settings.influx_url,            # settings에 맞게
        database=settings.influx_db,
        username=settings.influx_username,
        password=settings.influx_password,
        timeout_ms=int(settings.influx_timeout_sec * 1000),
        verify_ssl=verify_arg,
    )
    return InfluxRepo(client)
```

- **DIP**: 라우트/유스케이스는 구현체를 모르고 **포트(인터페이스)**에만 의존.
    

---

# 5) API 라우터 (컨트롤러)

`app/api/influx.py`

```python
from __future__ import annotations
from fastapi import APIRouter, Depends, Query, Body, HTTPException
from typing import Optional, Dict, List, Union
import json
from app.api.di import get_influx_repo
from app.domain.ports import InfluxRepository, InfluxReadRepository
from app.application.use_cases import (
    GetMeasurements, GetLatestPoints, SelectRange, WriteJsonPoints, WriteLinePoints
)
from app.core.config import settings

router = APIRouter(prefix="/influx", tags=["influx"])

# Health
@router.get("/ping")
def ping(repo: InfluxReadRepository = Depends(get_influx_repo)):
    return {"ok": repo.healthy()}

# Measurements
@router.get("/measurements")
def measurements(limit: int = Query(100, ge=1, le=10_000),
                 repo: InfluxReadRepository = Depends(get_influx_repo)):
    return GetMeasurements(repo)(limit)

# Latest N
@router.get("/latest")
def latest(
    measurement: str = Query(default=settings.influx_measurement),
    limit: int = Query(5, ge=1, le=1000),
    repo: InfluxReadRepository = Depends(get_influx_repo),
):
    return GetLatestPoints(repo)(measurement, limit)

# Select range with filters
@router.get("/read")
def read(
    measurement: str = Query(default=settings.influx_measurement),
    start_ago: str = Query(default="1h", pattern=r"^\d+[smhdw]$"),
    fields: Optional[str] = Query(default=None, description="CSV, 예: value,confidence"),
    tags: Optional[str] = Query(default=None, description='JSON, 예: {"device_id":"esp32"}'),
    limit: int = Query(default=100, ge=1, le=5000),
    desc: bool = Query(default=True),
    repo: InfluxReadRepository = Depends(get_influx_repo),
):
    fields_list = [f.strip() for f in fields.split(",")] if fields else None
    tags_dict = None
    if tags:
        try:
            tags_dict = json.loads(tags)
        except Exception:
            raise HTTPException(status_code=400, detail="tags must be JSON")
    return SelectRange(repo)(measurement, start_ago, fields_list, tags_dict, limit, desc)

# Raw query (admin)
class RawQueryBody(typing.TypedDict):
    q: str

@router.post("/query")
def raw_query(body: RawQueryBody, repo: InfluxReadRepository = Depends(get_influx_repo)):
    return repo.query_raw(body["q"])

# Write (JSON)
class WritePoint(typing.TypedDict, total=False):
    measurement: str
    tags: Dict[str, str]
    fields: Dict[str, Union[int, float, str, bool]]
    time: Union[str, int]

class WriteBody(typing.TypedDict):
    points: List[WritePoint]
    default_measurement: str

@router.post("/write/json")
def write_json(body: WriteBody,
               repo: InfluxRepository = Depends(get_influx_repo)):
    default_m = body.get("default_measurement") or settings.influx_measurement
    pts: List[Dict] = []
    for p in body["points"]:
        pts.append({
            "measurement": p.get("measurement") or default_m,
            "tags": p.get("tags") or {},
            "fields": p["fields"],
            **({"time": p["time"]} if "time" in p else {}),
        })
    n = WriteJsonPoints(repo)(pts)
    return {"written": n}

# Write (line protocol)
@router.post("/write/line")
def write_line(lines: str = Body(..., media_type="text/plain"),
               repo: InfluxRepository = Depends(get_influx_repo)):
    n = WriteLinePoints(repo)(lines)
    return {"written": n}
```

- **SRP**: 라우터는 HTTP→유스케이스 호출만.
    
- **테스트 용이**: `get_influx_repo`에 **테스트 더블** 주입하면 바로 단위테스트 가능.
    

---

# 6) 앱 조립

`app/main.py` (핵심부분)

```python
from fastapi import FastAPI
from app.core.config import settings
from app.api.influx import router as influx_router

app = FastAPI(title=settings.app_name, docs_url="/docs" if settings.enable_docs else None)

@app.get("/healthz")
def healthz():
    return {"status": "ok"}

# readiness는 실제 저장소 상태 반영
from app.api.di import get_influx_repo
@app.get("/readyz")
def readyz(repo = Depends(get_influx_repo)):
    return {"status": "ready" if repo.healthy() else "not-ready"}

app.include_router(influx_router)
```

---

# 7) 요약 (SOLID 매핑)

- **S (단일 책임)**:
    
    - Repo 구현(인프라) ↔ 유스케이스(도메인 로직) ↔ 라우터(입출력 변환) 분리
        
- **O (개방-폐쇄)**:
    
    - 새 기능은 유스케이스/라우터 추가로 확장, 기존 코드 최소 변경
        
- **L (리스코프 치환)**:
    
    - 포트(프로토콜)를 구현한 어떤 저장소라도 교체 가능(메모리, Mock, 다른 TSDB)
        
- **I (인터페이스 분리)**:
    
    - 읽기/쓰기 포트 분리로 최소 의존
        
- **D (의존성 역전)**:
    
    - 상위(유스케이스/라우터)는 추상(포트)에 의존. 구현체는 DI로 주입
        

---

## 적용 순서

1. 위 5개 파일 추가/교체
    
2. `app/services/influx_v1.py`는 **무변**(기존 코드 재사용)
    
3. 서버 기동 후 확인:
    

```bash
uvicorn app.main:app --reload --host 0.0.0.0
curl -s http://127.0.0.1:8000/influx/measurements
curl -s "http://127.0.0.1:8000/influx/latest?measurement=fall_events&limit=5"
```

원하면 이후에 **테스트 더블(페이크 Repo)** 샘플과 **의존성 주입 오버라이드**(FastAPI `dependency_overrides`) 예제를 추가해 드릴게요.