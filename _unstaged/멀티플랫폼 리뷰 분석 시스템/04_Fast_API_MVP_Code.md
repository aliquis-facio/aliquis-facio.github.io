좋아.
아래는 네 프로젝트를 위한 **Python FastAPI MVP 코드 골격**이다.

구성 목표는 Django 버전과 동일하게:

* 장소 1개 입력
* 플랫폼별 장소 매핑
* 리뷰 수집
* 전처리
* 규칙 기반 속성 추출
* 감성 분석
* 플랫폼별 점수 계산
* 최종 리포트 JSON 반환

까지 돌아가는 최소 구조다.

---

# 1. 프로젝트 구조

```text
place_preference_fastapi/
├─ app/
│  ├─ __init__.py
│  ├─ main.py
│  ├─ core/
│  │  ├─ config.py
│  │  └─ database.py
│  ├─ models/
│  │  ├─ __init__.py
│  │  ├─ place.py
│  │  ├─ review.py
│  │  └─ report.py
│  ├─ schemas/
│  │  ├─ __init__.py
│  │  ├─ place.py
│  │  └─ report.py
│  ├─ api/
│  │  ├─ __init__.py
│  │  └─ routes.py
│  ├─ services/
│  │  ├─ __init__.py
│  │  ├─ collectors.py
│  │  ├─ place_matcher.py
│  │  ├─ preprocess.py
│  │  ├─ aspect_extractor.py
│  │  ├─ sentiment.py
│  │  ├─ scorer.py
│  │  ├─ comparator.py
│  │  └─ pipeline.py
│  └─ crud/
│     ├─ __init__.py
│     └─ repository.py
├─ requirements.txt
└─ run.py
```

---

# 2. requirements.txt

MVP 기준 최소 패키지:

```txt
fastapi>=0.115
uvicorn[standard]>=0.30
sqlalchemy>=2.0
pydantic>=2.7
python-dotenv>=1.0
```

SQLite 기준으로는 추가 드라이버가 필요 없다.

---

# 3. 설정 파일

## `app/core/config.py`

```python
from pydantic import BaseModel


class Settings(BaseModel):
    app_name: str = "Place Preference API"
    database_url: str = "sqlite:///./place_preference.db"


settings = Settings()
```

---

# 4. DB 연결

## `app/core/database.py`

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.core.config import settings

engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False} if settings.database_url.startswith("sqlite") else {},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

---

# 5. SQLAlchemy 모델

---

## `app/models/place.py`

```python
from sqlalchemy import Column, Float, ForeignKey, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class Place(Base):
    __tablename__ = "places"

    id = Column(Integer, primary_key=True, index=True)
    master_place_id = Column(String(40), unique=True, nullable=False, index=True)
    place_name = Column(String(255), nullable=False)
    category_main = Column(String(50), nullable=False)
    category_sub = Column(String(100), nullable=True)
    address = Column(Text, nullable=True)
    road_address = Column(Text, nullable=True)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    phone = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    platform_places = relationship("PlatformPlace", back_populates="place", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="place", cascade="all, delete-orphan")
    platform_summaries = relationship("PlatformSummary", back_populates="place", cascade="all, delete-orphan")
    final_report = relationship("FinalPlaceReport", back_populates="place", uselist=False, cascade="all, delete-orphan")


class PlatformPlace(Base):
    __tablename__ = "platform_places"

    id = Column(Integer, primary_key=True, index=True)
    place_id = Column(Integer, ForeignKey("places.id"), nullable=False)
    platform = Column(String(20), nullable=False, index=True)
    platform_place_id = Column(String(255), nullable=False, index=True)
    platform_place_name = Column(String(255), nullable=True)
    platform_category = Column(String(100), nullable=True)
    platform_address = Column(Text, nullable=True)
    platform_rating = Column(Float, nullable=True)
    platform_review_count = Column(Integer, default=0)
    source_url = Column(Text, nullable=True)
    matched_confidence = Column(Float, default=0.0)

    place = relationship("Place", back_populates="platform_places")
```

---

## `app/models/review.py`

