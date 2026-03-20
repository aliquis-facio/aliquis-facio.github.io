# FastAPI + SQLAlchemy 개선판 전체 코드

아래 코드는 업로드된 기획/설계/MVP 문서를 바탕으로 정리한 **실행 가능한 개선판**이다. 주요 반영 사항은 다음과 같다.

* `master_place_id` 기반 조회 흐름 유지
* 서비스 레이어 / CRUD / 스키마 분리
* pipeline 실행 시 `commit/rollback` 처리
* 조회용 GET API 추가
* 더미 collector 기반으로 바로 실행 가능
* 카테고리별 aspect 사전 반영
* 리뷰/플랫폼/최종 리포트 저장 구조 반영

---

## 프로젝트 구조

```text
place_preference_fastapi/
├─ app/
│  ├─ __init__.py
│  ├─ main.py
│  ├─ api/
│  │  ├─ __init__.py
│  │  └─ routes.py
│  ├─ core/
│  │  ├─ __init__.py
│  │  ├─ config.py
│  │  └─ database.py
│  ├─ crud/
│  │  ├─ __init__.py
│  │  └─ repository.py
│  ├─ models/
│  │  ├─ __init__.py
│  │  ├─ place.py
│  │  ├─ review.py
│  │  └─ report.py
│  ├─ schemas/
│  │  ├─ __init__.py
│  │  ├─ common.py
│  │  ├─ place.py
│  │  └─ report.py
│  └─ services/
│     ├─ __init__.py
│     ├─ aspect_extractor.py
│     ├─ collectors.py
│     ├─ comparator.py
│     ├─ pipeline.py
│     ├─ place_matcher.py
│     ├─ preprocess.py
│     ├─ scorer.py
│     └─ sentiment.py
├─ requirements.txt
└─ run.py
```

---

## requirements.txt

```txt
fastapi>=0.115
uvicorn[standard]>=0.30
sqlalchemy>=2.0
pydantic>=2.7
pydantic-settings>=2.3
python-dotenv>=1.0
```

---

## app/**init**.py

```python
# empty
```

---

## app/core/**init**.py

```python
# empty
```

---

## app/core/config.py

```python
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Place Preference API"
    app_version: str = "1.1.0"
    debug: bool = True
    database_url: str = "sqlite:///./place_preference.db"
    api_prefix: str = "/api"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
```

---

## app/core/database.py

```python
from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.core.config import settings


engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False} if settings.database_url.startswith("sqlite") else {},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

---

## app/models/place.py

```python
from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class Place(Base):
    __tablename__ = "places"

    id = Column(Integer, primary_key=True, index=True)
    master_place_id = Column(String(40), unique=True, nullable=False, index=True)
    place_name = Column(String(255), nullable=False, index=True)
    category_main = Column(String(50), nullable=False, index=True)
    category_sub = Column(String(100), nullable=True)
    address = Column(Text, nullable=True)
    road_address = Column(Text, nullable=True)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    phone = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    platform_places = relationship("PlatformPlace", back_populates="place", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="place", cascade="all, delete-orphan")
    platform_summaries = relationship("PlatformSummary", back_populates="place", cascade="all, delete-orphan")
    final_report = relationship("FinalPlaceReport", back_populates="place", uselist=False, cascade="all, delete-orphan")


class PlatformPlace(Base):
    __tablename__ = "platform_places"
    __table_args__ = (UniqueConstraint("platform", "platform_place_id", name="uq_platform_place"),)

    id = Column(Integer, primary_key=True, index=True)
    place_id = Column(Integer, ForeignKey("places.id"), nullable=False, index=True)
    platform = Column(String(20), nullable=False, index=True)
    platform_place_id = Column(String(255), nullable=False, index=True)
    platform_place_name = Column(String(255), nullable=True)
    platform_category = Column(String(100), nullable=True)
    platform_address = Column(Text, nullable=True)
    platform_rating = Column(Float, nullable=True)
    platform_review_count = Column(Integer, default=0)
    source_url = Column(Text, nullable=True)
    matched_confidence = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    place = relationship("Place", back_populates="platform_places")
```

---

## app/models/review.py

```python
from sqlalchemy import Boolean, Column, Date, DateTime, Float, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class Review(Base):
    __tablename__ = "reviews"
    __table_args__ = (UniqueConstraint("platform", "platform_review_id", name="uq_platform_review"),)

    id = Column(Integer, primary_key=True, index=True)
    review_id = Column(String(60), unique=True, nullable=False, index=True)
    place_id = Column(Integer, ForeignKey("places.id"), nullable=False, index=True)
    platform = Column(String(20), nullable=False, index=True)
    platform_place_id = Column(String(255), nullable=True)
    platform_review_id = Column(String(255), nullable=True)
    reviewer_id_hash = Column(String(255), nullable=True)
    reviewer_name_raw = Column(String(255), nullable=True)
    rating = Column(Float, nullable=True)
    review_text = Column(Text, nullable=False)
    normalized_text = Column(Text, nullable=True)
    review_date = Column(Date, nullable=True)
    like_count = Column(Integer, default=0)
    has_photo = Column(Boolean, default=False)
    visit_verified = Column(Boolean, default=False)
    language = Column(String(20), nullable=True)
    duplicate_group_id = Column(String(60), nullable=True)
    duplicate_score = Column(Float, default=0.0)
    source_url = Column(Text, nullable=True)
    collected_at = Column(DateTime(timezone=True), server_default=func.now())

    place = relationship("Place", back_populates="reviews")
    sentences = relationship("ReviewSentence", back_populates="review", cascade="all, delete-orphan")
    analysis = relationship("ReviewAnalysis", back_populates="review", uselist=False, cascade="all, delete-orphan")
    aspect_analyses = relationship("AspectAnalysis", back_populates="review", cascade="all, delete-orphan")


class ReviewSentence(Base):
    __tablename__ = "review_sentences"

    id = Column(Integer, primary_key=True, index=True)
    review_id_fk = Column(Integer, ForeignKey("reviews.id"), nullable=False, index=True)
    sentence_order = Column(Integer, nullable=False)
    sentence_text = Column(Text, nullable=False)
    normalized_sentence = Column(Text, nullable=True)
    sentence_length = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    review = relationship("Review", back_populates="sentences")
    aspect_analyses = relationship("AspectAnalysis", back_populates="sentence")


