좋다. `layout.ts` 기준으로 보면, 네가 지정한 5개 함수는 사실 아래처럼 층이 나뉜다.

* `prepare` : 공개 엔트리
* `measureAnalysis` : prepare의 핵심 내부 구현
* `layout` : 가장 가벼운 count-only hot path
* `layoutWithLines` : 줄별 텍스트까지 만드는 rich path
* `layoutNextLineRange` : “현재 커서에서 다음 한 줄만” 뽑는 streaming path

즉 `prepare()`는 **문자열을 prepared 구조로 컴파일**하고, 나머지 3개 layout 계열은 prepared 구조를 읽어서 **줄 계산만** 한다. `prepareInternal()`도 실제로 `analyzeText(...)` 후 `measureAnalysis(...)`를 호출하는 얇은 래퍼다. `layout()`은 `countPreparedLines(...)`만 호출하고, `layoutWithLines()`는 `walkPreparedLinesRaw(...)`로 각 줄을 순회하며, `layoutNextLineRange()`는 `normalizeLineStart(...)` 후 `stepPreparedLineGeometry(...)`로 한 줄만 전진시킨다. ([GitHub][1])

---

## 1. `prepare(text, font, options)`

실제 본문은 매우 얇다.
하는 일은 거의 이것뿐이다.

```ts
export function prepare(text, font, options) {
  return prepareInternal(text, font, false, options)
}
```

그리고 `prepareInternal(...)`은 다시

1. `wordBreak` 기본값을 `'normal'`로 정하고
2. `analyzeText(text, getEngineProfile(), whiteSpace, wordBreak)`를 호출해

   * whitespace 정규화
   * 세그먼트 분해
   * chunk 계산
   * segment kind 분류
     를 수행한 뒤
3. `measureAnalysis(analysis, font, includeSegments, wordBreak)`로 넘긴다.
   `prepareWithSegments()`는 여기서 `includeSegments=true`만 다르다. ([GitHub][1])

### prepare 의사코드

```ts
function prepare(text, font, options):
    return prepareInternal(text, font, includeSegments=false, options)

function prepareInternal(text, font, includeSegments, options):
    wordBreak = options.wordBreak ?? "normal"
    analysis = analyzeText(
        text,
        getEngineProfile(),
        options.whiteSpace,
        wordBreak
    )
    return measureAnalysis(analysis, font, includeSegments, wordBreak)
```

### prepare의 핵심 의미

여기서 중요한 건 `prepare()`는 width를 받지 않는다는 점이다.
즉 이 단계는 **“이 텍스트를 나중에 어떤 폭에서도 빠르게 줄바꿈할 수 있도록 준비”** 하는 단계다. 그래서 결과물은 단순 문자열이 아니라 다음 같은 병렬 배열 묶음이다.

* `widths`
* `lineEndFitAdvances`
* `lineEndPaintAdvances`
* `kinds`
* `breakableFitAdvances`
* `chunks`
* 필요 시 `segments`, `segLevels` ([GitHub][2])

---

## 2. `measureAnalysis(analysis, font, includeSegments, wordBreak)`

이 함수가 사실상 prepare 단계의 본체다.
입력은 이미 분석된 `TextAnalysis`이고, 출력은 `PreparedText` 또는 `PreparedTextWithSegments`다. 시작부에서 엔진 프로필, 폰트 캐시, emoji correction, 기본 폭들을 먼저 구한다. `-` 폭은 `discretionaryHyphenWidth`, 공백 폭은 `spaceWidth`, 탭은 `spaceWidth * 8`로 잡는다. 텍스트가 비어 있으면 바로 empty prepared를 반환한다. ([GitHub][1])

그 다음 병렬 배열을 만든다.

* `widths`
* `lineEndFitAdvances`
* `lineEndPaintAdvances`
* `kinds`
* `breakableFitAdvances`
* `segStarts` (`includeSegments=true`일 때만)
* `segments` (`includeSegments=true`일 때만)
* `preparedStartByAnalysisIndex`
* `simpleLineWalkFastPath` 초기값은 `analysis.chunks.length <= 1` ([GitHub][1])

### 내부 helper 1: `pushMeasuredSegment(...)`