```python
from sqlalchemy import Boolean, Column, Date, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    review_id = Column(String(60), unique=True, nullable=False, index=True)
    place_id = Column(Integer, ForeignKey("places.id"), nullable=False)
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
    review_id_fk = Column(Integer, ForeignKey("reviews.id"), nullable=False)
    sentence_order = Column(Integer, nullable=False)
    sentence_text = Column(Text, nullable=False)
    normalized_sentence = Column(Text, nullable=True)
    sentence_length = Column(Integer, default=0)

    review = relationship("Review", back_populates="sentences")
    aspect_analyses = relationship("AspectAnalysis", back_populates="sentence")


class ReviewAnalysis(Base):
    __tablename__ = "review_analyses"

    id = Column(Integer, primary_key=True, index=True)
    review_id_fk = Column(Integer, ForeignKey("reviews.id"), unique=True, nullable=False)
    sentiment_label = Column(String(20), nullable=True)
    sentiment_score = Column(Float, default=0.0)
    revisit_intent_label = Column(String(20), nullable=True)
    revisit_intent_score = Column(Float, default=0.0)
    recommend_intent_label = Column(String(20), nullable=True)
    recommend_intent_score = Column(Float, default=0.0)
    informativeness_score = Column(Float, default=0.0)
    credibility_score = Column(Float, default=0.0)
    freshness_score = Column(Float, default=0.0)
    final_review_weight = Column(Float, default=1.0)
    confidence_score = Column(Float, default=0.0)

    review = relationship("Review", back_populates="analysis")


class AspectAnalysis(Base):
    __tablename__ = "aspect_analyses"

    id = Column(Integer, primary_key=True, index=True)
    review_id_fk = Column(Integer, ForeignKey("reviews.id"), nullable=False)
    sentence_id_fk = Column(Integer, ForeignKey("review_sentences.id"), nullable=True)
    aspect_name = Column(String(100), nullable=False)
    aspect_group = Column(String(50), nullable=True)
    aspect_sentiment_label = Column(String(20), nullable=True)
    aspect_sentiment_score = Column(Float, default=0.0)
    mention_confidence = Column(Float, default=0.0)
    sentiment_confidence = Column(Float, default=0.0)
    evidence_text = Column(Text, nullable=True)

    review = relationship("Review", back_populates="aspect_analyses")
    sentence = relationship("ReviewSentence", back_populates="aspect_analyses")
```

---

## `app/models/report.py`

```python
from sqlalchemy import Column, Float, ForeignKey, Integer, JSON, String
from sqlalchemy.orm import relationship

from app.core.database import Base


class PlatformSummary(Base):
    __tablename__ = "platform_summaries"

    id = Column(Integer, primary_key=True, index=True)
    place_id = Column(Integer, ForeignKey("places.id"), nullable=False)
    platform = Column(String(20), nullable=False)
    review_count = Column(Integer, default=0)
    valid_review_count = Column(Integer, default=0)
    avg_rating = Column(Float, nullable=True)
    overall_sentiment_score = Column(Float, default=0.0)
    aspect_score = Column(Float, default=0.0)
    revisit_score = Column(Float, default=0.0)
    recommend_score = Column(Float, default=0.0)
    freshness_score = Column(Float, default=0.0)
    platform_preference_score = Column(Float, default=0.0)
    summary_json = Column(JSON, default={})

    place = relationship("Place", back_populates="platform_summaries")


class FinalPlaceReport(Base):
    __tablename__ = "final_place_reports"

    id = Column(Integer, primary_key=True, index=True)
    place_id = Column(Integer, ForeignKey("places.id"), unique=True, nullable=False)
    final_preference_score = Column(Float, default=0.0)
    consistency_score = Column(Float, default=0.0)
    inconsistency_penalty = Column(Float, default=0.0)
    strongest_aspects_json = Column(JSON, default=[])
    weakest_aspects_json = Column(JSON, default=[])
    common_strengths_json = Column(JSON, default=[])
    common_weaknesses_json = Column(JSON, default=[])
    platform_differences_json = Column(JSON, default=[])
    final_report_json = Column(JSON, default={})

    place = relationship("Place", back_populates="final_report")
```

