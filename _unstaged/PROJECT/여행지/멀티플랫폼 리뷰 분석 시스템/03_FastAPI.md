# 1. 디렉터리 구조

```text
app/
├─ main.py
├─ api/
│  └─ routes.py
├─ core/
│  ├─ config.py
│  └─ exceptions.py
├─ schemas/
│  ├─ request.py
│  ├─ common.py
│  └─ response.py
├─ services/
│  ├─ pipeline.py
│  ├─ place_search.py
│  ├─ place_matcher.py
│  ├─ review_normalizer.py
│  ├─ preprocess.py
│  ├─ analyzer.py
│  ├─ scorer.py
│  ├─ comparator.py
│  └─ report_builder.py
├─ collectors/
│  ├─ base.py
│  ├─ google.py
│  ├─ kakao.py
│  └─ naver.py
└─ resources/
   └─ aspect_dictionary.py
```

---

# 2. `app/main.py`

```python
from fastapi import FastAPI
from app.api.routes import router
from app.core.exceptions import add_exception_handlers

app = FastAPI(
    title="Place Review Compare API",
    version="0.1.0",
    description="멀티플랫폼 장소 리뷰 비교 분석 API",
)

app.include_router(router)
add_exception_handlers(app)


@app.get("/health")
def health_check() -> dict:
    return {"status": "ok"}
```

---

# 3. `app/api/routes.py`

```python
from fastapi import APIRouter, HTTPException
from app.schemas.request import ReviewCompareRequest
from app.schemas.response import ReviewCompareResponse
from app.services.pipeline import ReviewComparePipeline
from app.core.exceptions import AppError

router = APIRouter(prefix="/api/review-compare", tags=["review-compare"])

pipeline = ReviewComparePipeline()


@router.post("/run", response_model=ReviewCompareResponse)
async def run_review_compare(payload: ReviewCompareRequest) -> ReviewCompareResponse:
    try:
        result = await pipeline.run(payload)
        return result
    except AppError:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
```

---

# 4. `app/core/config.py`

```python
from pydantic import BaseModel


class Settings(BaseModel):
    default_max_reviews_per_platform: int = 100
    max_reviews_upper_bound: int = 500
    min_reviews_for_analysis: int = 5
    match_threshold: float = 0.75


settings = Settings()
```

---

# 5. `app/core/exceptions.py`

```python
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse


class AppError(Exception):
    def __init__(self, code: str, message: str, status_code: int = 400, details: dict | None = None):
        self.code = code
        self.message = message
        self.status_code = status_code
        self.details = details or {}
        super().__init__(message)


def add_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(AppError)
    async def app_error_handler(request: Request, exc: AppError):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "data": None,
                "error": {
                    "code": exc.code,
                    "message": exc.message,
                    "details": exc.details,
                },
            },
        )
```

---

# 6. `app/schemas/request.py`

```python
from typing import Literal
from pydantic import BaseModel, Field, field_validator


class ReviewCompareRequest(BaseModel):
    place_name: str = Field(..., min_length=1, max_length=200)
    category_main: Literal["restaurant", "cafe", "attraction"]
    category_sub: str | None = Field(default=None, max_length=100)
    max_reviews_per_platform: int = Field(default=100, ge=1, le=500)
    enable_user_selection_hint: bool = True

    @field_validator("place_name")
    @classmethod
    def validate_place_name(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("place_name must not be empty")
        return v
```

---

# 7. `app/schemas/common.py`

```python
from datetime import date
from typing import Literal
from pydantic import BaseModel, Field


class PlaceCandidate(BaseModel):
    platform: Literal["google", "kakao", "naver"]
    place_name: str
    address: str | None = None
    road_address: str | None = None
    lat: float | None = None
    lng: float | None = None
    phone: str | None = None
    category: str | None = None
    rating: float | None = None
    review_count: int | None = None
    source_url: str | None = None
    raw_ref: dict = Field(default_factory=dict)


class MatchedPlace(BaseModel):
    selected: PlaceCandidate | None = None
    confidence: float = 0.0
    status: Literal["matched", "needs_user_selection", "not_found"]


class NormalizedReview(BaseModel):
    platform: Literal["google", "kakao", "naver"]
    review_id: str
    reviewer_name_raw: str | None = None
    reviewer_id_hash: str | None = None
    rating: float | None = None
    review_text: str
    review_date: date | None = None
    like_count: int = 0
    has_photo: bool = False
    visit_verified: bool = False
    language: str | None = None
    review_type: str | None = None
    source_url: str | None = None
    meta: dict = Field(default_factory=dict)


class ReviewAnalysisResult(BaseModel):
    sentiment_label: Literal["positive", "neutral", "negative"]
    sentiment_score: float
    revisit_intent_score: float
    recommend_intent_score: float
    confidence_score: float
    informativeness_score: float
    freshness_score: float
    aspects: list[dict] = Field(default_factory=list)
    keywords: list[str] = Field(default_factory=list)
```