이 helper는 준비된 세그먼트를 병렬 배열에 한 칸씩 푸시한다.

추가로 하는 일:

* kind가 `text | space | zero-width-break`가 아니면
  `simpleLineWalkFastPath = false`
* 폭/line-end advance/kind/start/breakable advances를 각 배열에 push
* rich path면 `segments`, `segStarts`도 같이 push ([GitHub][1])

의미상 이 helper는 “prepared 구조에 세그먼트 1개 등록” 함수다.

### 내부 helper 2: `pushMeasuredTextSegment(...)`

이 helper는 텍스트 세그먼트를 실제 측정해서 push한다.

순서는 이렇다.

1. `getSegmentMetrics(text, cache)`로 canvas 측정
2. `getCorrectedSegmentWidth(...)`로 emoji correction 반영
3. `lineEndFitAdvance` 계산

   * `space`, `preserved-space`, `zero-width-break`면 0
   * 아니면 width
4. `lineEndPaintAdvance` 계산

   * `space`, `zero-width-break`면 0
   * 아니면 width
5. `allowOverflowBreaks && wordLike && text.length > 1`이면

   * breakable grapheme advances를 미리 계산
   * numeric run이면 `pair-context`
   * 아니면 엔진 프로필에 따라 `segment-prefixes` 또는 `sum-graphemes`
6. 최종적으로 `pushMeasuredSegment(...)` 호출 ([GitHub][1])

여기서 `lineEndFitAdvance`와 `lineEndPaintAdvance`를 따로 두는 게 포인트다.
예를 들어 trailing space는 **그려질 수는 있어도 줄 끝 폭 판단에는 안 넣는** 식의 CSS 유사 동작을 구현하려는 구조다. `space`와 `zero-width-break`가 여기서 특별취급된다. ([GitHub][1])

### 본 루프: analysis 세그먼트들을 prepared 세그먼트들로 바꾸기

메인 루프는 `for (mi = 0; mi < analysis.len; mi++)`다. 각 분석 세그먼트마다 먼저 현재 prepared 배열 길이를 `preparedStartByAnalysisIndex[mi]`에 저장한다. 이 매핑은 나중에 chunk를 prepared chunk로 옮길 때 쓴다. ([GitHub][1])

그 다음 분기:

#### a. `soft-hyphen`

* 폭은 0
* 줄 끝에서 선택되면 보일 하이픈 폭만 `discretionaryHyphenWidth`
* 즉 평소엔 안 보이고, break 시에만 시각 폭이 생기게 준비 ([GitHub][1])

#### b. `hard-break`

* 폭 0
* line end advance도 0
* 강제 줄바꿈 마커로만 존재 ([GitHub][1])

#### c. `tab`

* 폭 0으로 저장
* 실제 탭 위치 계산은 line-break 단계에서 `tabStopAdvance`를 사용 ([GitHub][1])

#### d. 일반 텍스트인데 CJK 포함

* `buildBaseCjkUnits(segText, engineProfile)`로 더 작은 단위로 쪼갬
* `wordBreak === 'keep-all'`이면 `mergeKeepAllTextUnits(...)`로 일부 단위 재병합
* 각 unit을 다시 `pushMeasuredTextSegment(...)`
* `allowOverflowBreaks`는 `keep-all` 여부와 `isCJK(unit.text)`에 따라 결정 ([GitHub][1])

#### e. 그 외 일반 세그먼트

* 그대로 `pushMeasuredTextSegment(segText, segKind, segStart, segWordLike, true)` ([GitHub][1])

### 마지막 마감 단계

루프가 끝나면:

1. `analysis.chunks`를 prepared segment 인덱스 기준으로 바꾸기 위해
   `mapAnalysisChunksToPreparedChunks(...)` 호출
2. rich path라면 `computeSegmentLevels(analysis.normalized, segStarts)`로 bidi level 계산
3. `includeSegments` 여부에 따라

   * `PreparedTextWithSegments`
   * 또는 opaque `PreparedText`
     반환 ([GitHub][1])

### measureAnalysis 전체 의사코드