class ReviewAnalysis(Base):
    __tablename__ = "review_analyses"

    id = Column(Integer, primary_key=True, index=True)
    review_id_fk = Column(Integer, ForeignKey("reviews.id"), unique=True, nullable=False, index=True)
    sentiment_label = Column(String(20), nullable=True)
    sentiment_score = Column(Float, default=0.0)
    emotion_intensity = Column(Float, default=0.0)
    revisit_intent_label = Column(String(20), nullable=True)
    revisit_intent_score = Column(Float, default=0.0)
    recommend_intent_label = Column(String(20), nullable=True)
    recommend_intent_score = Column(Float, default=0.0)
    informativeness_score = Column(Float, default=0.0)
    credibility_score = Column(Float, default=0.0)
    freshness_score = Column(Float, default=0.0)
    final_review_weight = Column(Float, default=1.0)
    confidence_score = Column(Float, default=0.0)
    analyzed_at = Column(DateTime(timezone=True), server_default=func.now())

    review = relationship("Review", back_populates="analysis")


class AspectAnalysis(Base):
    __tablename__ = "aspect_analyses"

    id = Column(Integer, primary_key=True, index=True)
    review_id_fk = Column(Integer, ForeignKey("reviews.id"), nullable=False, index=True)
    sentence_id_fk = Column(Integer, ForeignKey("review_sentences.id"), nullable=True, index=True)
    aspect_name = Column(String(100), nullable=False, index=True)
    aspect_group = Column(String(50), nullable=True)
    aspect_sentiment_label = Column(String(20), nullable=True)
    aspect_sentiment_score = Column(Float, default=0.0)
    mention_confidence = Column(Float, default=0.0)
    sentiment_confidence = Column(Float, default=0.0)
    evidence_text = Column(Text, nullable=True)
    evidence_start = Column(Integer, nullable=True)
    evidence_end = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    review = relationship("Review", back_populates="aspect_analyses")
    sentence = relationship("ReviewSentence", back_populates="aspect_analyses")
```

---

## app/models/report.py

```python
from sqlalchemy import JSON, Column, DateTime, Float, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class PlatformSummary(Base):
    __tablename__ = "platform_summaries"
    __table_args__ = (UniqueConstraint("place_id", "platform", name="uq_place_platform_summary"),)

    id = Column(Integer, primary_key=True, index=True)
    place_id = Column(Integer, ForeignKey("places.id"), nullable=False, index=True)
    platform = Column(String(20), nullable=False, index=True)
    review_count = Column(Integer, default=0)
    valid_review_count = Column(Integer, default=0)
    avg_rating = Column(Float, nullable=True)
    overall_sentiment_score = Column(Float, default=0.0)
    aspect_score = Column(Float, default=0.0)
    revisit_score = Column(Float, default=0.0)
    recommend_score = Column(Float, default=0.0)
    freshness_score = Column(Float, default=0.0)
    platform_preference_score = Column(Float, default=0.0)
    summary_json = Column(JSON, default=dict)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    place = relationship("Place", back_populates="platform_summaries")


class FinalPlaceReport(Base):
    __tablename__ = "final_place_reports"

    id = Column(Integer, primary_key=True, index=True)
    place_id = Column(Integer, ForeignKey("places.id"), unique=True, nullable=False, index=True)
    final_preference_score = Column(Float, default=0.0)
    consistency_score = Column(Float, default=0.0)
    inconsistency_penalty = Column(Float, default=0.0)
    strongest_aspects_json = Column(JSON, default=list)
    weakest_aspects_json = Column(JSON, default=list)
    common_strengths_json = Column(JSON, default=list)
    common_weaknesses_json = Column(JSON, default=list)
    platform_differences_json = Column(JSON, default=list)
    final_report_json = Column(JSON, default=dict)
    generated_at = Column(DateTime(timezone=True), server_default=func.now())

    place = relationship("Place", back_populates="final_report")
```

---

## app/models/**init**.py

```python
from app.models.place import Place, PlatformPlace
from app.models.report import FinalPlaceReport, PlatformSummary
from app.models.review import AspectAnalysis, Review, ReviewAnalysis, ReviewSentence

__all__ = [
    "Place",
    "PlatformPlace",
    "Review",
    "ReviewSentence",
    "ReviewAnalysis",
    "AspectAnalysis",
    "PlatformSummary",
    "FinalPlaceReport",
]
```

---

## app/schemas/**init**.py

```python
# empty
```

---

## app/schemas/common.py

```python
from pydantic import BaseModel, ConfigDict


class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)
```

---

## app/schemas/place.py

```python
from typing import Literal

from pydantic import BaseModel, Field


class PlaceCreateRequest(BaseModel):
    place_name: str = Field(..., min_length=1, max_length=255)
    category_main: Literal["restaurant", "cafe", "attraction"]
    category_sub: str | None = None
    max_reviews_per_platform: int = Field(default=50, ge=1, le=300)


class PlaceSummaryResponse(BaseModel):
    master_place_id: str
    place_name: str
    category_main: str
    review_count: int
    platform_count: int
```

---

## app/schemas/report.py

```python
from pydantic import BaseModel


class FinalReportResponse(BaseModel):
    master_place_id: str
    place_name: str
    category_main: str
    final_preference_score: float
    consistency_score: float
    inconsistency_penalty: float
    platform_scores: dict[str, float]
    common_strengths: list[str]
    common_weaknesses: list[str]
    platform_differences: list[str]
    aspect_summary_by_platform: dict[str, dict[str, float]]
    review_volume_by_platform: dict[str, int]
```

---

## app/crud/**init**.py

```python
# empty
```

---

## app/crud/repository.py

```python
from sqlalchemy.orm import Session, joinedload

from app.models import (
    AspectAnalysis,
    FinalPlaceReport,
    Place,
    PlatformPlace,
    PlatformSummary,
    Review,
    ReviewAnalysis,
    ReviewSentence,
)