---

# 8. `app/schemas/response.py`

```python
from pydantic import BaseModel, Field


class ReviewCompareResponse(BaseModel):
    success: bool = True
    data: dict
    error: dict | None = None


class ReportPayload(BaseModel):
    input: dict
    matched_places: dict[str, dict | None]
    collection_summary: dict[str, int]
    platform_scores: dict[str, float]
    aspect_summary_by_platform: dict[str, dict[str, float]]
    common_strengths: list[str] = Field(default_factory=list)
    common_weaknesses: list[str] = Field(default_factory=list)
    platform_differences: list[str] = Field(default_factory=list)
    final_preference_score: float
    warnings: list[str] = Field(default_factory=list)
```

위처럼 `ReviewCompareResponse`를 단순 wrapper로 쓸 수도 있고, 바로 `ReportPayload`를 응답 모델로 써도 됩니다.
일관된 에러 포맷을 원하면 wrapper 방식이 더 편합니다.

---

# 9. `app/collectors/base.py`

```python
from abc import ABC, abstractmethod
from app.schemas.common import PlaceCandidate


class BaseCollector(ABC):
    platform: str

    @abstractmethod
    async def search_places(self, query: str, category: str | None = None) -> list[PlaceCandidate]:
        raise NotImplementedError

    @abstractmethod
    async def collect_reviews(self, place_ref: PlaceCandidate, limit: int) -> list[dict]:
        raise NotImplementedError
```

---

# 10. `app/collectors/google.py`

```python
from app.collectors.base import BaseCollector
from app.schemas.common import PlaceCandidate


class GoogleCollector(BaseCollector):
    platform = "google"

    async def search_places(self, query: str, category: str | None = None) -> list[PlaceCandidate]:
        # TODO: 실제 구현 연결
        return [
            PlaceCandidate(
                platform="google",
                place_name=query,
                address="서울시 예시 주소",
                category=category,
                rating=4.3,
                review_count=120,
                source_url="https://example.com/google/place",
                raw_ref={"mock": True},
            )
        ]

    async def collect_reviews(self, place_ref: PlaceCandidate, limit: int) -> list[dict]:
        # TODO: 실제 구현 연결
        return [
            {
                "platform": "google",
                "review_id": "google-1",
                "reviewer_name_raw": "user1",
                "rating": 4.0,
                "review_text": "분위기가 좋고 커피도 맛있어요.",
                "source_url": place_ref.source_url,
            }
        ][:limit]
```

---

# 11. `app/collectors/kakao.py`

```python
from app.collectors.base import BaseCollector
from app.schemas.common import PlaceCandidate


class KakaoCollector(BaseCollector):
    platform = "kakao"

    async def search_places(self, query: str, category: str | None = None) -> list[PlaceCandidate]:
        return [
            PlaceCandidate(
                platform="kakao",
                place_name=query,
                address="서울시 예시 주소",
                category=category,
                rating=4.1,
                review_count=85,
                source_url="https://example.com/kakao/place",
                raw_ref={"mock": True},
            )
        ]

    async def collect_reviews(self, place_ref: PlaceCandidate, limit: int) -> list[dict]:
        return [
            {
                "platform": "kakao",
                "review_id": "kakao-1",
                "reviewer_name_raw": "user2",
                "rating": 4.0,
                "review_text": "좌석은 조금 불편하지만 위치가 좋아요.",
                "source_url": place_ref.source_url,
            }
        ][:limit]
```

---

# 12. `app/collectors/naver.py`

```python
from app.collectors.base import BaseCollector
from app.schemas.common import PlaceCandidate


class NaverCollector(BaseCollector):
    platform = "naver"

    async def search_places(self, query: str, category: str | None = None) -> list[PlaceCandidate]:
        return [
            PlaceCandidate(
                platform="naver",
                place_name=query,
                address="서울시 예시 주소",
                category=category,
                rating=4.5,
                review_count=230,
                source_url="https://example.com/naver/place",
                raw_ref={"mock": True},
            )
        ]

    async def collect_reviews(self, place_ref: PlaceCandidate, limit: int) -> list[dict]:
        return [
            {
                "platform": "naver",
                "review_id": "naver-1",
                "reviewer_name_raw": "user3",
                "rating": 5.0,
                "review_text": "디저트가 맛있고 분위기가 정말 좋아서 재방문하고 싶어요.",
                "source_url": place_ref.source_url,
                "review_type": "visitor",
            }
        ][:limit]
```