---

## `app/models/__init__.py`

```python
from app.models.place import Place, PlatformPlace
from app.models.review import Review, ReviewSentence, ReviewAnalysis, AspectAnalysis
from app.models.report import PlatformSummary, FinalPlaceReport

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

# 6. Pydantic 스키마

---

## `app/schemas/place.py`

```python
from pydantic import BaseModel


class PlaceCreateRequest(BaseModel):
    place_name: str
    category_main: str
```

---

## `app/schemas/report.py`

```python
from typing import Any

from pydantic import BaseModel


class FinalReportResponse(BaseModel):
    place_name: str
    category_main: str
    final_preference_score: float
    platform_scores: dict[str, float]
    common_strengths: list[str]
    common_weaknesses: list[str]
    platform_differences: list[str]
    aspect_summary_by_platform: dict[str, dict[str, float]]
```

---

# 7. CRUD 레이어

## `app/crud/repository.py`

```python
from sqlalchemy.orm import Session

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

    def get_final_report_by_master_place_id(self, master_place_id: str) -> FinalPlaceReport | None:
        return (
            self.db.query(FinalPlaceReport)
            .join(Place, FinalPlaceReport.place_id == Place.id)
            .filter(Place.master_place_id == master_place_id)
            .first()
        )
```

---

# 8. 서비스 레이어

---

## `app/services/collectors.py`

MVP라서 실제 API/크롤러 대신 더미 collector를 둔다.

```python
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
            "rating": 4.3,
            "review_count": 3,
        }]

    def get_place_detail(self, place_id: str) -> dict[str, Any]:
        return {"platform_place_id": place_id, "source_url": "https://example.com/google"}

    def get_reviews(self, place_id: str, max_reviews: int = 100) -> list[dict[str, Any]]:
        return [
            {
                "platform_review_id": "g_r_1",
                "reviewer_name_raw": "user1",
                "rating": 5,
                "review_text": "분위기가 좋고 커피도 맛있어요. 다음에 또 올게요.",
                "like_count": 2,
                "has_photo": True,
            },
            {
                "platform_review_id": "g_r_2",
                "reviewer_name_raw": "user2",
                "rating": 3,
                "review_text": "분위기는 괜찮은데 가격이 비싸요.",
                "like_count": 0,
                "has_photo": False,
            },
        ]


class DummyKakaoCollector(DummyGoogleCollector):
    platform_name = "kakao"


class DummyNaverCollector(DummyGoogleCollector):
    platform_name = "naver"


def get_collectors() -> list[BaseReviewCollector]:
    return [DummyGoogleCollector(), DummyKakaoCollector(), DummyNaverCollector()]
```

---

## `app/services/place_matcher.py`

```python
import uuid


class PlaceMatcher:
    def match(self, query: str, category_main: str, platform_candidates: dict) -> dict:
        master_place_id = f"P-{uuid.uuid4().hex[:8].upper()}"
        mappings = {}

        for platform, candidates in platform_candidates.items():
            if candidates:
                mappings[platform] = candidates[0]

        return {
            "master_place_id": master_place_id,
            "place_name": query,
            "category_main": category_main,
            "mappings": mappings,
        }
```

---

## `app/services/preprocess.py`

```python
import re


class ReviewPreprocessor:
    def clean_text(self, text: str) -> str:
        text = text.strip()
        text = re.sub(r"[^\w\s가-힣.,!?]", " ", text)
        text = re.sub(r"\s+", " ", text)
        return text.strip()

    def normalize_text(self, text: str) -> str:
        text = self.clean_text(text)
        text = re.sub(r"([!?.])\1+", r"\1", text)
        return text

    def detect_language(self, text: str) -> str:
        if re.search(r"[가-힣]", text):
            return "ko"
        return "unknown"

    def split_sentences(self, text: str) -> list[str]:
        chunks = re.split(r"(?<=[.!?])\s+", text)
        return [c.strip() for c in chunks if c.strip()]