class Repository:
    def __init__(self, db: Session):
        self.db = db

    def create_place(self, **kwargs) -> Place:
        obj = Place(**kwargs)
        self.db.add(obj)
        self.db.flush()
        return obj

    def create_platform_place(self, **kwargs) -> PlatformPlace:
        obj = PlatformPlace(**kwargs)
        self.db.add(obj)
        self.db.flush()
        return obj

    def create_review(self, **kwargs) -> Review:
        obj = Review(**kwargs)
        self.db.add(obj)
        self.db.flush()
        return obj

    def create_review_sentence(self, **kwargs) -> ReviewSentence:
        obj = ReviewSentence(**kwargs)
        self.db.add(obj)
        self.db.flush()
        return obj

    def create_review_analysis(self, **kwargs) -> ReviewAnalysis:
        obj = ReviewAnalysis(**kwargs)
        self.db.add(obj)
        self.db.flush()
        return obj

    def create_aspect_analysis(self, **kwargs) -> AspectAnalysis:
        obj = AspectAnalysis(**kwargs)
        self.db.add(obj)
        self.db.flush()
        return obj

    def create_platform_summary(self, **kwargs) -> PlatformSummary:
        obj = PlatformSummary(**kwargs)
        self.db.add(obj)
        self.db.flush()
        return obj

    def create_final_report(self, **kwargs) -> FinalPlaceReport:
        obj = FinalPlaceReport(**kwargs)
        self.db.add(obj)
        self.db.flush()
        return obj

    def get_place_by_master_place_id(self, master_place_id: str) -> Place | None:
        return (
            self.db.query(Place)
            .options(
                joinedload(Place.platform_places),
                joinedload(Place.reviews),
                joinedload(Place.platform_summaries),
                joinedload(Place.final_report),
            )
            .filter(Place.master_place_id == master_place_id)
            .first()
        )

    def get_all_places(self) -> list[Place]:
        return self.db.query(Place).order_by(Place.id.desc()).all()

    def get_final_report_by_master_place_id(self, master_place_id: str) -> FinalPlaceReport | None:
        return (
            self.db.query(FinalPlaceReport)
            .join(Place, FinalPlaceReport.place_id == Place.id)
            .filter(Place.master_place_id == master_place_id)
            .first()
        )

    def get_reviews_by_master_place_id(self, master_place_id: str) -> list[Review]:
        return (
            self.db.query(Review)
            .join(Place, Review.place_id == Place.id)
            .filter(Place.master_place_id == master_place_id)
            .order_by(Review.id.asc())
            .all()
        )
```

---

## app/services/**init**.py

```python
# empty
```

---

## app/services/collectors.py

```python
from __future__ import annotations

from typing import Any


class BaseReviewCollector:
    platform_name = "base"

    def search_place(self, query: str) -> list[dict[str, Any]]:
        raise NotImplementedError

    def get_place_detail(self, place_id: str) -> dict[str, Any]:
        raise NotImplementedError

    def get_reviews(self, place_id: str, max_reviews: int = 100) -> list[dict[str, Any]]:
        raise NotImplementedError


class DummyGoogleCollector(BaseReviewCollector):
    platform_name = "google"

    def search_place(self, query: str) -> list[dict[str, Any]]:
        return [{
            "platform_place_id": "g_001",
            "name": query,
            "address": "서울 강남구 예시로 1",
            "rating": 4.4,
            "review_count": 4,
            "source_url": "https://example.com/google/place/g_001",
        }]

    def get_place_detail(self, place_id: str) -> dict[str, Any]:
        return {
            "platform_place_id": place_id,
            "source_url": f"https://example.com/google/place/{place_id}",
        }

    def get_reviews(self, place_id: str, max_reviews: int = 100) -> list[dict[str, Any]]:
        return [
            {
                "platform_review_id": "g_r_1",
                "reviewer_name_raw": "user_g_1",
                "rating": 5,
                "review_text": "분위기가 좋고 커피도 맛있어요. 다음에 또 올게요.",
                "like_count": 2,
                "has_photo": True,
                "visit_verified": True,
                "source_url": "https://example.com/google/review/g_r_1",
            },
            {
                "platform_review_id": "g_r_2",
                "reviewer_name_raw": "user_g_2",
                "rating": 3,
                "review_text": "분위기는 괜찮은데 가격이 비싸요.",
                "like_count": 0,
                "has_photo": False,
                "visit_verified": False,
                "source_url": "https://example.com/google/review/g_r_2",
            },
        ][:max_reviews]


class DummyKakaoCollector(BaseReviewCollector):
    platform_name = "kakao"

    def search_place(self, query: str) -> list[dict[str, Any]]:
        return [{
            "platform_place_id": "k_001",
            "name": query,
            "address": "서울 강남구 예시로 1",
            "rating": 4.2,
            "review_count": 4,
            "source_url": "https://example.com/kakao/place/k_001",
        }]

    def get_place_detail(self, place_id: str) -> dict[str, Any]:
        return {
            "platform_place_id": place_id,
            "source_url": f"https://example.com/kakao/place/{place_id}",
        }

    def get_reviews(self, place_id: str, max_reviews: int = 100) -> list[dict[str, Any]]:
        return [
            {
                "platform_review_id": "k_r_1",
                "reviewer_name_raw": "user_k_1",
                "rating": 4,
                "review_text": "조용하고 작업하기 좋아요. 콘센트도 있고 좌석도 편해요.",
                "like_count": 1,
                "has_photo": False,
                "visit_verified": True,
                "source_url": "https://example.com/kakao/review/k_r_1",
            },
            {
                "platform_review_id": "k_r_2",
                "reviewer_name_raw": "user_k_2",
                "rating": 2,
                "review_text": "커피는 괜찮지만 너무 시끄럽고 주차가 불편해요.",
                "like_count": 0,
                "has_photo": False,
                "visit_verified": False,
                "source_url": "https://example.com/kakao/review/k_r_2",
            },
        ][:max_reviews]


class DummyNaverCollector(BaseReviewCollector):
    platform_name = "naver"

    def search_place(self, query: str) -> list[dict[str, Any]]:
        return [{
            "platform_place_id": "n_001",
            "name": query,
            "address": "서울 강남구 예시로 1",
            "rating": 4.6,
            "review_count": 4,
            "source_url": "https://example.com/naver/place/n_001",
        }]

    def get_place_detail(self, place_id: str) -> dict[str, Any]:
        return {
            "platform_place_id": place_id,
            "source_url": f"https://example.com/naver/place/{place_id}",
        }

    def get_reviews(self, place_id: str, max_reviews: int = 100) -> list[dict[str, Any]]:
        return [
            {
                "platform_review_id": "n_r_1",
                "reviewer_name_raw": "user_n_1",
                "rating": 5,
                "review_text": "디저트가 맛있고 인테리어가 예뻐요. 친구에게 추천합니다.",
                "like_count": 3,
                "has_photo": True,
                "visit_verified": True,
                "source_url": "https://example.com/naver/review/n_r_1",
            },
            {
                "platform_review_id": "n_r_2",
                "reviewer_name_raw": "user_n_2",
                "rating": 3,
                "review_text": "웨이팅이 조금 있고 가격은 아쉬워요. 그래도 다시 올 수는 있어요.",
                "like_count": 1,
                "has_photo": True,
                "visit_verified": True,
                "source_url": "https://example.com/naver/review/n_r_2",
            },
        ][:max_reviews]


