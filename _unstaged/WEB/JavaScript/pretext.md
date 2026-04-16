`pretext`는 **브라우저 DOM reflow를 피하면서 텍스트의 multiline 높이와 줄바꿈 결과를 계산하는 순수 JS/TS 라이브러리**입니다. 핵심 아이디어는 `prepare()` 단계에서 텍스트를 분석·측정해 두고, 이후 `layout()` 단계에서는 **캐시된 폭 정보만으로 산술 계산**을 수행하는 2단계 구조입니다. README에서도 이 흐름을 공식 API로 제시하고 있고, `package.json` 기준 현재 퍼블리시 엔트리는 `dist/layout.js`, 추가 서브패스는 `rich-inline`입니다. ([GitHub][1])

## 1. 리포지터리 구조에서 봐야 할 핵심

실제 엔진은 거의 전부 `src/` 아래에 모여 있습니다. 특히 핵심 파일은 다음 6개입니다. `layout.ts`는 공개 API와 전체 파이프라인 오케스트레이션, `analysis.ts`는 공백 정규화/세그먼트 분해/언어별 분기, `measurement.ts`는 canvas 기반 측정과 캐시, `line-break.ts`는 실제 줄바꿈 워커, `bidi.ts`는 혼합 LTR/RTL용 레벨 계산, `rich-inline.ts`는 mention/chip 같은 inline-only rich text helper입니다. `src` 디렉터리 목록에서도 이 구성이 그대로 드러납니다. ([GitHub][2])

## 2. 전체 데이터 흐름

가장 중요한 흐름은 아래입니다.

`text + font + options`
→ `analysis.ts`에서 whitespace 정규화, segment 분해, 특수 문자 분류
→ `measurement.ts`에서 각 segment 폭 측정 및 캐시
→ `layout.ts`에서 opaque prepared 구조 생성
→ `line-break.ts`에서 maxWidth 기준 줄 계산
→ 필요하면 `layoutWithLines()`나 `walkLineRanges()`로 실제 줄 범위/문자열 materialize

README도 `prepare()`는 “normalize whitespace, segment, apply glue rules, measure with canvas”를 담당하고, `layout()`은 이후 재사용되는 “cheap hot path”라고 설명합니다. 소스에서도 `prepareInternal()`이 `analyzeText(...)`를 호출하고, 이어 `measureAnalysis(...)`가 측정된 병렬 배열 구조를 만든 뒤, `layout*` 계열 API가 `walkPreparedLinesRaw(...)`나 `measurePreparedLineGeometry(...)`를 호출하는 구조입니다. ([GitHub][3])

## 3. `layout.ts`: 공개 API와 prepared 데이터 구조

이 파일이 사실상 라이브러리의 중심입니다. 주석 자체가 설계 철학을 아주 명확하게 적고 있습니다. DOM 기반 측정은 `getBoundingClientRect`/`offsetHeight`로 인해 reflow를 유발하니, Pretext는 canvas `measureText`를 이용해 먼저 준비하고 나중에는 순수 산술로만 레이아웃을 계산한다는 구조입니다. 또한 `Intl.Segmenter` 기반으로 CJK, Thai, Arabic 등을 다루고, trailing whitespace hanging, punctuation merging, overflow-wrap 대응, emoji correction까지 언급합니다. ([GitHub][4])

내부 prepared 구조는 병렬 배열 위주입니다.

* `widths`
* `lineEndFitAdvances`
* `lineEndPaintAdvances`
* `kinds`
* `breakableFitAdvances`
* `segLevels`
* `chunks`

이 중 `PreparedText`는 opaque handle이고, `PreparedTextWithSegments`만 `segments`를 노출합니다. 즉, 일반 사용자는 내부 표현에 의존하지 못하게 막고, 고급 사용자는 `prepareWithSegments()`로 richer structure를 받게 설계했습니다. 이건 API 안정성을 지키려는 전형적인 라이브러리 설계입니다. ([GitHub][4])

공개 API는 대략 두 층입니다.

* 일반 높이 계산: `prepare`, `layout`
* 고급 수동 레이아웃: `prepareWithSegments`, `layoutWithLines`, `walkLineRanges`, `measureLineStats`, `measureNaturalWidth`, `layoutNextLine`, `layoutNextLineRange`, `materializeLineRange`

README의 API glossary와 `layout.ts`의 export 영역이 이 구성을 서로 일치하게 보여줍니다. `layoutWithLines()`는 전체 줄 배열을 반환하고, `walkLineRanges()`는 문자열 materialization 없이 줄 범위만 순회하며, `measureLineStats()`는 line count와 max line width만 구합니다. ([GitHub][3])