```

---

## `app/services/aspect_extractor.py`

```python
ASPECT_DICTIONARY = {
    "restaurant": {
        "맛": ["맛", "음식", "풍미", "간"],
        "양": ["양", "푸짐", "적다", "많다"],
        "가격": ["가격", "비싸", "저렴", "가성비"],
        "서비스": ["친절", "응대", "서빙", "직원"],
        "청결": ["청결", "깨끗", "위생"],
        "대기시간": ["웨이팅", "줄", "기다림", "대기"],
        "분위기": ["분위기", "인테리어", "감성"],
        "주차": ["주차", "주차장"],
    },
    "cafe": {
        "음료맛": ["커피", "음료", "라떼", "맛"],
        "디저트": ["디저트", "케이크", "빵"],
        "분위기": ["분위기", "감성", "무드", "인테리어"],
        "좌석": ["좌석", "의자", "테이블"],
        "작업적합성": ["노트북", "공부", "작업", "콘센트", "와이파이"],
        "소음": ["조용", "시끄럽", "소음"],
        "가격": ["가격", "비싸", "저렴", "가성비"],
        "청결": ["청결", "깨끗"],
        "주차": ["주차", "주차장"],
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
    def extract(self, sentence: str, category_main: str) -> list[str]:
        category_dict = ASPECT_DICTIONARY.get(category_main, {})
        found = []

        for aspect_name, keywords in category_dict.items():
            if any(keyword in sentence for keyword in keywords):
                found.append(aspect_name)

        return found
```

---

## `app/services/sentiment.py`

```python
POSITIVE_WORDS = ["좋", "맛있", "훌륭", "깨끗", "친절", "추천", "조용", "편하", "예쁘", "최고"]
NEGATIVE_WORDS = ["별로", "나쁘", "비싸", "불편", "시끄럽", "불친절", "더럽", "아쉽", "기다", "혼잡"]


class SimpleSentimentAnalyzer:
    def analyze_overall(self, text: str) -> tuple[str, float]:
        pos = sum(1 for word in POSITIVE_WORDS if word in text)
        neg = sum(1 for word in NEGATIVE_WORDS if word in text)

        score = 0.0
        if pos + neg > 0:
            score = (pos - neg) / (pos + neg)

        label = "neutral"
        if score > 0.2:
            label = "positive"
        elif score < -0.2:
            label = "negative"

        return label, score

    def analyze_aspect(self, sentence: str, aspect_name: str) -> tuple[str, float]:
        return self.analyze_overall(sentence)


class IntentDetector:
    REVISIT_POS = ["또 올", "재방문", "다시 올", "단골"]
    REVISIT_NEG = ["다시는", "안 올", "한 번이면"]
    RECOMMEND_POS = ["추천", "꼭 가", "가볼만"]
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

## `app/services/scorer.py`

```python
from statistics import mean, pstdev


class ReviewScorer:
    def score_review(self, overall_sentiment: float, aspect_avg: float, revisit_score: float, recommend_score: float) -> float:
        raw = (
            0.25 * overall_sentiment
            + 0.40 * aspect_avg
            + 0.20 * (2 * revisit_score - 1)
            + 0.15 * (2 * recommend_score - 1)
        )
        score_100 = (raw + 1) * 50
        return round(max(0.0, min(100.0, score_100)), 2)

    def calc_review_weight(self, text_length: int, aspect_count: int, has_photo: bool, like_count: int) -> float:
        informativeness = min(1.0, 0.4 + 0.01 * text_length + 0.08 * aspect_count)
        credibility = 1.0 + (0.1 if has_photo else 0.0) + min(0.2, like_count * 0.02)
        weight = informativeness * credibility
        return round(max(0.3, min(1.5, weight)), 3)


class PlatformScorer:
    def summarize(self, review_scores: list[float], review_weights: list[float]) -> float:
        if not review_scores or not review_weights:
            return 0.0

        weighted_sum = sum(s * w for s, w in zip(review_scores, review_weights))
        weight_sum = sum(review_weights)
        if weight_sum == 0:
            return 0.0
        return round(weighted_sum / weight_sum, 2)


class FinalPlaceScorer:
    def summarize(self, platform_scores: dict[str, float]) -> tuple[float, float, float]:
        values = list(platform_scores.values())
        if not values:
            return 0.0, 0.0, 0.0

        avg_score = mean(values)
        std = pstdev(values) if len(values) > 1 else 0.0
        penalty = min(15.0, std * 0.8)
        final_score = max(0.0, avg_score - penalty)
        consistency_score = max(0.0, 100.0 - std * 10)

        return round(final_score, 2), round(consistency_score, 2), round(penalty, 2)
```

---

## `app/services/comparator.py`

```python
class PlatformComparator:
    def find_common_strengths(self, aspect_summary_by_platform: dict) -> list[str]:
        result = []
        all_aspects = self._collect_aspects(aspect_summary_by_platform)

        for aspect in all_aspects:
            good_count = 0
            for platform_data in aspect_summary_by_platform.values():
                score = platform_data.get(aspect)
                if score is not None and score >= 75:
                    good_count += 1
            if good_count >= 2:
                result.append(aspect)

        return result

    def find_common_weaknesses(self, aspect_summary_by_platform: dict) -> list[str]:
        result = []
        all_aspects = self._collect_aspects(aspect_summary_by_platform)

        for aspect in all_aspects:
            bad_count = 0
            for platform_data in aspect_summary_by_platform.values():
                score = platform_data.get(aspect)
                if score is not None and score <= 45:
                    bad_count += 1
            if bad_count >= 2:
                result.append(aspect)

        return result

    def find_platform_differences(self, aspect_summary_by_platform: dict) -> list[str]:
        messages = []
        all_aspects = self._collect_aspects(aspect_summary_by_platform)

        for aspect in all_aspects:
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
                messages.append(f"{aspect} 평가는 {max_platform}에서 가장 높고 {min_platform}에서 가장 낮게 나타남")

        return messages[:10]

    def _collect_aspects(self, aspect_summary_by_platform: dict) -> set[str]:
        all_aspects = set()
        for data in aspect_summary_by_platform.values():
            all_aspects.update(data.keys())
        return all_aspects
```

---

## `app/services/pipeline.py`

이 파일이 핵심이다.

```python
from collections import defaultdict
from statistics import mean

from sqlalchemy.orm import Session

from app.crud.repository import Repository
from app.services.collectors import get_collectors
from app.services.place_matcher import PlaceMatcher
from app.services.preprocess import ReviewPreprocessor
from app.services.aspect_extractor import AspectExtractor
from app.services.sentiment import SimpleSentimentAnalyzer, IntentDetector
from app.services.scorer import ReviewScorer, PlatformScorer, FinalPlaceScorer
from app.services.comparator import PlatformComparator


class PlacePreferencePipeline:
    def __init__(self, db: Session):
        self.db = db
        self.repo = Repository(db)
        self.collectors = get_collectors()
        self.matcher = PlaceMatcher()
        self.preprocessor = ReviewPreprocessor()
        self.aspect_extractor = AspectExtractor()
        self.sentiment_analyzer = SimpleSentimentAnalyzer()
        self.intent_detector = IntentDetector()
        self.review_scorer = ReviewScorer()
        self.platform_scorer = PlatformScorer()
        self.final_scorer = FinalPlaceScorer()
        self.comparator = PlatformComparator()

    def run(self, place_name: str, category_main: str) -> dict:
        platform_candidates = {}
        for collector in self.collectors:
            platform_candidates[collector.platform_name] = collector.search_place(place_name)

        matched = self.matcher.match(place_name, category_main, platform_candidates)

        place = self.repo.create_place(
            master_place_id=matched["master_place_id"],
            place_name=matched["place_name"],
            category_main=matched["category_main"],
        )

        for platform, info in matched["mappings"].items():
            self.repo.create_platform_place(
                place_id=place.id,
                platform=platform,
                platform_place_id=info["platform_place_id"],
                platform_place_name=info.get("name"),
                platform_address=info.get("address"),
                platform_rating=info.get("rating"),
                platform_review_count=info.get("review_count", 0),
                matched_confidence=1.0,
            )

        platform_review_scores = defaultdict(list)
        platform_review_weights = defaultdict(list)
        aspect_summary_by_platform = defaultdict(dict)

        for collector in self.collectors:
            platform = collector.platform_name
            platform_mapping = matched["mappings"].get(platform)
            if not platform_mapping:
                continue

            raw_reviews = collector.get_reviews(platform_mapping["platform_place_id"], max_reviews=100)
            platform_aspect_scores = defaultdict(list)

            for idx, raw in enumerate(raw_reviews, start=1):
                review = self._save_review(
                    place_id=place.id,
                    platform=platform,
                    platform_place_id=platform_mapping["platform_place_id"],
                    raw=raw,
                    idx=idx,
                )
                self._analyze_review(
                    review_id=review.id,
                    platform=platform,
                    text=review.normalized_text or review.review_text,
                    has_photo=review.has_photo,
                    like_count=review.like_count,
                    category_main=category_main,
                    platform_aspect_scores=platform_aspect_scores,
                    platform_review_scores=platform_review_scores,
                    platform_review_weights=platform_review_weights,
                )

            ratings = [r.get("rating") for r in raw_reviews if r.get("rating") is not None]
            avg_rating = round(sum(ratings) / len(ratings), 2) if ratings else 0.0
            platform_score = self.platform_scorer.summarize(
                platform_review_scores[platform],
                platform_review_weights[platform],
            )

            for aspect_name, scores in platform_aspect_scores.items():
                aspect_summary_by_platform[platform][aspect_name] = round(mean(scores), 2)

            self.repo.create_platform_summary(
                place_id=place.id,
                platform=platform,
                review_count=len(raw_reviews),
                valid_review_count=len(platform_review_scores[platform]),
                avg_rating=avg_rating,
                overall_sentiment_score=platform_score,
                aspect_score=platform_score,
                revisit_score=platform_score,
                recommend_score=platform_score,
                freshness_score=70.0,
                platform_preference_score=platform_score,
                summary_json={"aspect_scores": aspect_summary_by_platform[platform]},
            )

        platform_scores = {
            platform: self.platform_scorer.summarize(scores, platform_review_weights[platform])
            for platform, scores in platform_review_scores.items()
        }

        final_score, consistency_score, penalty = self.final_scorer.summarize(platform_scores)

        common_strengths = self.comparator.find_common_strengths(aspect_summary_by_platform)
        common_weaknesses = self.comparator.find_common_weaknesses(aspect_summary_by_platform)
        platform_differences = self.comparator.find_platform_differences(aspect_summary_by_platform)

        final_json = {
            "place_name": place.place_name,
            "category_main": place.category_main,
            "final_preference_score": final_score,
            "platform_scores": platform_scores,
            "common_strengths": common_strengths,
            "common_weaknesses": common_weaknesses,
            "platform_differences": platform_differences,
            "aspect_summary_by_platform": dict(aspect_summary_by_platform),
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

    def _save_review(self, place_id: int, platform: str, platform_place_id: str, raw: dict, idx: int):
        text = raw.get("review_text", "")
        normalized = self.preprocessor.normalize_text(text)
        language = self.preprocessor.detect_language(text)

        return self.repo.create_review(
            review_id=f"{platform}_{platform_place_id}_{idx}",
            place_id=place_id,
            platform=platform,
            platform_place_id=platform_place_id,
            platform_review_id=raw.get("platform_review_id"),
            reviewer_name_raw=raw.get("reviewer_name_raw"),
            rating=raw.get("rating"),
            review_text=text,
            normalized_text=normalized,
            like_count=raw.get("like_count", 0),
            has_photo=raw.get("has_photo", False),
            visit_verified=raw.get("visit_verified", False),
            language=language,
        )

    def _analyze_review(
        self,
        review_id: int,
        platform: str,
        text: str,
        has_photo: bool,
        like_count: int,
        category_main: str,
        platform_aspect_scores: dict,
        platform_review_scores: dict,
        platform_review_weights: dict,
    ) -> None:
        sentences = self.preprocessor.split_sentences(text)
        aspect_scores_for_review = []

        for i, sentence_text in enumerate(sentences, start=1):
            sentence = self.repo.create_review_sentence(
                review_id_fk=review_id,
                sentence_order=i,
                sentence_text=sentence_text,
                normalized_sentence=sentence_text,
                sentence_length=len(sentence_text),
            )

            aspects = self.aspect_extractor.extract(sentence_text, category_main)
            for aspect_name in aspects:
                aspect_label, aspect_score = self.sentiment_analyzer.analyze_aspect(sentence_text, aspect_name)

                self.repo.create_aspect_analysis(
                    review_id_fk=review_id,
                    sentence_id_fk=sentence.id,
                    aspect_name=aspect_name,
                    aspect_group="core",
                    aspect_sentiment_label=aspect_label,
                    aspect_sentiment_score=aspect_score,
                    mention_confidence=0.8,
                    sentiment_confidence=0.7,
                    evidence_text=sentence_text,
                )

                aspect_scores_for_review.append(aspect_score)
                platform_aspect_scores[aspect_name].append((aspect_score + 1) * 50)

        overall_label, overall_score = self.sentiment_analyzer.analyze_overall(text)
        revisit_label, revisit_score = self.intent_detector.detect_revisit(text)
        recommend_label, recommend_score = self.intent_detector.detect_recommend(text)

        aspect_avg = mean(aspect_scores_for_review) if aspect_scores_for_review else overall_score
        review_score = self.review_scorer.score_review(
            overall_sentiment=overall_score,
            aspect_avg=aspect_avg,
            revisit_score=revisit_score,
            recommend_score=recommend_score,
        )
        review_weight = self.review_scorer.calc_review_weight(
            text_length=len(text),
            aspect_count=len(aspect_scores_for_review),
            has_photo=has_photo,
            like_count=like_count,
        )

        self.repo.create_review_analysis(
            review_id_fk=review_id,
            sentiment_label=overall_label,
            sentiment_score=overall_score,
            revisit_intent_label=revisit_label,
            revisit_intent_score=revisit_score,
            recommend_intent_label=recommend_label,
            recommend_intent_score=recommend_score,
            informativeness_score=min(1.0, len(text) / 100),
            credibility_score=1.0 if has_photo else 0.7,
            freshness_score=0.8,
            final_review_weight=review_weight,
            confidence_score=0.75,
        )

        platform_review_scores[platform].append(review_score)
        platform_review_weights[platform].append(review_weight)
```

---

# 9. FastAPI 라우터

## `app/api/routes.py`

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.crud.repository import Repository
from app.schemas.place import PlaceCreateRequest
from app.services.pipeline import PlacePreferencePipeline

router = APIRouter(prefix="/api/reviews", tags=["reviews"])


@router.post("/pipeline/run")
def run_pipeline(payload: PlaceCreateRequest, db: Session = Depends(get_db)):
    pipeline = PlacePreferencePipeline(db)
    result = pipeline.run(place_name=payload.place_name, category_main=payload.category_main)
    return result


@router.get("/reports/{master_place_id}")
def get_final_report(master_place_id: str, db: Session = Depends(get_db)):
    repo = Repository(db)
    report = repo.get_final_report_by_master_place_id(master_place_id)
    if not report:
        raise HTTPException(status_code=404, detail="Final report not found")
    return report.final_report_json
```

---

# 10. FastAPI 엔트리포인트

## `app/main.py`

```python
from fastapi import FastAPI

from app.api.routes import router
from app.core.config import settings
from app.core.database import Base, engine
import app.models  # noqa: F401

Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.app_name)
app.include_router(router)


@app.get("/")
def health_check():
    return {"message": "Place Preference API is running"}
```

---

# 11. 실행 파일

## `run.py`

```python
import uvicorn

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
```

---

# 12. 실행 방법

## 패키지 설치

```bash
pip install -r requirements.txt
```

## 서버 실행

```bash
python run.py
```

또는

```bash
uvicorn app.main:app --reload
```

---

# 13. 테스트 요청 예시

## 파이프라인 실행

```bash
curl -X POST "http://127.0.0.1:8000/api/reviews/pipeline/run" \
  -H "Content-Type: application/json" \
  -d '{
    "place_name": "스타벅스 강남R점",
    "category_main": "cafe"
  }'