def get_collectors() -> list[BaseReviewCollector]:
    return [DummyGoogleCollector(), DummyKakaoCollector(), DummyNaverCollector()]
```

---

## app/services/place_matcher.py

```python
from __future__ import annotations

import re
import uuid
from difflib import SequenceMatcher


class PlaceMatcher:
    def _normalize(self, value: str | None) -> str:
        if not value:
            return ""
        value = value.lower().strip()
        value = re.sub(r"\s+", "", value)
        return value

    def _similarity(self, a: str | None, b: str | None) -> float:
        na, nb = self._normalize(a), self._normalize(b)
        if not na or not nb:
            return 0.0
        return SequenceMatcher(None, na, nb).ratio()

    def match(self, query: str, category_main: str, platform_candidates: dict[str, list[dict]]) -> dict:
        master_place_id = f"P-{uuid.uuid4().hex[:8].upper()}"
        mappings: dict[str, dict] = {}

        for platform, candidates in platform_candidates.items():
            if not candidates:
                continue
            top = candidates[0]
            confidence = round(
                0.7 * self._similarity(query, top.get("name"))
                + 0.3 * self._similarity(top.get("address"), candidates[0].get("address")),
                3,
            )
            top["matched_confidence"] = confidence
            mappings[platform] = top

        return {
            "master_place_id": master_place_id,
            "place_name": query,
            "category_main": category_main,
            "mappings": mappings,
        }
```

---

## app/services/preprocess.py

```python
from __future__ import annotations

import hashlib
import re
from dataclasses import dataclass
from datetime import date
from math import exp


@dataclass
class DuplicateCheckResult:
    duplicate_group_id: str | None
    duplicate_score: float


class ReviewPreprocessor:
    def clean_text(self, text: str) -> str:
        text = text.strip()
        text = re.sub(r"<[^>]+>", " ", text)
        text = re.sub(r"[^\w\s가-힣.,!?]", " ", text)
        text = re.sub(r"\s+", " ", text)
        return text.strip()

    def normalize_text(self, text: str) -> str:
        text = self.clean_text(text)
        text = re.sub(r"([!?.])\1+", r"\1", text)
        text = re.sub(r"(.)\1{3,}", r"\1\1", text)
        return text

    def detect_language(self, text: str) -> str:
        if re.search(r"[가-힣]", text):
            return "ko"
        if re.search(r"[A-Za-z]", text):
            return "en"
        return "unknown"

    def split_sentences(self, text: str) -> list[str]:
        chunks = re.split(r"(?<=[.!?])\s+", text)
        return [chunk.strip() for chunk in chunks if chunk.strip()]

    def hash_reviewer(self, raw_name: str | None) -> str | None:
        if not raw_name:
            return None
        return hashlib.sha256(raw_name.encode("utf-8")).hexdigest()[:16]

    def check_duplicate(self, normalized_text: str) -> DuplicateCheckResult:
        duplicate_group_id = hashlib.md5(normalized_text.encode("utf-8")).hexdigest()[:12]
        return DuplicateCheckResult(duplicate_group_id=duplicate_group_id, duplicate_score=0.0)

    def calc_freshness_score(self, review_date: date | None) -> float:
        if not review_date:
            return 0.6
        days_since_review = max((date.today() - review_date).days, 0)
        return round(exp(-days_since_review / 180), 4)
```

---

## app/services/aspect_extractor.py

```python
ASPECT_DICTIONARY = {
    "restaurant": {
        "맛": ["맛", "음식", "풍미", "간", "고소", "짜", "싱겁"],
        "양": ["양", "푸짐", "적다", "많다"],
        "가격": ["가격", "비싸", "저렴", "가성비"],
        "서비스": ["친절", "불친절", "응대", "서빙", "직원"],
        "청결": ["청결", "깨끗", "위생"],
        "대기시간": ["웨이팅", "줄", "기다림", "대기"],
        "분위기": ["분위기", "인테리어", "감성"],
        "주차": ["주차", "주차장"],
    },
    "cafe": {
        "음료맛": ["커피", "음료", "라떼", "맛"],
        "디저트": ["디저트", "케이크", "빵"],
        "분위기": ["분위기", "감성", "무드", "인테리어", "예쁘"],
        "좌석": ["좌석", "의자", "테이블", "자리", "편해"],
        "작업적합성": ["노트북", "공부", "작업", "콘센트", "와이파이"],
        "소음": ["조용", "시끄럽", "소음"],
        "가격": ["가격", "비싸", "저렴", "가성비"],
        "청결": ["청결", "깨끗"],
        "주차": ["주차", "주차장"],
        "대기시간": ["웨이팅", "줄", "기다림", "대기"],
    },
    "attraction": {
        "경관": ["경치", "뷰", "풍경", "전망", "볼거리"],
        "접근성": ["접근성", "이동", "거리", "찾기"],
        "편의시설": ["화장실", "매점", "휴게", "편의시설"],
        "혼잡도": ["혼잡", "붐비", "사람 많"],
        "안전성": ["안전", "위험"],
        "체험성": ["체험", "재미", "활동"],
        "가족적합성": ["가족", "아이", "유아"],
        "사진적합성": ["사진", "포토", "인생샷"],
        "청결": ["청결", "깨끗"],
        "주차": ["주차", "주차장"],
    },
}


class AspectExtractor:
    def __init__(self, aspect_dictionary: dict | None = None):
        self.aspect_dictionary = aspect_dictionary or ASPECT_DICTIONARY

    def extract(self, sentence: str, category_main: str) -> list[str]:
        category_dict = self.aspect_dictionary.get(category_main, {})
        found: list[str] = []

        for aspect_name, keywords in category_dict.items():
            if any(keyword in sentence for keyword in keywords):
                found.append(aspect_name)

        return found

    def classify_group(self, category_main: str, aspect_name: str) -> str:
        core_by_category = {
            "restaurant": {"맛", "양", "가격", "서비스", "청결", "대기시간"},
            "cafe": {"음료맛", "디저트", "분위기", "좌석", "작업적합성", "가격"},
            "attraction": {"경관", "접근성", "편의시설", "혼잡도", "안전성", "체험성", "주차"},
        }
        if aspect_name in core_by_category.get(category_main, set()):
            return "core"
        return "category_specific"
```

---

## app/services/sentiment.py

```python
from __future__ import annotations

from dataclasses import dataclass


POSITIVE_WORDS = [
    "좋", "맛있", "훌륭", "깨끗", "친절", "추천", "조용", "편하", "예쁘", "최고",
    "만족", "괜찮", "다시", "재방문",
]
NEGATIVE_WORDS = [
    "별로", "나쁘", "비싸", "불편", "시끄럽", "불친절", "더럽", "아쉽", "기다", "혼잡",
    "불만", "최악", "비추천",
]