또 하나 눈에 띄는 점은 `setLocale(locale)`입니다. 내부적으로 `setAnalysisLocale(locale)`를 호출한 뒤 전체 캐시를 비웁니다. 즉, 언어 분절 기준을 바꾸면 분석 캐시와 결과를 재사용하지 않겠다는 안전한 선택입니다. ([GitHub][5])

## 4. `analysis.ts`: “텍스트를 어디서 끊을 것인가”를 결정하는 전처리 계층

이 파일은 단순 tokenizer가 아니라 **브라우저 줄바꿈에 최대한 맞추기 위한 의미 단위 분해기**에 가깝습니다.

먼저 세그먼트 종류가 꽤 세분화되어 있습니다.

* `text`
* `space`
* `preserved-space`
* `tab`
* `glue`
* `zero-width-break`
* `soft-hyphen`
* `hard-break`

즉, 그냥 “문자열 + 폭” 수준이 아니라, 공백 보존 여부와 줄바꿈 특수문자까지 별도 타입으로 들고 갑니다. `TextAnalysis`도 `normalized` 문자열과 `chunks`, 그리고 병합된 segmentation 배열들을 함께 들고 있습니다. ([GitHub][6])

화이트스페이스 정책도 `normal`과 `pre-wrap` 두 모드로 분기합니다. `pre-wrap`이면 ordinary spaces와 hard breaks를 보존하고, 기본 `normal`이면 collapsing 합니다. README의 옵션 설명과 `analysis.ts`의 `getWhiteSpaceProfile()`/`normalizeWhitespaceNormal()`이 정확히 대응합니다. ([GitHub][3])

국제화 대응도 깊습니다.

* `Intl.Segmenter`를 word granularity로 사용
* CJK 감지용 `isCJK`
* `keep-all` 관련 접착 규칙
* kinsoku용 `kinsokuStart`, `leftStickyPunctuation`
* closing quote 처리
* URL-like run 병합
* 숫자 run 판정 `isNumericRunSegment`

특히 `isCJK`, `canContinueKeepAllTextRun`, `endsWithClosingQuote`, `isNumericRunSegment`가 모두 export되어 있고, `layout.ts`가 이것들을 직접 가져다 씁니다. 즉 분석 결과가 이후 측정 전략과 줄바꿈 전략까지 좌우합니다. ([GitHub][4])

실무적으로 해석하면, 이 레이어는 “텍스트를 어떻게 **브라우저와 비슷하게 의미 단위로 쪼갤 것인가**”를 책임집니다. 여기서 제대로 쪼개지지 않으면 뒤의 폭 측정이 아무리 정확해도 줄바꿈이 브라우저와 어긋납니다.

## 5. `measurement.ts`: 폭 측정과 브라우저별 보정

이 파일은 말 그대로 폭 계산 엔진입니다. 핵심은 canvas `measureText`를 쓰되, 결과를 그대로 믿지 않고 **브라우저 엔진 특성 차이**를 반영한다는 점입니다.

가장 중요한 함수는 다음입니다.

* `getSegmentMetricCache(font)` : 폰트별 segment metric cache
* `getSegmentMetrics(seg, cache)` : 실제 `ctx.measureText(seg).width`
* `getEngineProfile()` : 브라우저별 미세 조정값
* `getCorrectedSegmentWidth(...)` : emoji correction 적용 폭
* `getSegmentBreakableFitAdvances(...)` : grapheme 단위 fit advances 계산
* `getFontMeasurementState(font, needsEmojiCorrection)` : font cache + emoji correction 세트 반환

소스상 `getSegmentMetrics()`는 측정 결과를 cache에 저장하고, `getEngineProfile()`은 Safari/Chromium 여부에 따라 `lineFitEpsilon`, `carryCJKAfterClosingQuote`, `preferPrefixWidthsForBreakableRuns`, `preferEarlySoftHyphenBreak` 등을 다르게 줍니다. 즉 완전한 “브라우저 독립 엔진”이 아니라, **브라우저 동작을 따라가기 위한 profile-based 호환 계층**입니다. ([GitHub][7])

가장 흥미로운 부분은 emoji correction입니다. `textMayContainEmoji()`로 후보를 걸러내고, `getFontMeasurementState()`가 필요할 때만 `emojiCorrection`을 계산합니다. `getCorrectedSegmentWidth()`는 emoji 개수만큼 correction 값을 빼는 방식입니다. README 상단 주석도 Chrome/Firefox에서 특정 환경의 canvas emoji 측정이 DOM보다 넓게 나오는 문제를 한 번의 캐시된 보정으로 맞춘다고 설명합니다. ([GitHub][7])