```ts
function measureAnalysis(analysis, font, includeSegments, wordBreak):
    engineProfile = getEngineProfile()
    { cache, emojiCorrection } = getFontMeasurementState(
        font,
        textMayContainEmoji(analysis.normalized)
    )

    discretionaryHyphenWidth = correctedWidth("-")
    spaceWidth = correctedWidth(" ")
    tabStopAdvance = spaceWidth * 8

    if analysis.len == 0:
        return createEmptyPrepared(includeSegments)

    init widths[]
    init lineEndFitAdvances[]
    init lineEndPaintAdvances[]
    init kinds[]
    init breakableFitAdvances[]
    init segments?[]
    init segStarts?[]
    init preparedStartByAnalysisIndex[]
    simpleLineWalkFastPath = (analysis.chunks.length <= 1)

    function pushMeasuredSegment(...):
        if kind not in {text, space, zero-width-break}:
            simpleLineWalkFastPath = false
        push into all parallel arrays

    function pushMeasuredTextSegment(text, kind, start, wordLike, allowOverflowBreaks):
        metrics = getSegmentMetrics(text, cache)
        width = getCorrectedSegmentWidth(text, metrics, emojiCorrection)

        lineEndFitAdvance =
            if kind in {space, preserved-space, zero-width-break} then 0 else width

        lineEndPaintAdvance =
            if kind in {space, zero-width-break} then 0 else width

        if allowOverflowBreaks and wordLike and text.length > 1:
            fitMode =
                if isNumericRunSegment(text): "pair-context"
                else if engineProfile.preferPrefixWidthsForBreakableRuns: "segment-prefixes"
                else "sum-graphemes"

            fitAdvances = getSegmentBreakableFitAdvances(...)
            pushMeasuredSegment(..., fitAdvances)
        else:
            pushMeasuredSegment(..., null)

    for each analysis segment mi:
        preparedStartByAnalysisIndex[mi] = widths.length
        read segText, segKind, segStart, segWordLike

        if segKind == "soft-hyphen":
            pushMeasuredSegment(width=0, lineEnd*=discretionaryHyphenWidth, ...)
            continue

        if segKind == "hard-break":
            pushMeasuredSegment(width=0, lineEnd*=0, ...)
            continue

        if segKind == "tab":
            pushMeasuredSegment(width=0, lineEnd*=0, ...)
            continue

        segMetrics = getSegmentMetrics(segText, cache)

        if segKind == "text" and segMetrics.containsCJK:
            units = buildBaseCjkUnits(segText, engineProfile)
            if wordBreak == "keep-all":
                units = mergeKeepAllTextUnits(units)
            for each unit in units:
                pushMeasuredTextSegment(
                    unit.text,
                    "text",
                    segStart + unit.start,
                    segWordLike,
                    wordBreak == "keep-all" || !isCJK(unit.text)
                )
            continue

        pushMeasuredTextSegment(segText, segKind, segStart, segWordLike, true)

    chunks = mapAnalysisChunksToPreparedChunks(...)
    segLevels = includeSegments ? computeSegmentLevels(...) : null

    return prepared object
```

---

## 3. `layout(prepared, maxWidth, lineHeight)`

이 함수는 정말 작다.
핵심은 **“줄 개수만 세고 끝”** 이다.

```ts
export function layout(prepared, maxWidth, lineHeight) {
  const lineCount = countPreparedLines(getInternalPrepared(prepared), maxWidth)
  return { lineCount, height: lineCount * lineHeight }
}
```

즉 이 함수는

* 문자열을 다시 만들지 않고
* 줄별 시작/끝 커서를 만들지 않고
* 단순히 prepared 배열을 line-break 엔진에 넣고
* line count만 받아 height 계산

한다. 소스 주석도 resize hot path라서 `layoutWithLines()`의 추가 bookkeeping 비용을 여기서는 지불하지 않는다고 명시한다. ([GitHub][1])

### layout 의사코드

```ts
function layout(prepared, maxWidth, lineHeight):
    internal = getInternalPrepared(prepared)
    lineCount = countPreparedLines(internal, maxWidth)
    return {
        lineCount: lineCount,
        height: lineCount * lineHeight
    }
```

### 의미