```

## 최종 리포트 조회

먼저 DB에 저장된 `master_place_id`를 알아야 하므로, 현재 골격에서는 파이프라인 응답에 `master_place_id`를 추가해 주는 게 좋다.
지금 코드에는 빠져 있으니 바로 아래처럼 보완하면 된다.

`pipeline.py`의 `final_json` 수정:

```python
final_json = {
    "master_place_id": place.master_place_id,
    "place_name": place.place_name,
    "category_main": place.category_main,
    "final_preference_score": final_score,
    "platform_scores": platform_scores,
    "common_strengths": common_strengths,
    "common_weaknesses": common_weaknesses,
    "platform_differences": platform_differences,
    "aspect_summary_by_platform": dict(aspect_summary_by_platform),
}
```

그 후 조회:

```bash
curl "http://127.0.0.1:8000/api/reviews/reports/P-XXXXXXXX"
```

---

# 14. MVP에서 바로 손봐야 하는 부분

지금 골격은 구조 검증용이다. 실서비스용으로 가려면 바로 다음을 손봐야 한다.

## 1. JSON 컬럼 default

SQLAlchemy에서 `default={}` 또는 `default=[]`는 공유 mutable 이슈가 생길 수 있다.
실제로는 아래처럼 함수형으로 바꾸는 게 안전하다.

예:

```python
summary_json = Column(JSON, default=dict)
common_strengths_json = Column(JSON, default=list)
```

`report.py`에서 이건 바로 수정하는 걸 권장한다.

---

## 2. 중복 실행 시 중복 데이터

현재는 같은 장소를 여러 번 요청하면 `Place`가 새로 생성된다.
실제로는:

* `master_place_id` 생성 전에 기존 장소 탐색
* 같은 query/category면 upsert
* 또는 실행 이력 테이블 분리

가 필요하다.

---

## 3. transaction 처리

현재는 마지막에 `commit()` 한 번만 한다.
MVP로는 괜찮지만, 중간 실패 시 rollback 처리 추가가 좋다.

예:

```python
try:
    ...
    self.db.commit()