또 `getSegmentBreakableFitAdvances()`가 있다는 점이 중요합니다. 이는 단어 전체가 안 들어갈 때 grapheme 단위로 어느 지점까지 “fit”되는지 계산하기 위한 데이터입니다. 그래서 Pretext는 단순히 “단어 단위 wrap”만 하는 게 아니라, overflow 상황에서 character-level break도 처리할 수 있습니다. ([GitHub][7])

## 6. `line-break.ts`: 실제 줄바꿈 워커

여기가 성능 핵심입니다. `layout.ts`는 API 표면이고, 진짜 줄 계산은 이 파일이 합니다.

공개된 핵심 함수는:

* `normalizeLineStart(...)`
* `countPreparedLines(...)`
* `walkPreparedLinesRaw(...)`

`PreparedLineBreakData` 타입을 보면, 입력은 `widths`, `lineEndFitAdvances`, `lineEndPaintAdvances`, `kinds`, `simpleLineWalkFastPath`, `breakableFitAdvances`, `discretionaryHyphenWidth`, `tabStopAdvance`, `chunks` 등입니다. 즉 `analysis + measurement` 결과를 거의 그대로 line walker에 넘기는 구조입니다. ([GitHub][8])

특히 `simpleLineWalkFastPath`가 true면 `walkPreparedLinesSimple()`로 빠지고, 아니면 일반 경로로 갑니다. 이건 정상적인 plain text 케이스를 더 빠르게 처리하려는 최적화입니다. 반대로 soft-hyphen, tab, preserved-space 같은 요소가 있으면 일반 경로가 필요합니다. `layout.ts`에서도 특정 kind가 `text`, `space`, `zero-width-break` 이외면 fast path를 끄도록 되어 있습니다. ([GitHub][8])

또 `chunks` 개념이 있습니다. `layout.ts`의 주석과 필드 이름상 hard-break chunk hint이며, `analysis`의 chunk를 prepared chunk로 매핑합니다. 즉 `\n` 같은 강제 줄바꿈을 기준으로 큰 단위를 먼저 나누고, 그 안에서 세부 wrap을 하는 식입니다. 이건 긴 텍스트에서 불필요한 선형 탐색을 줄이는 데 도움이 됩니다. ([GitHub][4])

## 7. `bidi.ts`: RTL/LTR 혼합 텍스트용 메타데이터

README와 `layout.ts` 주석은 bidi를 “custom rendering용 simplified rich-path metadata”라고 설명합니다. `computeSegmentLevels(normalized, segStarts)`는 전체 normalized 문자열의 bidi level을 계산하고, 각 segment 시작 위치에 대응하는 `Int8Array`를 만듭니다. 중요한 건 `layout()` 자체는 이 값을 쓰지 않고, 주로 수동 렌더링 경로에서 쓰는 메타데이터라는 점입니다. 즉 줄 수 계산 자체보다 **시각적 순서가 필요한 고급 렌더링**을 위한 부가정보입니다. ([GitHub][4])

## 8. `rich-inline.ts`: 범용 rich text 엔진이 아니라 좁은 범위의 inline helper

README에서 이 모듈은 의도적으로 범위를 좁혔다고 못 박습니다. raw inline text, caller-owned `extraWidth`, `break: 'never'`, `white-space: normal` only, nested markup tree는 지원하지 않는다고 설명합니다. 즉 이 모듈은 브라우저 전체 inline formatting model을 재구현하려는 게 아니라, mention/chip/code-span 같은 UI용 inline layout helper입니다. ([GitHub][3])

이 설계는 꽤 좋습니다. 본체 `layout.ts`는 텍스트 레이아웃의 코어 엔진만 맡고, rich inline은 “제한된 고수준 조합기”로 분리해 범위 폭발을 막고 있습니다.

## 9. 이 라이브러리의 설계 포인트를 한 문장으로 요약하면

Pretext는 **“브라우저 줄바꿈과 최대한 비슷한 결과를 얻기 위해, 텍스트를 세밀하게 분석하고, canvas 측정치를 캐시하고, 그 위에서 빠른 line-walking을 수행하는 엔진”**입니다. README가 강조하듯 resize 시에는 `prepare()`를 다시 하지 말고 `layout()`만 다시 하라는 이유도 바로 여기에 있습니다. 전처리 비용과 hot path를 분리해 성능을 확보한 것입니다. ([GitHub][3])