이 함수는 “블록 높이만 알면 되는 경우” 최적화 버전이다.
예를 들면 React에서 텍스트 박스 높이만 예측하고 싶을 때 가장 적합하다.
실제 줄 문자열이 필요하면 이 경로가 아니라 `layoutWithLines()` 또는 `layoutNextLineRange()`를 써야 한다. ([GitHub][1])

---

## 4. `layoutWithLines(prepared, maxWidth, lineHeight)`

이 함수는 `layout()`과 줄바꿈 규칙은 같지만, 각 줄의 텍스트와 커서 범위까지 만든다. 그래서 “hot path에서는 쓰지 말라”는 주석이 붙어 있다. ([GitHub][1])

실제 순서는 이렇다.

1. `lines = []`
2. `prepared.widths.length === 0`면 빈 결과 반환
3. `getLineTextCache(prepared)`로 grapheme 캐시 확보
4. `walkPreparedLinesRaw(internal, maxWidth, visitor)` 호출
5. 각 줄마다 visitor에서 `createLayoutLine(...)` 호출
6. `createLayoutLine(...)`은 `buildLineTextFromRange(...)`로 실제 줄 문자열 생성
7. 최종적으로 `{ lineCount, height, lines }` 반환 ([GitHub][1])

### `createLayoutLine(...)`의 역할

이 helper는 line range를 실제 `LayoutLine` 객체로 바꾼다.

* `text`: `buildLineTextFromRange(...)`
* `width`
* `start {segmentIndex, graphemeIndex}`
* `end {segmentIndex, graphemeIndex}` ([GitHub][1])

즉 line-break 엔진은 **범위만 계산**하고, 문자열 materialization은 별 helper가 담당한다.

### layoutWithLines 의사코드

```ts
function layoutWithLines(prepared, maxWidth, lineHeight):
    lines = []

    if prepared.widths.length == 0:
        return { lineCount: 0, height: 0, lines: [] }

    graphemeCache = getLineTextCache(prepared)

    lineCount = walkPreparedLinesRaw(
        getInternalPrepared(prepared),
        maxWidth,
        (width, startSeg, startGraph, endSeg, endGraph) => {
            line = createLayoutLine(
                prepared,
                graphemeCache,
                width,
                startSeg,
                startGraph,
                endSeg,
                endGraph
            )
            lines.push(line)
        }
    )

    return {
        lineCount,
        height: lineCount * lineHeight,
        lines
    }
```

### 핵심 차이: `layout()` vs `layoutWithLines()`

`layout()`은:

* line count만 필요
* 가장 빠름

`layoutWithLines()`는:

* 각 줄의 text와 start/end cursor 필요
* `walkPreparedLinesRaw()` + `buildLineTextFromRange()` 비용 추가
* custom rendering, selection, shrinkwrap 등에 유리 ([GitHub][1])

---

## 5. `layoutNextLineRange(prepared, start, maxWidth)`

이 함수는 “전체 줄 배열” 대신 **현재 커서에서 다음 한 줄만** 얻는 API다.
스트리밍 처리나 사용자 정의 렌더러에 잘 맞는다.

실제 본문은 다음 흐름이다.

1. `internal = getInternalPrepared(prepared)`
2. `normalizedStart = normalizeLineStart(internal, start)`
3. `normalizedStart === null`이면 더 이상 줄이 없으므로 `null`
4. `end = { segmentIndex: normalizedStart.segmentIndex, graphemeIndex: normalizedStart.graphemeIndex }`
5. `width = stepPreparedLineGeometry(internal, end, maxWidth)`
6. `width === null`이면 `null`
7. `createLayoutLineRange(width, normalizedStart..., end...)` 반환 ([GitHub][1])

### 여기서 중요한 점

`end`를 start와 같은 값으로 초기화한 뒤 `stepPreparedLineGeometry(...)`에 넘긴다.
즉 이 함수는 **end cursor를 in-place로 앞으로 움직이게 하는 방식**으로 보인다.
반환값 `width`와 갱신된 `end`를 조합해 line range를 만든다. `layout.ts` 수준에서는 그렇게 읽히고, 실제 전진 로직은 `line-break.ts` 쪽에 있다. ([GitHub][1])

### `normalizeLineStart(...)`의 의미