@dataclass
class AspectSentimentResult:
    aspect_name: str
    aspect_sentiment_label: str
    aspect_sentiment_score: float
    evidence_text: str
    mention_confidence: float
    sentiment_confidence: float


class SimpleSentimentAnalyzer:
    def analyze_overall(self, text: str) -> tuple[str, float]:
        pos = sum(1 for word in POSITIVE_WORDS if word in text)
        neg = sum(1 for word in NEGATIVE_WORDS if word in text)

        if pos + neg == 0:
            return "neutral", 0.0

        score = (pos - neg) / (pos + neg)
        if score > 0.2:
            return "positive", round(score, 4)
        if score < -0.2:
            return "negative", round(score, 4)
        return "neutral", round(score, 4)

    def emotion_intensity(self, text: str) -> float:
        pos = sum(1 for word in POSITIVE_WORDS if word in text)
        neg = sum(1 for word in NEGATIVE_WORDS if word in text)
        base = min(1.0, (pos + neg) / 4)
        return round(base, 4)

    def analyze_aspect(self, sentence: str, aspects: list[str]) -> list[AspectSentimentResult]:
        label, score = self.analyze_overall(sentence)
        results: list[AspectSentimentResult] = []
        for aspect in aspects:
            results.append(
                AspectSentimentResult(
                    aspect_name=aspect,
                    aspect_sentiment_label=label,
                    aspect_sentiment_score=score,
                    evidence_text=sentence,
                    mention_confidence=0.9,
                    sentiment_confidence=0.75,
                )
            )
        return results


class IntentDetector:
    REVISIT_POS = ["또 올", "재방문", "다시 올", "다시 방문", "단골"]
    REVISIT_NEG = ["다시는", "안 올", "한 번이면", "재방문 의사 없음"]
    RECOMMEND_POS = ["추천", "꼭 가", "가볼만", "친구에게 추천"]
    RECOMMEND_NEG = ["비추천", "추천 안", "굳이"]

    def detect_revisit(self, text: str) -> tuple[str, float]:
        if any(k in text for k in self.REVISIT_POS):
            return "positive", 1.0
        if any(k in text for k in self.REVISIT_NEG):
            return "negative", 0.0
        return "neutral", 0.5

    def detect_recommend(self, text: str) -> tuple[str, float]:
        if any(k in text for k in self.RECOMMEND_POS):
            return "positive", 1.0
        if any(k in text for k in self.RECOMMEND_NEG):
            return "negative", 0.0
        return "neutral", 0.5
```

---

## app/services/scorer.py

```python
from __future__ import annotations

from math import log
from statistics import mean, pstdev


class ReviewScorer:
    def score_review(
        self,
        overall_sentiment: float,
        aspect_avg: float,
        revisit_score: float,
        recommend_score: float,
    ) -> float:
        raw = (
            0.25 * overall_sentiment
            + 0.40 * aspect_avg
            + 0.20 * (2 * revisit_score - 1)
            + 0.15 * (2 * recommend_score - 1)
        )
        score_100 = (raw + 1) * 50
        return round(max(0.0, min(100.0, score_100)), 2)

    def calc_informativeness(self, token_count: int, mentioned_aspect_count: int) -> float:
        return round(min(1.0, 0.4 + 0.02 * token_count + 0.08 * mentioned_aspect_count), 4)

    def calc_credibility(
        self,
        has_photo: bool,
        visit_verified: bool,
        like_count: int,
        duplicate_risk: float,
    ) -> float:
        score = (
            1.0
            + (0.10 if has_photo else 0.0)
            + (0.05 if visit_verified else 0.0)
            + 0.03 * log(1 + like_count)
            - 0.25 * duplicate_risk
        )
        return round(score, 4)

    def calc_review_weight(self, freshness: float, informativeness: float, credibility: float) -> float:
        weight = freshness * informativeness * credibility
        return round(min(1.5, max(0.3, weight)), 4)


class PlatformScorer:
    def weighted_average(self, values: list[float], weights: list[float]) -> float:
        if not values or not weights:
            return 0.0
        denom = sum(weights)
        if denom == 0:
            return 0.0
        return round(sum(v * w for v, w in zip(values, weights)) / denom, 2)

    def aspect_weighted_average(self, values: list[float], weights: list[float], confidences: list[float]) -> float:
        if not values:
            return 0.0
        combined = [w * c for w, c in zip(weights, confidences)]
        denom = sum(combined)
        if denom == 0:
            return 0.0
        return round(sum(v * wc for v, wc in zip(values, combined)) / denom, 2)


class FinalPlaceScorer:
    PLATFORM_WEIGHTS = {
        "restaurant": {"google": 0.25, "kakao": 0.35, "naver": 0.40},
        "cafe": {"google": 0.20, "kakao": 0.35, "naver": 0.45},
        "attraction": {"google": 0.45, "kakao": 0.25, "naver": 0.30},
    }

    def summarize(self, category_main: str, platform_scores: dict[str, float]) -> tuple[float, float, float]:
        if not platform_scores:
            return 0.0, 0.0, 0.0

        weights = self.PLATFORM_WEIGHTS.get(category_main, {})
        weighted_sum = 0.0
        total_weight = 0.0
        for platform, score in platform_scores.items():
            weight = weights.get(platform, 1 / max(len(platform_scores), 1))
            weighted_sum += score * weight
            total_weight += weight

        weighted_avg = weighted_sum / total_weight if total_weight else mean(platform_scores.values())
        values = list(platform_scores.values())
        std = pstdev(values) if len(values) > 1 else 0.0
        penalty = min(15.0, std * 0.8)
        final_score = max(0.0, weighted_avg - penalty)
        consistency_score = max(0.0, 100.0 - std * 10)

        return round(final_score, 2), round(consistency_score, 2), round(penalty, 2)