---

# 13. `app/services/place_search.py`

```python
import asyncio
from app.collectors.google import GoogleCollector
from app.collectors.kakao import KakaoCollector
from app.collectors.naver import NaverCollector
from app.schemas.common import PlaceCandidate


class PlaceSearchService:
    def __init__(self) -> None:
        self.collectors = {
            "google": GoogleCollector(),
            "kakao": KakaoCollector(),
            "naver": NaverCollector(),
        }

    async def search_all(self, query: str, category: str | None = None) -> dict[str, list[PlaceCandidate]]:
        results = await asyncio.gather(
            self.collectors["google"].search_places(query, category),
            self.collectors["kakao"].search_places(query, category),
            self.collectors["naver"].search_places(query, category),
            return_exceptions=True,
        )

        output: dict[str, list[PlaceCandidate]] = {}
        for platform, result in zip(self.collectors.keys(), results):
            output[platform] = result if not isinstance(result, Exception) else []
        return output
```

---

# 14. `app/services/place_matcher.py`

```python
from difflib import SequenceMatcher
from app.schemas.common import PlaceCandidate, MatchedPlace


class PlaceMatcherService:
    def _similarity(self, a: str | None, b: str | None) -> float:
        if not a or not b:
            return 0.0
        return SequenceMatcher(None, a.lower(), b.lower()).ratio()

    def _confidence(self, query: str, candidate: PlaceCandidate, category: str | None) -> float:
        name_score = self._similarity(query, candidate.place_name)
        category_score = 1.0 if category and candidate.category == category else 0.0
        return round((name_score * 0.8) + (category_score * 0.2), 4)

    def match(
        self,
        query: str,
        candidates_by_platform: dict[str, list[PlaceCandidate]],
        category: str | None = None,
        threshold: float = 0.75,
    ) -> dict[str, MatchedPlace]:
        matched: dict[str, MatchedPlace] = {}

        for platform, candidates in candidates_by_platform.items():
            if not candidates:
                matched[platform] = MatchedPlace(selected=None, confidence=0.0, status="not_found")
                continue

            best = max(candidates, key=lambda c: self._confidence(query, c, category))
            conf = self._confidence(query, best, category)

            status = "matched" if conf >= threshold else "needs_user_selection"
            matched[platform] = MatchedPlace(selected=best, confidence=conf, status=status)

        return matched
```

---

# 15. `app/services/review_normalizer.py`

```python
from datetime import date
from app.schemas.common import NormalizedReview, PlaceCandidate


class ReviewNormalizerService:
    def normalize_reviews(self, platform: str, place: PlaceCandidate, raw_reviews: list[dict]) -> list[NormalizedReview]:
        normalized: list[NormalizedReview] = []

        for raw in raw_reviews:
            normalized.append(
                NormalizedReview(
                    platform=platform,
                    review_id=str(raw.get("review_id")),
                    reviewer_name_raw=raw.get("reviewer_name_raw"),
                    rating=raw.get("rating"),
                    review_text=(raw.get("review_text") or "").strip(),
                    review_date=date.today(),
                    has_photo=bool(raw.get("has_photo", False)),
                    language="ko",
                    review_type=raw.get("review_type"),
                    source_url=raw.get("source_url") or place.source_url,
                    meta=raw,
                )
            )

        return normalized
```

---

# 16. `app/services/preprocess.py`

```python
from app.schemas.common import NormalizedReview


class PreprocessService:
    def run(self, reviews: list[NormalizedReview]) -> list[NormalizedReview]:
        processed: list[NormalizedReview] = []

        for review in reviews:
            text = " ".join(review.review_text.split())
            if not text:
                continue

            review.review_text = text
            processed.append(review)

        return processed
```

---

# 17. `app/resources/aspect_dictionary.py`