이 단계는 사용자가 넘긴 start가 줄 시작으로 적절한 위치가 아니더라도, 내부 규칙에 맞는 실제 line start로 보정하는 역할이다. 예를 들어 이전 줄 끝 직후의 hanging/consumed 상태, hard break 뒤 위치 같은 것을 line-break 엔진 규칙에 맞춰 정리해 주는 entry normalization으로 해석하는 게 맞다. `layout.ts`는 여기서 바로 null 처리하므로, “더 이상 진행 가능한 줄이 없음” 판단도 이 함수가 일부 맡는다. ([GitHub][1])

### layoutNextLineRange 의사코드

```ts
function layoutNextLineRange(prepared, start, maxWidth):
    internal = getInternalPrepared(prepared)

    normalizedStart = normalizeLineStart(internal, start)
    if normalizedStart == null:
        return null

    end = {
        segmentIndex: normalizedStart.segmentIndex,
        graphemeIndex: normalizedStart.graphemeIndex
    }

    width = stepPreparedLineGeometry(internal, end, maxWidth)
    if width == null:
        return null

    return createLayoutLineRange(
        width,
        normalizedStart.segmentIndex,
        normalizedStart.graphemeIndex,
        end.segmentIndex,
        end.graphemeIndex
    )
```

### 언제 쓰는가

* 전체 `lines[]` 배열을 만들고 싶지 않을 때
* 한 줄씩 lazy하게 처리할 때
* virtualized renderer나 custom canvas renderer에서
  `cursor = previous.end` 방식으로 반복할 때 적합하다.
  `layoutNextLine()`은 같은 흐름이지만 마지막에 `createLayoutLine(...)`까지 해서 text까지 materialize한다. ([GitHub][1])

---

## 6. 다섯 함수를 한 흐름으로 다시 묶으면

전체 파이프라인은 사실 아래 한 장으로 정리된다.

```ts
prepare(text, font, options)
    -> prepareInternal(...)
        -> analyzeText(...)
        -> measureAnalysis(...)
            -> prepared parallel arrays 생성

layout(prepared, maxWidth, lineHeight)
    -> countPreparedLines(...)
    -> lineCount, height 반환

layoutWithLines(prepared, maxWidth, lineHeight)
    -> walkPreparedLinesRaw(...)
    -> createLayoutLine(...) 반복
    -> lines[], lineCount, height 반환

layoutNextLineRange(prepared, start, maxWidth)
    -> normalizeLineStart(...)
    -> stepPreparedLineGeometry(...)
    -> line range 1개 반환
```

즉 구조적으로 보면:

* `prepare` 계열은 **compile phase**
* `layout` 계열은 **execution phase**
* 그 중에서도

  * `layout` = count-only
  * `layoutWithLines` = batch materialization
  * `layoutNextLineRange` = incremental stepping
    으로 나뉜다. ([GitHub][1])

---

## 7. 네가 코드 읽을 때 특히 봐야 할 변수 해석

이 5개 함수를 이해할 때 가장 중요한 필드는 아래 6개다.

* `widths`
  각 prepared segment의 기본 폭

* `lineEndFitAdvances`
  줄 끝 판정에 사용할 폭 기여치
  trailing space처럼 줄 끝 fit 계산에서 제외될 수 있음

* `lineEndPaintAdvances`
  실제 그려지는 폭 기준 기여치

* `kinds`
  `text`, `space`, `soft-hyphen`, `tab`, `hard-break` 등 line-break 의미

* `breakableFitAdvances`
  긴 세그먼트를 grapheme 단위로 잘라 넣을 때 쓰는 누적 폭 정보

* `chunks`
  hard-break 기반 큰 구간 힌트로, line walker가 더 효율적으로 탐색하게 해 줌 ([GitHub][2])

---

원하면 다음 답변에서는 이어서 `countPreparedLines`, `walkPreparedLinesRaw`, `stepPreparedLineGeometry`까지 내려가서 **실제 줄바꿈 결정 규칙**을 `line-break.ts` 기준으로 의사코드로 풀어줄게.

[1]: https://github.com/chenglou/pretext/blob/main/src/layout.ts "pretext/src/layout.ts at main · chenglou/pretext · GitHub"
[2]: https://raw.githubusercontent.com/chenglou/pretext/main/src/layout.ts "raw.githubusercontent.com"