## 10. 코드 분석 관점에서 본 장점

첫째, 공개 API와 내부 표현이 잘 분리되어 있습니다. `PreparedText`를 opaque로 만든 점이 좋습니다. 내부 배열 구조를 바꿔도 사용자 API를 유지하기 쉽습니다. ([GitHub][4])

둘째, 국제화와 브라우저 차이를 무시하지 않았습니다. `Intl.Segmenter`, CJK/kinsoku, bidi, URL-like run, 숫자 run, emoji correction, Safari/Chromium engine profile까지 들어가 있어 “영문만 잘 되는 빠른 라이브러리” 수준을 넘어섭니다. ([GitHub][4])

셋째, API 계층이 잘 나뉘어 있습니다. 단순 높이 계산 사용자와 custom renderer 사용자를 분리했습니다. `layout()`만 쓰는 사람은 단순하고, `layoutWithLines()`/`walkLineRanges()`/`layoutNextLineRange()`를 쓰는 사람은 더 낮은 수준으로 내려갈 수 있습니다. ([GitHub][3])

## 11. 코드 분석 관점에서 본 주의점

`layout.ts`, `analysis.ts`, `line-break.ts`가 상당히 큽니다. 공개 API는 단순하지만 내부 규칙이 많아 유지보수 난도는 낮지 않습니다. 특히 브라우저 호환 규칙이 늘어날수록 regression risk가 커질 수 있습니다. 이 리포지터리가 `accuracy-check`, `probe-check`, `corpus-sweep` 같은 검증 스크립트를 따로 두는 이유도 여기에 있습니다. ([GitHub][9])

또 README는 server-side를 “soon”이라고 표현하지만, 현재 package 설명과 소스는 기본적으로 browser measurement, OffscreenCanvas or DOM canvas context를 전제합니다. 즉 완전한 서버 독립형 텍스트 레이아웃 엔진이라고 보기는 아직 이릅니다. ([GitHub][1])

## 12. 실전에서 이 코드를 읽는 순서

제가 추천하는 읽기 순서는 이렇습니다.

1. `README`에서 사용 시나리오 확인
2. `src/layout.ts`에서 public API와 prepared 구조 확인
3. `src/analysis.ts`에서 segment kind와 whitespace/CJK 규칙 확인
4. `src/measurement.ts`에서 캐시와 emoji/browser 보정 확인
5. `src/line-break.ts`에서 실제 line walker 확인
6. 필요하면 `src/rich-inline.ts`, `src/bidi.ts` 확인

이 순서로 보면 “왜 이렇게 복잡한가”가 납득됩니다. 복잡성 대부분이 단순 성능이 아니라 **브라우저와 맞는 줄바꿈 정확도**에서 나옵니다. README와 개발 문서도 accuracy-check와 cross-browser 검증을 별도로 강조합니다. ([GitHub][9])

원하면 다음 답변에서 `layout.ts`를 기준으로 **함수 단위로 더 잘게 쪼개서** `prepare`, `measureAnalysis`, `layout`, `layoutWithLines`, `layoutNextLineRange` 각각의 내부 동작을 의사코드 수준으로 풀어드리겠습니다.

[1]: https://github.com/chenglou/pretext "GitHub - chenglou/pretext: Fast, accurate & comprehensive text measurement & layout · GitHub"
[2]: https://github.com/chenglou/pretext/tree/main/src "pretext/src at main · chenglou/pretext · GitHub"
[3]: https://github.com/chenglou/pretext/blob/main/README.md "pretext/README.md at main · chenglou/pretext · GitHub"
[4]: https://raw.githubusercontent.com/chenglou/pretext/main/src/layout.ts "raw.githubusercontent.com"
[5]: https://github.com/chenglou/pretext/blob/main/src/layout.ts "pretext/src/layout.ts at main · chenglou/pretext · GitHub"
[6]: https://github.com/chenglou/pretext/blob/main/src/analysis.ts "pretext/src/analysis.ts at main · chenglou/pretext · GitHub"
[7]: https://github.com/chenglou/pretext/blob/main/src/measurement.ts "pretext/src/measurement.ts at main · chenglou/pretext · GitHub"
[8]: https://github.com/chenglou/pretext/blob/main/src/line-break.ts "pretext/src/line-break.ts at main · chenglou/pretext · GitHub"
[9]: https://github.com/chenglou/pretext/blob/main/DEVELOPMENT.md "pretext/DEVELOPMENT.md at main · chenglou/pretext · GitHub"