```

---

## app/services/comparator.py

```python
class PlatformComparator:
    def find_common_strengths(self, aspect_summary_by_platform: dict[str, dict[str, float]]) -> list[str]:
        results: list[str] = []
        for aspect in self._collect_aspects(aspect_summary_by_platform):
            good_count = 0
            for platform_data in aspect_summary_by_platform.values():
                score = platform_data.get(aspect)
                if score is not None and score >= 75:
                    good_count += 1
            if good_count >= 2:
                results.append(aspect)
        return sorted(results)

    def find_common_weaknesses(self, aspect_summary_by_platform: dict[str, dict[str, float]]) -> list[str]:
        results: list[str] = []
        for aspect in self._collect_aspects(aspect_summary_by_platform):
            bad_count = 0
            for platform_data in aspect_summary_by_platform.values():
                score = platform_data.get(aspect)
                if score is not None and score <= 45:
                    bad_count += 1
            if bad_count >= 2:
                results.append(aspect)
        return sorted(results)

    def find_platform_differences(self, aspect_summary_by_platform: dict[str, dict[str, float]]) -> list[str]:
        messages: list[str] = []
        for aspect in self._collect_aspects(aspect_summary_by_platform):
            scores = {
                platform: data.get(aspect)
                for platform, data in aspect_summary_by_platform.items()
                if data.get(aspect) is not None
            }
            if len(scores) < 2:
                continue
            max_platform = max(scores, key=scores.get)
            min_platform = min(scores, key=scores.get)
            if scores[max_platform] - scores[min_platform] >= 15:
                messages.append(
                    f"{aspect} 평가는 {max_platform}에서 가장 높고 {min_platform}에서 가장 낮게 나타남"
                )
        return messages[:10]

    def _collect_aspects(self, aspect_summary_by_platform: dict[str, dict[str, float]]) -> set[str]:
        all_aspects: set[str] = set()
        for data in aspect_summary_by_platform.values():
            all_aspects.update(data.keys())
        return all_aspects
```

---

## app/services/pipeline.py

```python
from __future__ import annotations

import uuid
from collections import defaultdict
from statistics import mean

from sqlalchemy.orm import Session

from app.crud.repository import Repository
from app.services.aspect_extractor import AspectExtractor
from app.services.collectors import get_collectors
from app.services.comparator import PlatformComparator
from app.services.place_matcher import PlaceMatcher
from app.services.preprocess import ReviewPreprocessor
from app.services.scorer import FinalPlaceScorer, PlatformScorer, ReviewScorer
from app.services.sentiment import IntentDetector, SimpleSentimentAnalyzer