except Exception:
    self.db.rollback()
    raise
```

---

## 4. Alembic 미적용

현재는 `Base.metadata.create_all()` 방식이다.
실무로 가면 Alembic migration으로 바꾸는 게 맞다.

---

## 5. 더미 collector

지금은 실제 수집이 아니라 구조 테스트용이다.
나중에 다음만 교체하면 된다.

* `DummyGoogleCollector`
* `DummyKakaoCollector`
* `DummyNaverCollector`

즉, 서비스 레이어는 유지한 채 수집기만 실제 구현으로 갈아끼우는 구조다.

---

# 15. 지금 바로 추가하면 좋은 개선 3개

가장 먼저 붙이면 효율 좋은 건 이 셋이다.

첫째, `master_place_id`를 응답에 포함시키기
둘째, 예외 발생 시 rollback 처리
셋째, platform/place/review 조회용 간단 GET API 추가

---

# 16. 최소 개선 버전 예시

`pipeline.py`의 `run()` 마지막 부분은 이렇게 바꾸는 걸 권장한다.

```python
try:
    ...
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
```

---

# 17. 네 프로젝트 기준으로 이 구조의 장점

이 FastAPI 골격은 네 프로젝트에 특히 잘 맞는다.

* 분석 파이프라인이 서비스 레이어로 분리됨
* 수집기만 교체하면 실제 데이터 연결 가능
* 리포트 JSON이 API 응답과 DB 저장 형식을 동시에 만족함
* 나중에 프론트, 대시보드, 배치 파이프라인으로 확장하기 쉬움

---

다음 단계로 이어서 가장 자연스러운 건
**FastAPI + SQLAlchemy 개선판 전체 코드**, 아니면 **collector 제외하고 바로 실행 가능한 샘플 데이터 포함 버전**이다.