```python
ASPECT_DICT = {
    "restaurant": {
        "맛": ["맛", "음식", "풍미", "간"],
        "가격": ["가격", "비싸", "가성비", "비용"],
        "서비스": ["서비스", "친절", "응대"],
        "분위기": ["분위기", "인테리어"],
    },
    "cafe": {
        "음료 맛": ["커피", "음료", "라떼", "맛"],
        "디저트": ["디저트", "케이크", "베이커리"],
        "분위기": ["분위기", "인테리어", "감성"],
        "좌석": ["자리", "좌석", "의자"],
        "가격": ["가격", "비싸", "가성비"],
    },
    "attraction": {
        "경관": ["풍경", "뷰", "경치"],
        "접근성": ["접근", "교통", "찾기"],
        "혼잡도": ["혼잡", "사람 많", "붐빔"],
        "편의시설": ["화장실", "편의시설", "안내"],
    },
}
```

---

# 18. `app/services/analyzer.py`

```python
from app.resources.aspect_dictionary import ASPECT_DICT
from app.schemas.common import NormalizedReview, ReviewAnalysisResult


class AnalyzerService:
    POSITIVE_WORDS = ["좋", "맛있", "훌륭", "추천", "친절", "재방문"]
    NEGATIVE_WORDS = ["별로", "나쁘", "불편", "비싸", "실망", "다시는"]

    def _sentiment_score(self, text: str) -> float:
        pos = sum(1 for word in self.POSITIVE_WORDS if word in text)
        neg = sum(1 for word in self.NEGATIVE_WORDS if word in text)
        score = (pos - neg) / max(pos + neg, 1)
        return max(-1.0, min(1.0, score))

    def _sentiment_label(self, score: float) -> str:
        if score > 0.2:
            return "positive"
        if score < -0.2:
            return "negative"
        return "neutral"

    def _extract_aspects(self, text: str, category_main: str) -> list[dict]:
        result: list[dict] = []
        aspect_dict = ASPECT_DICT.get(category_main, {})

        for aspect, keywords in aspect_dict.items():
            if any(keyword in text for keyword in keywords):
                aspect_score = self._sentiment_score(text)
                result.append(
                    {
                        "aspect": aspect,
                        "sentiment_score": aspect_score,
                        "sentiment_label": self._sentiment_label(aspect_score),
                    }
                )
        return result

    def analyze(self, reviews: list[NormalizedReview], category_main: str) -> list[tuple[NormalizedReview, ReviewAnalysisResult]]:
        output: list[tuple[NormalizedReview, ReviewAnalysisResult]] = []

        for review in reviews:
            score = self._sentiment_score(review.review_text)
            result = ReviewAnalysisResult(
                sentiment_label=self._sentiment_label(score),
                sentiment_score=score,
                revisit_intent_score=1.0 if "재방문" in review.review_text or "또" in review.review_text else 0.0,
                recommend_intent_score=1.0 if "추천" in review.review_text else 0.0,
                confidence_score=0.8,
                informativeness_score=min(len(review.review_text) / 100, 1.0),
                freshness_score=1.0,
                aspects=self._extract_aspects(review.review_text, category_main),
                keywords=[],
            )
            output.append((review, result))

        return output
```

---

# 19. `app/services/scorer.py`

```python
from collections import defaultdict


class ScorerService:
    def _review_score(self, result) -> float:
        return (
            0.5 * result.sentiment_score
            + 0.2 * result.revisit_intent_score
            + 0.2 * result.recommend_intent_score
            + 0.1 * result.informativeness_score
        )

    def _review_weight(self, result) -> float:
        return max(0.1, result.confidence_score * 0.7 + result.freshness_score * 0.3)

    def score_platforms(self, analyzed_by_platform: dict[str, list[tuple]]) -> tuple[dict[str, float], dict[str, dict[str, float]]]:
        platform_scores: dict[str, float] = {}
        aspect_summary_by_platform: dict[str, dict[str, float]] = {}

        for platform, items in analyzed_by_platform.items():
            weighted_sum = 0.0
            weight_sum = 0.0

            aspect_scores = defaultdict(list)

            for _, result in items:
                score = self._review_score(result)
                weight = self._review_weight(result)

                weighted_sum += score * weight
                weight_sum += weight

                for aspect in result.aspects:
                    aspect_scores[aspect["aspect"]].append(aspect["sentiment_score"])

            platform_scores[platform] = round((weighted_sum / weight_sum) * 100, 2) if weight_sum else 0.0
            aspect_summary_by_platform[platform] = {
                aspect: round(sum(scores) / len(scores), 3)
                for aspect, scores in aspect_scores.items()
            }

        return platform_scores, aspect_summary_by_platform

    def final_score(self, platform_scores: dict[str, float]) -> float:
        if not platform_scores:
            return 0.0
        return round(sum(platform_scores.values()) / len(platform_scores), 2)
```