class PlacePreferencePipeline:
    def __init__(self, db: Session):
        self.db = db
        self.repo = Repository(db)
        self.collectors = get_collectors()
        self.place_matcher = PlaceMatcher()
        self.preprocessor = ReviewPreprocessor()
        self.aspect_extractor = AspectExtractor()
        self.sentiment_analyzer = SimpleSentimentAnalyzer()
        self.intent_detector = IntentDetector()
        self.review_scorer = ReviewScorer()
        self.platform_scorer = PlatformScorer()
        self.final_scorer = FinalPlaceScorer()
        self.comparator = PlatformComparator()

    def run(self, place_name: str, category_main: str, category_sub: str | None = None, max_reviews_per_platform: int = 50) -> dict:
        try:
            platform_candidates = {
                collector.platform_name: collector.search_place(place_name)
                for collector in self.collectors
            }

            matched = self.place_matcher.match(
                query=place_name,
                category_main=category_main,
                platform_candidates=platform_candidates,
            )

            place = self.repo.create_place(
                master_place_id=matched["master_place_id"],
                place_name=place_name,
                category_main=category_main,
                category_sub=category_sub,
                address=self._pick_common_address(matched["mappings"]),
            )

            platform_review_scores: dict[str, list[float]] = defaultdict(list)
            platform_review_weights: dict[str, list[float]] = defaultdict(list)
            platform_overall_scores: dict[str, list[float]] = defaultdict(list)
            platform_revisit_scores: dict[str, list[float]] = defaultdict(list)
            platform_recommend_scores: dict[str, list[float]] = defaultdict(list)
            platform_freshness_scores: dict[str, list[float]] = defaultdict(list)
            platform_ratings: dict[str, list[float]] = defaultdict(list)
            aspect_values_by_platform: dict[str, dict[str, list[float]]] = defaultdict(lambda: defaultdict(list))
            aspect_weights_by_platform: dict[str, dict[str, list[float]]] = defaultdict(lambda: defaultdict(list))
            aspect_confidences_by_platform: dict[str, dict[str, list[float]]] = defaultdict(lambda: defaultdict(list))
            review_volume_by_platform: dict[str, int] = defaultdict(int)

            for collector in self.collectors:
                platform = collector.platform_name
                candidate = matched["mappings"].get(platform)
                if not candidate:
                    continue

                self.repo.create_platform_place(
                    place_id=place.id,
                    platform=platform,
                    platform_place_id=candidate["platform_place_id"],
                    platform_place_name=candidate.get("name"),
                    platform_category=category_main,
                    platform_address=candidate.get("address"),
                    platform_rating=candidate.get("rating"),
                    platform_review_count=candidate.get("review_count", 0),
                    source_url=candidate.get("source_url"),
                    matched_confidence=candidate.get("matched_confidence", 0.0),
                )

                reviews = collector.get_reviews(candidate["platform_place_id"], max_reviews=max_reviews_per_platform)
                review_volume_by_platform[platform] = len(reviews)

                for raw_review in reviews:
                    text = raw_review.get("review_text", "").strip()
                    normalized_text = self.preprocessor.normalize_text(text)
                    language = self.preprocessor.detect_language(normalized_text)
                    duplicate_info = self.preprocessor.check_duplicate(normalized_text)
                    reviewer_hash = self.preprocessor.hash_reviewer(raw_review.get("reviewer_name_raw"))

                    review = self.repo.create_review(
                        review_id=f"R-{uuid.uuid4().hex[:12].upper()}",
                        place_id=place.id,
                        platform=platform,
                        platform_place_id=candidate["platform_place_id"],
                        platform_review_id=raw_review.get("platform_review_id"),
                        reviewer_id_hash=reviewer_hash,
                        reviewer_name_raw=raw_review.get("reviewer_name_raw"),
                        rating=raw_review.get("rating"),
                        review_text=text,
                        normalized_text=normalized_text,
                        review_date=raw_review.get("review_date"),
                        like_count=raw_review.get("like_count", 0),
                        has_photo=raw_review.get("has_photo", False),
                        visit_verified=raw_review.get("visit_verified", False),
                        language=language,
                        duplicate_group_id=duplicate_info.duplicate_group_id,
                        duplicate_score=duplicate_info.duplicate_score,
                        source_url=raw_review.get("source_url"),
                    )

                    sentences = self.preprocessor.split_sentences(normalized_text)
                    all_aspect_scores: list[float] = []
                    mentioned_aspect_count = 0

                    for idx, sentence in enumerate(sentences, start=1):
                        sentence_row = self.repo.create_review_sentence(
                            review_id_fk=review.id,
                            sentence_order=idx,
                            sentence_text=sentence,
                            normalized_sentence=sentence,
                            sentence_length=len(sentence),
                        )

                        aspects = self.aspect_extractor.extract(sentence, category_main)
                        if not aspects:
                            continue

                        aspect_results = self.sentiment_analyzer.analyze_aspect(sentence, aspects)
                        for aspect_result in aspect_results:
                            self.repo.create_aspect_analysis(
                                review_id_fk=review.id,
                                sentence_id_fk=sentence_row.id,
                                aspect_name=aspect_result.aspect_name,
                                aspect_group=self.aspect_extractor.classify_group(category_main, aspect_result.aspect_name),
                                aspect_sentiment_label=aspect_result.aspect_sentiment_label,
                                aspect_sentiment_score=aspect_result.aspect_sentiment_score,
                                mention_confidence=aspect_result.mention_confidence,
                                sentiment_confidence=aspect_result.sentiment_confidence,
                                evidence_text=aspect_result.evidence_text,
                            )
                            aspect_score_100 = (aspect_result.aspect_sentiment_score + 1) * 50
                            aspect_values_by_platform[platform][aspect_result.aspect_name].append(aspect_score_100)
                            aspect_weights_by_platform[platform][aspect_result.aspect_name].append(1.0)
                            aspect_confidences_by_platform[platform][aspect_result.aspect_name].append(
                                aspect_result.mention_confidence
                            )
                            all_aspect_scores.append(aspect_result.aspect_sentiment_score)
                            mentioned_aspect_count += 1

                    overall_label, overall_score = self.sentiment_analyzer.analyze_overall(normalized_text)
                    revisit_label, revisit_score = self.intent_detector.detect_revisit(normalized_text)
                    recommend_label, recommend_score = self.intent_detector.detect_recommend(normalized_text)
                    freshness_score = self.preprocessor.calc_freshness_score(raw_review.get("review_date"))
                    informativeness_score = self.review_scorer.calc_informativeness(
                        token_count=len(normalized_text.split()),
                        mentioned_aspect_count=mentioned_aspect_count,
                    )
                    credibility_score = self.review_scorer.calc_credibility(
                        has_photo=raw_review.get("has_photo", False),
                        visit_verified=raw_review.get("visit_verified", False),
                        like_count=raw_review.get("like_count", 0),
                        duplicate_risk=duplicate_info.duplicate_score,
                    )
                    review_weight = self.review_scorer.calc_review_weight(
                        freshness=freshness_score,
                        informativeness=informativeness_score,
                        credibility=credibility_score,
                    )
                    aspect_avg = mean(all_aspect_scores) if all_aspect_scores else 0.0
                    review_score = self.review_scorer.score_review(
                        overall_sentiment=overall_score,
                        aspect_avg=aspect_avg,
                        revisit_score=revisit_score,
                        recommend_score=recommend_score,
                    )

                    self.repo.create_review_analysis(
                        review_id_fk=review.id,
                        sentiment_label=overall_label,
                        sentiment_score=overall_score,
                        emotion_intensity=self.sentiment_analyzer.emotion_intensity(normalized_text),
                        revisit_intent_label=revisit_label,
                        revisit_intent_score=revisit_score,
                        recommend_intent_label=recommend_label,
                        recommend_intent_score=recommend_score,
                        informativeness_score=informativeness_score,
                        credibility_score=credibility_score,
                        freshness_score=freshness_score,
                        final_review_weight=review_weight,
                        confidence_score=0.75,
                    )

                    platform_review_scores[platform].append(review_score)
                    platform_review_weights[platform].append(review_weight)
                    platform_overall_scores[platform].append((overall_score + 1) * 50)
                    platform_revisit_scores[platform].append(revisit_score * 100)
                    platform_recommend_scores[platform].append(recommend_score * 100)
                    platform_freshness_scores[platform].append(freshness_score * 100)
                    if raw_review.get("rating") is not None:
                        platform_ratings[platform].append(float(raw_review["rating"]))

            platform_scores: dict[str, float] = {}
            aspect_summary_by_platform: dict[str, dict[str, float]] = {}

            for platform, scores in platform_review_scores.items():
                weighted_platform_score = self.platform_scorer.weighted_average(scores, platform_review_weights[platform])
                platform_scores[platform] = weighted_platform_score

                aspect_summary: dict[str, float] = {}
                for aspect_name, values in aspect_values_by_platform[platform].items():
                    aspect_summary[aspect_name] = self.platform_scorer.aspect_weighted_average(
                        values=values,
                        weights=aspect_weights_by_platform[platform][aspect_name],
                        confidences=aspect_confidences_by_platform[platform][aspect_name],
                    )
                aspect_summary_by_platform[platform] = aspect_summary

                self.repo.create_platform_summary(
                    place_id=place.id,
                    platform=platform,
                    review_count=review_volume_by_platform.get(platform, 0),
                    valid_review_count=len(scores),
                    avg_rating=round(mean(platform_ratings[platform]), 2) if platform_ratings[platform] else None,
                    overall_sentiment_score=round(mean(platform_overall_scores[platform]), 2) if platform_overall_scores[platform] else 0.0,
                    aspect_score=round(mean(aspect_summary.values()), 2) if aspect_summary else 0.0,
                    revisit_score=round(mean(platform_revisit_scores[platform]), 2) if platform_revisit_scores[platform] else 0.0,
                    recommend_score=round(mean(platform_recommend_scores[platform]), 2) if platform_recommend_scores[platform] else 0.0,
                    freshness_score=round(mean(platform_freshness_scores[platform]), 2) if platform_freshness_scores[platform] else 0.0,
                    platform_preference_score=weighted_platform_score,
                    summary_json={
                        "aspect_summary": aspect_summary,
                        "review_volume": review_volume_by_platform.get(platform, 0),
                    },
                )

            common_strengths = self.comparator.find_common_strengths(aspect_summary_by_platform)
            common_weaknesses = self.comparator.find_common_weaknesses(aspect_summary_by_platform)
            platform_differences = self.comparator.find_platform_differences(aspect_summary_by_platform)
            final_score, consistency_score, penalty = self.final_scorer.summarize(category_main, platform_scores)

            final_json = {
                "master_place_id": place.master_place_id,
                "place_name": place.place_name,
                "category_main": place.category_main,
                "final_preference_score": final_score,
                "consistency_score": consistency_score,
                "inconsistency_penalty": penalty,
                "platform_scores": platform_scores,
                "common_strengths": common_strengths,
                "common_weaknesses": common_weaknesses,
                "platform_differences": platform_differences,
                "aspect_summary_by_platform": aspect_summary_by_platform,
                "review_volume_by_platform": dict(review_volume_by_platform),
            }

            self.repo.create_final_report(
                place_id=place.id,
                final_preference_score=final_score,
                consistency_score=consistency_score,
                inconsistency_penalty=penalty,
                strongest_aspects_json=common_strengths,
                weakest_aspects_json=common_weaknesses,
                common_strengths_json=common_strengths,
                common_weaknesses_json=common_weaknesses,
                platform_differences_json=platform_differences,
                final_report_json=final_json,
            )

            self.db.commit()
            return final_json

        except Exception:
            self.db.rollback()
            raise

    @staticmethod
    def _pick_common_address(mappings: dict[str, dict]) -> str | None:
        for candidate in mappings.values():
            address = candidate.get("address")
            if address:
                return address
        return None
