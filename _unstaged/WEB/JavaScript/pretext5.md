좋다. 그럼 이제 `pretext` 전체를 **입력 문자열 1개가 최종 line range/line text로 바뀌는 파이프라인**으로 묶어서 정리하겠다.

이번 답변의 목표는 단순 함수 설명이 아니라,
아래 흐름을 한 번에 머리에 들어오게 만드는 것이다.

```text
raw text
→ analysis.ts
→ measurement.ts
→ layout.ts prepare
→ prepared arrays
→ line-break.ts
→ line ranges / line texts / height
```

즉 네가 이제부터 코드를 볼 때는 각 파일을 따로 보지 말고,
**“문자열이 어떤 중간표현으로 바뀌고, 그 중간표현을 line-break 엔진이 어떻게 소비하는가”**로 보면 된다.

---

# 1. 전체 구조 한 장 요약

`pretext`는 크게 4단계다.

1. **analysis.ts**

   * 문자열 정규화
   * whitespace 처리
   * segment 분해
   * chunk 분해
   * segment kind 판정

2. **measurement.ts**

   * 각 segment 폭 측정
   * emoji correction
   * 브라우저 엔진별 보정
   * breakable grapheme advances 계산

3. **layout.ts**

   * 분석 + 측정 결과를 prepared 구조로 조립
   * 공개 API로 감춤
   * `prepare`, `layout`, `layoutWithLines`, `layoutNextLineRange` 제공

4. **line-break.ts**

   * prepared 배열을 읽어 실제 줄바꿈 수행
   * line count / line range / line text 생성의 기반 엔진