---

# 20. `app/services/comparator.py`

```python
class ComparatorService:
    def compare(
        self,
        aspect_summary_by_platform: dict[str, dict[str, float]],
        platform_scores: dict[str, float],
    ) -> tuple[list[str], list[str], list[str]]:
        common_strengths: list[str] = []
        common_weaknesses: list[str] = []
        platform_differences: list[str] = []

        all_aspects = set()
        for aspect_map in aspect_summary_by_platform.values():
            all_aspects.update(aspect_map.keys())

        for aspect in all_aspects:
            values = []
            for platform, aspect_map in aspect_summary_by_platform.items():
                if aspect in aspect_map:
                    values.append(aspect_map[aspect])

            if len(values) >= 2:
                avg = sum(values) / len(values)
                if avg >= 0.3:
                    common_strengths.append(aspect)
                elif avg <= -0.3:
                    common_weaknesses.append(aspect)

        if platform_scores:
            highest = max(platform_scores, key=platform_scores.get)
            lowest = min(platform_scores, key=platform_scores.get)
            if highest != lowest:
                platform_differences.append(
                    f"{highest} 플랫폼의 종합 점수가 가장 높고, {lowest} 플랫폼이 가장 낮습니다."
                )

        return common_strengths, common_weaknesses, platform_differences
```

---

# 21. `app/services/report_builder.py`

```python
from app.schemas.response import ReviewCompareResponse


class ReportBuilderService:
    def build(
        self,
        input_payload: dict,
        matched_places: dict,
        collection_summary: dict[str, int],
        platform_scores: dict[str, float],
        aspect_summary_by_platform: dict[str, dict[str, float]],
        common_strengths: list[str],
        common_weaknesses: list[str],
        platform_differences: list[str],
        final_preference_score: float,
        warnings: list[str],
    ) -> ReviewCompareResponse:
        return ReviewCompareResponse(
            success=True,
            data={
                "input": input_payload,
                "matched_places": matched_places,
                "collection_summary": collection_summary,
                "platform_scores": platform_scores,
                "aspect_summary_by_platform": aspect_summary_by_platform,
                "common_strengths": common_strengths,
                "common_weaknesses": common_weaknesses,
                "platform_differences": platform_differences,
                "final_preference_score": final_preference_score,
                "warnings": warnings,
            },
            error=None,
        )
```

---

# 22. `app/services/pipeline.py`