```

---

## app/api/**init**.py

```python
# empty
```

---

## app/api/routes.py

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.crud.repository import Repository
from app.schemas.place import PlaceCreateRequest, PlaceSummaryResponse
from app.schemas.report import FinalReportResponse
from app.services.pipeline import PlacePreferencePipeline


router = APIRouter(prefix="/api/reviews", tags=["reviews"])


@router.post("/pipeline/run", response_model=FinalReportResponse)
def run_pipeline(payload: PlaceCreateRequest, db: Session = Depends(get_db)):
    pipeline = PlacePreferencePipeline(db)
    result = pipeline.run(
        place_name=payload.place_name,
        category_main=payload.category_main,
        category_sub=payload.category_sub,
        max_reviews_per_platform=payload.max_reviews_per_platform,
    )
    return result


@router.get("/reports/{master_place_id}", response_model=FinalReportResponse)
def get_final_report(master_place_id: str, db: Session = Depends(get_db)):
    repo = Repository(db)
    report = repo.get_final_report_by_master_place_id(master_place_id)
    if not report:
        raise HTTPException(status_code=404, detail="Final report not found")
    return report.final_report_json


@router.get("/places", response_model=list[PlaceSummaryResponse])
def list_places(db: Session = Depends(get_db)):
    repo = Repository(db)
    places = repo.get_all_places()
    return [
        PlaceSummaryResponse(
            master_place_id=place.master_place_id,
            place_name=place.place_name,
            category_main=place.category_main,
            review_count=len(place.reviews),
            platform_count=len(place.platform_places),
        )
        for place in places
    ]


@router.get("/places/{master_place_id}")
def get_place_detail(master_place_id: str, db: Session = Depends(get_db)):
    repo = Repository(db)
    place = repo.get_place_by_master_place_id(master_place_id)
    if not place:
        raise HTTPException(status_code=404, detail="Place not found")

    return {
        "master_place_id": place.master_place_id,
        "place_name": place.place_name,
        "category_main": place.category_main,
        "category_sub": place.category_sub,
        "address": place.address,
        "platform_places": [
            {
                "platform": pp.platform,
                "platform_place_id": pp.platform_place_id,
                "platform_place_name": pp.platform_place_name,
                "platform_address": pp.platform_address,
                "platform_rating": pp.platform_rating,
                "platform_review_count": pp.platform_review_count,
                "matched_confidence": pp.matched_confidence,
            }
            for pp in place.platform_places
        ],
        "platform_summaries": [
            {
                "platform": ps.platform,
                "review_count": ps.review_count,
                "valid_review_count": ps.valid_review_count,
                "avg_rating": ps.avg_rating,
                "platform_preference_score": ps.platform_preference_score,
                "summary_json": ps.summary_json,
            }
            for ps in place.platform_summaries
        ],
        "has_final_report": place.final_report is not None,
    }


@router.get("/places/{master_place_id}/reviews")
def get_place_reviews(master_place_id: str, db: Session = Depends(get_db)):
    repo = Repository(db)
    reviews = repo.get_reviews_by_master_place_id(master_place_id)
    if not reviews:
        raise HTTPException(status_code=404, detail="Reviews not found")

    return [
        {
            "review_id": review.review_id,
            "platform": review.platform,
            "rating": review.rating,
            "review_text": review.review_text,
            "normalized_text": review.normalized_text,
            "language": review.language,
            "like_count": review.like_count,
            "has_photo": review.has_photo,
            "visit_verified": review.visit_verified,
        }
        for review in reviews
    ]
```

---

## app/main.py

```python
from fastapi import FastAPI

import app.models  # noqa: F401
from app.api.routes import router
from app.core.config import settings
from app.core.database import Base, engine


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    debug=settings.debug,
)
app.include_router(router)


@app.get("/")
def health_check():
    return {
        "message": "Place Preference API is running",
        "version": settings.app_version,
    }
```

---

## run.py

```python
import uvicorn


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
```

---

## 실행 방법

```bash
pip install -r requirements.txt
python run.py
```

또는

```bash
uvicorn app.main:app --reload
```

---

## 테스트 예시

### 1) 파이프라인 실행

```bash
curl -X POST "http://127.0.0.1:8000/api/reviews/pipeline/run" \
  -H "Content-Type: application/json" \
  -d '{
    "place_name": "스타벅스 강남R점",
    "category_main": "cafe",
    "max_reviews_per_platform": 20
  }'
```

### 2) 장소 목록 조회

```bash
curl "http://127.0.0.1:8000/api/reviews/places"
```

### 3) 최종 리포트 조회

```bash
curl "http://127.0.0.1:8000/api/reviews/reports/P-XXXXXXXX"
```

### 4) 장소 상세 조회

```bash
curl "http://127.0.0.1:8000/api/reviews/places/P-XXXXXXXX"
```

### 5) 리뷰 목록 조회

```bash
curl "http://127.0.0.1:8000/api/reviews/places/P-XXXXXXXX/reviews"
```

---

## 이 개선판에서 달라진 점

1. 기존 MVP보다 `transaction rollback`이 명확하다.
2. `master_place_id`를 중심으로 조회 API를 확장했다.
3. 설계 문서의 `review_analysis`, `aspect_analysis`, `platform_summary`, `final_place_report` 흐름을 반영했다.
4. 리뷰 가중치 계산을 `freshness / informativeness / credibility`로 분리했다.
5. 플랫폼별 속성 점수와 최종 통합 점수까지 한 번에 생성한다.

---

## 다음 단계 추천

다음으로 붙이기 가장 좋은 건 아래 3개다.

* Alembic migration 추가
* Dummy collector를 실제 API/크롤러 collector로 교체
* 중복 저장 방지용 upsert / 재분석 방지 로직 추가

```
```