이 구조는 실제 export 관계와 함수 호출 순서 그대로다. ([github.com](https://github.com/chenglou/pretext/blob/main/src/layout.ts), [github.com](https://github.com/chenglou/pretext/blob/main/src/analysis.ts), [github.com](https://github.com/chenglou/pretext/blob/main/src/measurement.ts), [github.com](https://github.com/chenglou/pretext/blob/main/src/line-break.ts))

---

# 2. Stage 1 — `analysis.ts`: 문자열을 “의미 있는 segment들”로 해체

이 단계의 입력은 그냥 raw text다.

예를 들면 대충 이런 문자열이 들어온다고 하자.

```text
"Hello   world-\n안녕하세요\t1234"
```

analysis 단계는 이 문자열을 곧바로 폭 측정하지 않는다.
먼저 “줄바꿈과 폭 계산에 의미가 있는 단위”로 잘게 나눈다.

## 2-1. 먼저 whitespace 정규화

`white-space: normal`이면:

* 연속 공백 collapse
* 줄바꿈은 일반 공백처럼 처리되거나 제거
* 탭도 정규화

`white-space: pre-wrap`이면:

* 공백 보존
* hard break 보존
* 줄바꿈 문자를 실제 개행 단위로 유지

즉 브라우저 CSS와 비슷한 whitespace model을 먼저 적용한다.
이 결과가 `analysis.normalized`다. ([github.com](https://github.com/chenglou/pretext/blob/main/src/analysis.ts))

---

## 2-2. 그 다음 segment 분해

정규화된 문자열을 아래 kind들로 나눈다.

* `text`
* `space`
* `preserved-space`
* `tab`
* `glue`
* `zero-width-break`
* `soft-hyphen`
* `hard-break`

즉 segment는 단순 substring이 아니라,
**“이 조각이 줄 끝에서 어떤 의미를 가지는가”까지 포함한 토큰**이다. ([github.com](https://github.com/chenglou/pretext/blob/main/src/analysis.ts))

예를 들어:

```text
"Hello world"
```

는 대충 이런 구조가 된다.

```text
[text("Hello"), space(" "), text("world")]
```

그리고

```text
"foo-\nbar"
```

같은 건 내부적으로 단순 문자 나열이 아니라
`hard-break` 경계를 가진 두 chunk 후보로 분해될 수 있다.

---

## 2-3. 국제화 단위 판정

이 단계에서 이미 언어 관련 규칙도 반영된다.

* `Intl.Segmenter`
* CJK 여부
* keep-all 규칙
* closing quote 접착
* 숫자 run 판정
* URL-like run 처리

즉 “어디서 줄바꿈 후보를 만들 수 있을지”를 미리 결정하는 준비가 analysis에서 시작된다.
이건 line-break 단계에서 갑자기 판단하는 게 아니다. ([github.com](https://github.com/chenglou/pretext/blob/main/src/analysis.ts))

---

## 2-4. chunk 생성

analysis는 segment만 만드는 게 아니라 chunk도 만든다.
chunk는 대체로 hard break 기반의 큰 구간이다.

즉 텍스트 전체를 하나의 line walk 세션으로 보지 않고:

```text
chunk 1 | hard break | chunk 2 | hard break | chunk 3
```

식으로 미리 나눈다.

이 chunk는 나중에 `line-break.ts`가

* 빈 줄 처리
* hard break 처리
* streaming cursor 정규화

를 더 쉽게 하게 해 준다. ([github.com](https://github.com/chenglou/pretext/blob/main/src/analysis.ts))

---

## 2-5. analysis 단계 출력

이 단계가 끝나면 대략 이런 구조를 가진 `TextAnalysis`가 나온다.

```ts id="le2g0x"
TextAnalysis {
  normalized: "...",
  segments: [...],
  kinds: [...],
  starts: [...],
  wordLikeFlags: [...],
  chunks: [...]
}
```

실제 필드 이름은 조금 다를 수 있지만, 의미는 이렇다.

즉 이 단계의 핵심 결과는:

* 문자열이 어떤 segment들로 나뉘는지
* 각 segment가 어떤 kind인지
* 원문 어느 위치에서 시작했는지
* 어느 부분이 breakable candidate인지
* hard break 기준 큰 경계가 어디인지

를 만든 것이다.

---

# 3. Stage 2 — `measurement.ts`: segment를 숫자 데이터로 바꿈

analysis가 “의미 토큰화”였다면, measurement는 그 토큰을 **숫자 폭 정보로 환원**하는 단계다.

## 3-1. 폰트별 측정 캐시 확보

먼저 폰트에 대한 canvas measurement cache를 가져온다.

* `getSegmentMetricCache(font)`
* `getFontMeasurementState(font, needsEmojiCorrection)`

즉 같은 폰트, 같은 segment는 다시 측정하지 않으려 한다. ([github.com](https://github.com/chenglou/pretext/blob/main/src/measurement.ts))

---

## 3-2. 각 segment 폭 측정

텍스트 세그먼트는 `ctx.measureText(seg).width`로 폭을 잰다.

하지만 이 값을 그대로 쓰지 않고:

* emoji correction
* 브라우저 엔진 profile
* CJK 관련 보정

등을 적용한다. ([github.com](https://github.com/chenglou/pretext/blob/main/src/measurement.ts))

즉 이 단계의 출력은 “원시 width”가 아니라
**브라우저 동작에 더 가까운 corrected width**다.

---

## 3-3. 특수폭 계산

이 단계에서 추가로 잡는 폭들:

* `" "`의 폭 → `spaceWidth`
* `"-"`의 폭 → `discretionaryHyphenWidth`
* 탭 폭 → `tabStopAdvance = spaceWidth * 8`

즉 일반 텍스트뿐 아니라 line-break 시점에 필요한 특수폭 상수도 같이 준비한다. ([github.com](https://github.com/chenglou/pretext/blob/main/src/layout.ts), [github.com](https://github.com/chenglou/pretext/blob/main/src/measurement.ts))

---

## 3-4. breakable grapheme advances 계산

이게 매우 중요하다.

긴 단어가 있으면 세그먼트 전체 폭만 알아서는 부족하다.
왜냐하면 overflow 시 세그먼트 내부에서 몇 grapheme까지 들어갈 수 있는지 알아야 하기 때문이다.

그래서 `getSegmentBreakableFitAdvances(...)`로:

```text
segment = "example"
fitAdvances = [e 폭, ex 폭, exa 폭, ...] 또는 grapheme 단위 누적 정보
```

를 만들어 둔다. ([github.com](https://github.com/chenglou/pretext/blob/main/src/measurement.ts))

즉 measurement 단계는 폭만 재는 게 아니라
**나중에 단어를 내부 분할할 수 있게 준비하는 단계**다.

---

# 4. Stage 3 — `layout.ts prepare`: 분석 결과와 폭 정보를 prepared 배열로 조립

이제 analysis와 measurement 결과를 합쳐서 `PreparedText`를 만든다.

## 4-1. `prepare()`는 결국 `prepareInternal() → analyzeText() → measureAnalysis()`

흐름은 이렇다.

```ts id="3bc9q5"
prepare(text, font, options)
  -> prepareInternal(text, font, includeSegments=false, options)
      -> analyzeText(...)
      -> measureAnalysis(...)
      -> PreparedText 반환
```

`prepareWithSegments()`는 `includeSegments=true`일 뿐이다. ([github.com](https://github.com/chenglou/pretext/blob/main/src/layout.ts))

---

## 4-2. prepared 구조의 핵심 병렬 배열

`measureAnalysis()`가 최종적으로 만드는 핵심은 이 병렬 배열들이다.

* `widths`
* `lineEndFitAdvances`
* `lineEndPaintAdvances`
* `kinds`
* `breakableFitAdvances`
* `chunks`

rich path일 경우 추가:

* `segments`
* `segStarts`
* `segLevels`

즉 문자열은 이제 더 이상 “문자열”로 취급되지 않는다.
`line-break.ts` 입장에서는 이 숫자/분류 배열 묶음이 진짜 입력이다. ([github.com](https://github.com/chenglou/pretext/blob/main/src/layout.ts))

---

## 4-3. 왜 `lineEndFitAdvances`와 `lineEndPaintAdvances`를 따로 갖는가

이건 prepared 단계에서 매우 중요한 설계다.

예를 들어 trailing space는:

* 줄 끝 fit 계산에서는 제외될 수 있음
* 실제 paint 폭도 별도 처리 가능

soft hyphen은:

* 평소엔 0폭
* 그 지점에서 줄을 끊을 때만 하이픈 폭이 생김

그래서 단순 `widths` 하나만으로는 줄 끝 판정을 정확히 할 수 없다.
이 때문에 prepared 구조가 이미 “줄 끝에서의 의미”를 내장한 폭 배열들을 만든다. ([github.com](https://github.com/chenglou/pretext/blob/main/src/layout.ts))

---

## 4-4. prepared는 사실 line-break용 bytecode 같은 것

비유하면:

* raw text = 소스코드
* analysis = 파싱
* measurement = 상수 계산
* prepared arrays = intermediate bytecode
* line-break.ts = VM 실행기

이 비유가 꽤 정확하다.

왜냐하면 `line-break.ts`는 원문 문자열을 거의 보지 않고,
prepared 배열만 읽으며 줄바꿈 결정을 내리기 때문이다. ([github.com](https://github.com/chenglou/pretext/blob/main/src/layout.ts), [github.com](https://github.com/chenglou/pretext/blob/main/src/line-break.ts))

---

# 5. Stage 4 — `line-break.ts`: prepared 배열을 소비해 실제 줄을 만든다

이 단계부터는 “텍스트 의미 분석”이 아니라 **폭 제한 하에서 최적의 줄 종료점 찾기**가 핵심이다.

## 5-1. 입력

line-break 엔진의 실질 입력은:

```ts id="g8frka"
{
  widths,
  lineEndFitAdvances,
  lineEndPaintAdvances,
  kinds,
  breakableFitAdvances,
  discretionaryHyphenWidth,
  tabStopAdvance,
  chunks
}
```

즉 text string이 아니라 prepared numeric model이다. ([github.com](https://github.com/chenglou/pretext/blob/main/src/line-break.ts))

---

## 5-2. 먼저 fast path / full path를 고른다

* 특수 kind 거의 없고 단순한 경우 → `walkPreparedLinesSimple`
* soft-hyphen, tab, preserved-space, chunk 처리 필요 → full path

즉 입력 prepared의 성질에 따라 다른 line walker를 쓴다. ([github.com](https://github.com/chenglou/pretext/blob/main/src/line-break.ts))

---

## 5-3. line-break 엔진의 내부 상태

한 줄을 만드는 동안 들고 가는 상태는 대략 이렇다.

* 현재 line width
* 현재 line start cursor
* 현재 line end cursor
* 최근 pending break
* 현재 chunk 위치

즉 line walker는 **prepared 배열 위를 이동하는 cursor machine**이다. ([github.com](https://github.com/chenglou/pretext/blob/main/src/line-break.ts))

---

## 5-4. 줄 생성 규칙

새 세그먼트를 볼 때 기본 규칙은:

1. 들어가면 append
2. break opportunity면 pending break 갱신
3. overflow 나면 우선순위대로 해결

   * soft hyphen
   * 현재 세그먼트 끝
   * 이전 pending break rollback
   * grapheme 단위 분할
   * 강제 종료

이 규칙은 전체 batch path와 streaming path 모두 동일하다. ([github.com](https://github.com/chenglou/pretext/blob/main/src/line-break.ts))

---

## 5-5. 출력은 결국 “line range”

가장 근본적인 출력은 문자열이 아니라 line range다.

예:

```ts id="90ql52"
{
  startSegmentIndex,
  startGraphemeIndex,
  endSegmentIndex,
  endGraphemeIndex,
  width
}
```

즉 line-break 엔진은 먼저 **범위**를 결정한다.
문자열 materialization은 나중 문제다. ([github.com](https://github.com/chenglou/pretext/blob/main/src/layout.ts), [github.com](https://github.com/chenglou/pretext/blob/main/src/line-break.ts))

---

# 6. Stage 5 — 최종 API별 출력 형태

여기서부터는 같은 line-break 결과를 어떤 형태로 사용자에게 돌려주느냐의 차이다.

## 6-1. `layout(prepared, maxWidth, lineHeight)`

* `countPreparedLines(...)`
* 결과: `{ lineCount, height }`

즉 범위도 문자열도 안 만든다.
가장 가벼운 API다. ([github.com](https://github.com/chenglou/pretext/blob/main/src/layout.ts))

---

## 6-2. `layoutWithLines(...)`

* `walkPreparedLinesRaw(...)`
* 각 줄마다 `createLayoutLine(...)`
* `buildLineTextFromRange(...)`로 실제 텍스트 materialize

결과:

```ts id="m1psex"
{
  lineCount,
  height,
  lines: [
    {
      text,
      width,
      start: { segmentIndex, graphemeIndex },
      end: { segmentIndex, graphemeIndex }
    }
  ]
}
```

즉 line range를 사람이 쓰기 좋은 line text 객체로 변환한 것이다. ([github.com](https://github.com/chenglou/pretext/blob/main/src/layout.ts))

---

## 6-3. `layoutNextLineRange(...)`

* cursor 1개 입력
* 다음 한 줄 range만 출력
* 내부적으로 end cursor를 계산

즉 virtualized / incremental / custom renderer용이다. ([github.com](https://github.com/chenglou/pretext/blob/main/src/layout.ts), [github.com](https://github.com/chenglou/pretext/blob/main/src/line-break.ts))

---

## 6-4. `layoutNextLine(...)`

* `layoutNextLineRange(...)`의 결과에
* `createLayoutLine(...)`를 적용해
* text까지 materialize

즉 streaming + materialization 버전이다. ([github.com](https://github.com/chenglou/pretext/blob/main/src/layout.ts))

---

# 7. 전체 데이터 파이프라인 의사코드

이제 전체를 하나의 의사코드로 쓰면 거의 이렇게 된다.

```ts id="s2qktp"
function userCallsLayoutSystem(text, font, options, maxWidth, lineHeight):
    // 1) analysis
    analysis = analyzeText(
        text,
        engineProfile,
        options.whiteSpace,
        options.wordBreak
    )

    // 2) measurement + prepare
    prepared = measureAnalysis(
        analysis,
        font,
        includeSegments = false,
        options.wordBreak
    )

    // prepared 내부:
    // widths, kinds, lineEndFitAdvances, lineEndPaintAdvances,
    // breakableFitAdvances, chunks ...

    // 3) line-break execution
    lineCount = countPreparedLines(prepared, maxWidth)

    // 4) public result
    return {
        lineCount,
        height: lineCount * lineHeight
    }
```

그리고 `layoutWithLines()`까지 포함하면:

```ts id="jlwm2j"
function userCallsLayoutWithLines(text, font, options, maxWidth, lineHeight):
    analysis = analyzeText(...)
    prepared = measureAnalysis(...)

    lines = []
    walkPreparedLinesRaw(prepared, maxWidth, (width, sSeg, sG, eSeg, eG) => {
        text = buildLineTextFromRange(prepared, sSeg, sG, eSeg, eG)
        lines.push({
            text,
            width,
            start: { segmentIndex: sSeg, graphemeIndex: sG },
            end: { segmentIndex: eSeg, graphemeIndex: eG }
        })
    })

    return {
        lineCount: lines.length,
        height: lines.length * lineHeight,
        lines
    }
```

---

# 8. 예시로 보는 흐름

예를 들어 문자열이:

```text
"Hello world example"
```

이고 폭이 작아서 두 줄이 된다고 하자.

## 8-1. analysis

```text
[text("Hello"), space(" "), text("world"), space(" "), text("example")]
```

---

## 8-2. measurement / prepare

```text
widths = [wHello, wSpace, wWorld, wSpace, wExample]
kinds  = [text,  space,  text,   space,  text]
lineEndFitAdvances = [wHello, 0, wWorld, 0, wExample]
lineEndPaintAdvances = [wHello, 0, wWorld, 0, wExample]
breakableFitAdvances[4] = [e, ex, exa, ...] // example이 길다면
chunks = [0..5]
```

---

## 8-3. line-break

폭이 `Hello world`까지만 들어가면:

* `Hello` append
* `space` append, pending break 업데이트
* `world` append
* 다음 `space` append, pending break 업데이트
* `example` 넣으려니 overflow
* 가장 최근 pending break(두 번째 space 뒤)로 rollback
* 1줄 종료

다음 줄은 `example`부터 시작. ([github.com](https://github.com/chenglou/pretext/blob/main/src/line-break.ts))

---

## 8-4. 최종 결과

```text
line 1: "Hello world"
line 2: "example"
```

또는 `layout()`만 썼다면:

```text
lineCount = 2
height = 2 * lineHeight
```

---

# 9. 설계상 가장 중요한 통찰 3개

## 9-1. 문자열은 early phase 이후 거의 사라진다

analysis 이후부터 핵심 입력은 raw text가 아니라 segment/kind/start/chunk 구조다.
measurement 이후에는 거의 숫자 배열 중심으로 바뀐다.

즉 후반부 엔진은 “텍스트 처리”라기보다
**structured numeric layout execution**에 가깝다. ([github.com](https://github.com/chenglou/pretext/blob/main/src/layout.ts))

---

## 9-2. 줄바꿈 정확도는 line-break.ts만의 공이 아니다

정확한 줄바꿈은:

* analysis의 올바른 segment 분해
* measurement의 올바른 corrected width
* prepare의 올바른 line-end advance 구성
* line-break의 올바른 pending break 처리

가 다 맞아야 성립한다.

즉 `line-break.ts`만 뜯어봐서는 전체 정확도를 설명할 수 없다. ([github.com](https://github.com/chenglou/pretext/blob/main/src/analysis.ts), [github.com](https://github.com/chenglou/pretext/blob/main/src/measurement.ts), [github.com](https://github.com/chenglou/pretext/blob/main/src/layout.ts), [github.com](https://github.com/chenglou/pretext/blob/main/src/line-break.ts))

---

## 9-3. `prepare`와 `layout` 분리는 성능 최적화의 핵심이다

문자열 분석과 폭 측정은 비싸다.
줄 개수 계산은 상대적으로 싸다.

그래서 `pretext`는:

* 텍스트/폰트 바뀔 때만 `prepare`
* width만 바뀔 때는 `layout` 재실행

구조로 설계되어 있다.
이게 resize hot path에 유리하다. ([github.com](https://github.com/chenglou/pretext/blob/main/README.md), [github.com](https://github.com/chenglou/pretext/blob/main/src/layout.ts))

---

# 10. 네가 지금 시점에서 이 라이브러리를 한 문장으로 요약하면

`pretext`는
**문자열을 segment/chunk/width 기반 intermediate representation으로 컴파일한 뒤, 그 표현을 line-break 엔진이 재사용 가능한 방식으로 실행하여 높이·줄 범위·줄 문자열을 빠르게 계산하는 텍스트 레이아웃 라이브러리**다. ([github.com](https://github.com/chenglou/pretext/blob/main/src/layout.ts))

---

원하면 다음에는 이걸 바탕으로
`pretext`의 **파일별 책임 분리 평가**, **설계 장단점**, **리팩터링 포인트**, **다른 텍스트 레이아웃 방식(DOM 측정, canvas naive wrapping)과 비교**까지 이어서 분석해줄 수 있다.