```python
import asyncio

from app.core.config import settings
from app.core.exceptions import AppError
from app.schemas.request import ReviewCompareRequest
from app.services.place_search import PlaceSearchService
from app.services.place_matcher import PlaceMatcherService
from app.services.review_normalizer import ReviewNormalizerService
from app.services.preprocess import PreprocessService
from app.services.analyzer import AnalyzerService
from app.services.scorer import ScorerService
from app.services.comparator import ComparatorService
from app.services.report_builder import ReportBuilderService
from app.collectors.google import GoogleCollector
from app.collectors.kakao import KakaoCollector
from app.collectors.naver import NaverCollector


class ReviewComparePipeline:
    def __init__(self) -> None:
        self.place_search_service = PlaceSearchService()
        self.place_matcher_service = PlaceMatcherService()
        self.normalizer_service = ReviewNormalizerService()
        self.preprocess_service = PreprocessService()
        self.analyzer_service = AnalyzerService()
        self.scorer_service = ScorerService()
        self.comparator_service = ComparatorService()
        self.report_builder = ReportBuilderService()

        self.collectors = {
            "google": GoogleCollector(),
            "kakao": KakaoCollector(),
            "naver": NaverCollector(),
        }

    async def run(self, payload: ReviewCompareRequest):
        warnings: list[str] = []

        candidates_by_platform = await self.place_search_service.search_all(
            query=payload.place_name,
            category=payload.category_main,
        )

        matched_places = self.place_matcher_service.match(
            query=payload.place_name,
            candidates_by_platform=candidates_by_platform,
            category=payload.category_main,
            threshold=settings.match_threshold,
        )

        selected_places = {
            platform: match.selected
            for platform, match in matched_places.items()
            if match.selected is not None
        }

        if not selected_places:
            raise AppError(
                code="PLACE_NOT_FOUND",
                message="모든 플랫폼에서 장소를 찾지 못했습니다.",
                status_code=404,
            )

        async def collect(platform: str, selected_place):
            collector = self.collectors[platform]
            return await collector.collect_reviews(selected_place, payload.max_reviews_per_platform)

        tasks = [
            collect(platform, selected_place)
            for platform, selected_place in selected_places.items()
        ]
        raw_results = await asyncio.gather(*tasks, return_exceptions=True)

        raw_reviews_by_platform: dict[str, list[dict]] = {}
        for (platform, _), result in zip(selected_places.items(), raw_results):
            if isinstance(result, Exception):
                raw_reviews_by_platform[platform] = []
                warnings.append(f"{platform} 리뷰 수집에 실패했습니다.")
            else:
                raw_reviews_by_platform[platform] = result

        collection_summary = {
            platform: len(reviews)
            for platform, reviews in raw_reviews_by_platform.items()
        }

        normalized_by_platform = {}
        for platform, reviews in raw_reviews_by_platform.items():
            if platform not in selected_places:
                continue
            normalized_by_platform[platform] = self.normalizer_service.normalize_reviews(
                platform=platform,
                place=selected_places[platform],
                raw_reviews=reviews,
            )

        preprocessed_by_platform = {
            platform: self.preprocess_service.run(reviews)
            for platform, reviews in normalized_by_platform.items()
        }

        analyzed_by_platform = {
            platform: self.analyzer_service.analyze(reviews, payload.category_main)
            for platform, reviews in preprocessed_by_platform.items()
        }

        total_reviews = sum(len(v) for v in preprocessed_by_platform.values())
        if total_reviews < settings.min_reviews_for_analysis:
            warnings.append("분석 가능한 리뷰 수가 적어 결과 해석에 주의가 필요합니다.")

        platform_scores, aspect_summary_by_platform = self.scorer_service.score_platforms(analyzed_by_platform)
        final_preference_score = self.scorer_service.final_score(platform_scores)

        common_strengths, common_weaknesses, platform_differences = self.comparator_service.compare(
            aspect_summary_by_platform=aspect_summary_by_platform,
            platform_scores=platform_scores,
        )

        matched_places_payload = {
            platform: (
                {
                    "place_name": match.selected.place_name,
                    "address": match.selected.address,
                    "source_url": match.selected.source_url,
                    "confidence": match.confidence,
                    "status": match.status,
                }
                if match.selected
                else {
                    "place_name": None,
                    "address": None,
                    "source_url": None,
                    "confidence": match.confidence,
                    "status": match.status,
                }
            )
            for platform, match in matched_places.items()
        }

        return self.report_builder.build(
            input_payload=payload.model_dump(),
            matched_places=matched_places_payload,
            collection_summary=collection_summary,
            platform_scores=platform_scores,
            aspect_summary_by_platform=aspect_summary_by_platform,
            common_strengths=common_strengths,
            common_weaknesses=common_weaknesses,
            platform_differences=platform_differences,
            final_preference_score=final_preference_score,
            warnings=warnings,
        )
```

---

# 23. 실행용 `run.py`

```python
import uvicorn

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
```

---

# 24. 최소 설치 패키지

```txt
fastapi
uvicorn
pydantic
```

---

# 25. 바로 테스트할 요청 예시

```bash
curl -X POST "http://127.0.0.1:8000/api/review-compare/run" \
  -H "Content-Type: application/json" \
  -d '{
    "place_name": "스타벅스 강남R점",
    "category_main": "cafe",
    "max_reviews_per_platform": 50
  }'
```

---

# 26. 이 골격에서 바로 다음으로 붙이면 좋은 것

지금 코드는 **동작 흐름 검증용 뼈대**입니다.
실제로 다음 순서로 붙이는 게 좋습니다.

1. `collector` 실제 구현
2. `place_matcher`에 이름+주소 유사도 추가
3. `preprocess`에 언어감지/중복제거 추가
4. `analyzer`를 규칙 기반 → 모델 기반으로 고도화
5. `comparator`에 플랫폼별 차이 문장 강화
6. `warnings` 체계 세분화

---

# 27. 가장 중요한 설계 포인트

이 구조의 핵심은 **DB 없이도 계층 분리가 유지된다**는 점입니다.

즉:

* `routes.py`는 입구
* `pipeline.py`는 전체 흐름 제어
* `collectors/`는 플랫폼 수집
* `services/`는 분석 로직
* `schemas/`는 계약 정의

이렇게 나누면 나중에 DB를 붙여도 전체를 뜯어고치지 않고 확장할 수 있습니다.