좋다. 그럼 이번에는 `line-break.ts`를 **cursor/chunk 기준 상태 머신**처럼 보이도록 정리하겠다.
핵심은 네가 다음 4개를 머릿속에 같이 잡는 것이다.

* `chunk` : hard break 기준의 큰 구간
* `cursor` : 현재 읽기 위치 `(segmentIndex, graphemeIndex)`
* `line state` : 현재 줄에 무엇이 들어와 있는가
* `pending break` : 넘치면 되돌아갈 수 있는 최근 줄바꿈 후보

즉 이 엔진은 단순히 “배열 순회”가 아니라,
**chunk 안에서 cursor를 움직이며 줄 하나를 만들고, 필요하면 pending break로 rollback한 뒤, 다음 cursor에서 다시 시작하는 상태 머신**이다. ([github.com](https://github.com/chenglou/pretext/blob/main/src/line-break.ts))

---

# 1. 가장 바깥 상태: 왜 `chunk`가 필요한가

`prepare()` 단계에서 `analysis.chunks`가 prepared chunk로 바뀌고, `line-break.ts`는 이를 그대로 받는다.
각 chunk는 대략 이런 의미를 갖는다.

* `startSegmentIndex`
* `endSegmentIndex`
* `consumedEndSegmentIndex`

실제로는 hard break, 빈 줄, chunk boundary를 빠르게 처리하기 위한 힌트다.
즉 긴 텍스트 전체를 무조건 처음부터 끝까지 한 줄 엔진으로 밀지 않고, **강제 줄바꿈 단위의 큰 영역으로 나눠서 순회**한다. ([github.com](https://github.com/chenglou/pretext/blob/main/src/line-break.ts))

상태 머신 관점에서 보면:

```ts id="qdms32"
for each chunk:
    normalize current cursor into this chunk
    while chunk not exhausted:
        build one line
        emit line
        advance cursor
```

즉 줄 엔진의 “세션”은 chunk 단위로 열린다.

---

# 2. `findChunkIndexForStart(...)`: cursor가 어느 chunk에 속하는지 찾기

`layoutNextLineRange()` 같은 streaming API는 사용자가 `(segmentIndex, graphemeIndex)` cursor를 준다.
이때 엔진은 먼저 “이 cursor가 어느 chunk에 속하나”를 알아야 한다. 그 역할이 `findChunkIndexForStart(...)`다. ([github.com](https://github.com/chenglou/pretext/blob/main/src/line-break.ts))

개념적으로는:

1. cursor의 `segmentIndex`를 본다.
2. `chunks` 배열을 순회하거나 인덱스를 좁혀서
3. `startSegmentIndex <= segmentIndex < consumedEndSegmentIndex`인 chunk를 찾는다.
4. 찾지 못하면 더 이상 유효한 줄 시작점이 없으므로 실패한다.

의사코드:

```ts id="ys1xnp"
function findChunkIndexForStart(chunks, cursor):
    s = cursor.segmentIndex

    for chunkIndex in 0..chunks.length-1:
        chunk = chunks[chunkIndex]
        if chunk.startSegmentIndex <= s and s < chunk.consumedEndSegmentIndex:
            return chunkIndex

    return -1
```

실제 구현은 더 세밀한 경계 처리를 포함하지만, 의미상으로는 **cursor를 chunk 세션에 배정하는 단계**다. ([github.com](https://github.com/chenglou/pretext/blob/main/src/line-break.ts))

---

# 3. `normalizeLineStartChunkIndex(...)`: chunk 찾기 + 시작점 정규화

이 함수는 streaming path의 입구다.
역할은 두 개다.

1. `findChunkIndexForStart(...)`로 현재 cursor가 속할 chunk를 찾는다.
2. 찾은 뒤 `normalizeLineStartInChunk(...)`를 호출해서
   “이 cursor를 실제 line-start로 쓸 수 있는 형태”로 보정한다. ([github.com](https://github.com/chenglou/pretext/blob/main/src/line-break.ts))

즉 단순히 “어느 chunk냐”만 정하는 게 아니라,
**현재 cursor가 줄 시작으로 부적절하면 다음 유효 위치로 밀어준다.**

의사코드:

```ts id="gm2n0c"
function normalizeLineStartChunkIndex(prepared, cursor):
    chunkIndex = findChunkIndexForStart(prepared.chunks, cursor)
    if chunkIndex < 0:
        return -1

    return normalizeLineStartInChunk(prepared, chunkIndex, cursor)
```

---

# 4. `normalizeLineStartInChunk(...)`: 애매한 cursor를 실제 줄 시작점으로 바꾸기

이 함수가 꽤 중요하다.
이유는 사용자가 넘긴 `cursor`가 항상 “깨끗한 줄 시작점”이라고 보장할 수 없기 때문이다.

예를 들면:

* 이미 chunk의 소비된 끝을 가리키고 있을 수 있음
* 빈 chunk 안에 있을 수 있음
* soft wrap으로 분할된 세그먼트 중간 `(segmentIndex, graphemeIndex > 0)`일 수 있음
* hard break 직후/직전 경계일 수 있음

이 함수는 그런 상태를 canonical form으로 맞춘다. ([github.com](https://github.com/chenglou/pretext/blob/main/src/line-break.ts))

## 4-1. grapheme 내부면 그대로 유지

가장 명확한 규칙 하나는:

* `cursor.graphemeIndex > 0`이면 이미 세그먼트 내부 분할 상태다.
* 이 경우 현재 세그먼트 중간에서 다음 줄을 이어 읽는 상황이므로,
  대체로 같은 chunk에 남겨둔다.

즉 이 cursor는 이미 정규화된 상태로 본다. ([github.com](https://github.com/chenglou/pretext/blob/main/src/line-break.ts))

의사코드:

```ts id="r9szd7"
if cursor.graphemeIndex > 0:
    return currentChunkIndex
```

---

## 4-2. 빈 chunk면 다음 chunk로 넘길 수 있다

chunk가 비어 있거나, 현재 cursor가 그 chunk의 실질적으로 더 진행할 내용이 없는 위치면,
이 함수는 현재 chunk를 line start로 쓰지 않고 **다음 chunk로 넘긴다**.
코드상 `return chunkIndex + 1` 경로가 있는 이유가 이것이다. ([github.com](https://github.com/chenglou/pretext/blob/main/src/line-break.ts))

이건 상태 머신으로 보면:

* 현재 세션(chunk)은 이미 종료됨
* 줄 하나를 만들 수 없음
* 다음 세션(chunk)으로 이동

이다.

---

## 4-3. hard break / empty line 경계 정리

hard break 때문에 생긴 빈 줄 또는 빈 chunk는 일반 텍스트 줄과 다르게 처리해야 한다.
정규화 단계에서는 cursor를 이런 경계에 맞춰 정리하고, 이후 `emitEmptyChunk()`가 빈 줄을 내도록 준비한다. ([github.com](https://github.com/chenglou/pretext/blob/main/src/line-break.ts))

즉 `normalizeLineStartInChunk()`는 단순 위치 이동이 아니라,
**이 다음 줄이 “빈 줄인지 / 일반 줄인지”를 결정할 수 있게 cursor를 맞춰 주는 준비 단계**다.

---

## 4-4. 정리된 의사코드

```ts id="aq0f8w"
function normalizeLineStartInChunk(prepared, chunkIndex, cursor):
    chunk = prepared.chunks[chunkIndex]

    if cursor.segmentIndex >= chunk.consumedEndSegmentIndex:
        return chunkIndex + 1

    if cursor.graphemeIndex > 0:
        return chunkIndex

    if chunk is empty:
        cursor.segmentIndex = chunk.startSegmentIndex
        cursor.graphemeIndex = 0
        return chunkIndex

    if cursor.segmentIndex < chunk.startSegmentIndex:
        cursor.segmentIndex = chunk.startSegmentIndex
        cursor.graphemeIndex = 0

    return chunkIndex
```

실제 구현은 이것보다 경계 조건이 더 많지만,
의미상으로는 **cursor를 “다음 줄 생성이 가능한 최소 유효 상태”로 정렬하는 함수**다. ([github.com](https://github.com/chenglou/pretext/blob/main/src/line-break.ts))

---

# 5. `emitEmptyChunk(...)`: 빈 줄을 내는 특수 상태

이 helper는 이름 그대로 **내용이 없는 chunk에서 lineCount를 하나 올리고, 필요하면 빈 줄 콜백을 호출**한다.
즉 hard break로 인해 생기는 빈 줄, 혹은 연속 개행 같은 상황을 일반 텍스트 줄과 섞어서 처리하지 않고 별도 helper로 뺀 것이다. ([github.com](https://github.com/chenglou/pretext/blob/main/src/line-break.ts))

개념적으로는:

```ts id="pnf8jf"
function emitEmptyChunk(chunk, onLine):
    lineCount += 1
    if onLine exists:
        onLine(
            width = 0,
            startSegmentIndex = chunk.startSegmentIndex,
            startGraphemeIndex = 0,
            endSegmentIndex = chunk.startSegmentIndex,
            endGraphemeIndex = 0
        )
```

중요한 건, 이 줄은 “문자가 하나도 없어도 실제 줄로 센다”는 점이다.
그래서 텍스트 레이아웃에서 빈 줄 높이가 유지된다. ([github.com](https://github.com/chenglou/pretext/blob/main/src/line-break.ts))

---

# 6. `updatePendingBreakForWholeSegment(...)`: 되돌아갈 후보 지점 기록

이 함수는 줄바꿈 상태 머신의 핵심 중 하나다.
현재 세그먼트를 줄에 성공적으로 넣은 뒤, **이 지점이 legal break opportunity인지**를 보고 pending break를 업데이트한다. ([github.com](https://github.com/chenglou/pretext/blob/main/src/line-break.ts))

pending break가 필요한 이유는 간단하다.

* 지금은 줄에 잘 들어왔더라도
* 다음 세그먼트를 넣는 순간 overflow가 날 수 있다
* 그러면 “가장 최근의 안전한 줄바꿈 지점”으로 되돌아가야 한다

즉 pending break는 **rollback checkpoint**다.

---

## 6-1. 어떤 경우에 pending break가 생기나

대체로 다음 조건들 중 하나면 생긴다.

* 현재 세그먼트 뒤가 일반 break opportunity
* `soft-hyphen`
* `zero-width-break`
* 공백 뒤
* 특정 kind가 줄 끝에 오면 브라우저 규칙상 끊어도 되는 경우

이때 기록하는 것은 단순 인덱스 하나가 아니다.

* `pendingBreakSegmentIndex`
* `pendingBreakGraphemeIndex`
* `pendingBreakFitWidth`
* `pendingBreakPaintWidth`
* `pendingBreakKind`

즉 “어디서 끊을 수 있는가”뿐 아니라
**그 지점에서 줄을 닫을 때 fit width / paint width가 얼마여야 하는가**도 같이 보관한다. ([github.com](https://github.com/chenglou/pretext/blob/main/src/line-break.ts))

---

## 6-2. 왜 `fitWidth`와 `paintWidth`를 같이 저장하나

예를 들어 공백은:

* 줄의 끝에 걸릴 때 fit 계산에서는 제외될 수 있고
* paint 폭도 0처럼 다뤄질 수 있다

soft hyphen은:

* 평소엔 0폭
* 줄을 거기서 끊을 때만 `discretionaryHyphenWidth`가 paint/fit에 반영된다

tab도:

* 저장 폭과 실제 시각적 전개 방식이 다르다

그래서 단순히 “pending break 인덱스만 저장”해서는 줄 종료 폭을 정확히 복원할 수 없다.
이 때문에 breakpoint 상태에 width 정보까지 함께 저장한다. ([github.com](https://github.com/chenglou/pretext/blob/main/src/line-break.ts))

---

## 6-3. 의사코드

```ts id="ly9m6p"
function updatePendingBreakForWholeSegment(kind, breakAfter, segmentIndex, currentWidthState):
    if not breakAfter and kind is not special break kind:
        return

    pendingBreakSegmentIndex = next segment position
    pendingBreakGraphemeIndex = 0
    pendingBreakFitWidth = current line's fit width if break here
    pendingBreakPaintWidth = current line's paint width if break here
    pendingBreakKind = kind
```

실제로는 `soft-hyphen`, `tab`, `space`, `zero-width-break`별로 반영 방식이 조금씩 다르지만,
본질은 “**현재 줄을 여기서 끝낼 수 있도록 완전한 snapshot을 저장**”하는 것이다. ([github.com](https://github.com/chenglou/pretext/blob/main/src/line-break.ts))

---

# 7. 상태 머신으로 다시 보면

이제 이 엔진을 진짜 상태 머신처럼 그려보면 아래와 같다.

## 상태 A. 시작점 정규화

입력: 사용자 cursor
동작:

* chunk 찾기
* cursor 정규화
* 빈 chunk인지 확인

전이:

* 유효 시작점 없음 → 종료
* 빈 chunk → `emitEmptyChunk`
* 일반 chunk → 상태 B

---

## 상태 B. 현재 줄 구성 중

입력:

* 현재 `lineW`
* 현재 `cursor`
* 현재 chunk
* 최근 `pendingBreak`

동작:

* 다음 세그먼트 읽기
* fits면 append
* break opportunity면 pendingBreak 갱신

전이:

* 아직 fits → 상태 B 유지
* overflow → 상태 C

---

## 상태 C. overflow 해결

우선순위:

1. soft hyphen 조기 종료
2. soft hyphen + 다음 세그먼트 일부까지 fitting
3. 현재 세그먼트 끝에서 종료
4. pending break로 rollback
5. breakable segment grapheme 분할
6. 현재 줄 강제 종료

전이:

* 줄 종료 성공 → 상태 D
* 분할 후 계속 현재 줄 → 상태 B

---

## 상태 D. 줄 emit

동작:

* lineCount 증가
* `onLine` 콜백 호출
* end cursor 확정

전이:

* chunk 아직 남음 → 상태 A 또는 B
* chunk 소진 → 다음 chunk
* 전체 종료 → 종료

---

# 8. 전체 상태 머신 의사코드

이제 네가 지금까지 본 helper들을 합쳐서 한 덩어리 의사코드로 쓰면 거의 이렇게 된다.

```ts id="3v7uzl"
function nextLine(prepared, cursor, maxWidth):
    chunkIndex = normalizeLineStartChunkIndex(prepared, cursor)
    if chunkIndex < 0:
        return null

    chunk = prepared.chunks[chunkIndex]

    if chunk is empty:
        return emitEmptyChunk(chunk)

    reset line state
    set lineStart = cursor
    clear pendingBreak

    i = cursor.segmentIndex
    g = cursor.graphemeIndex

    while i < chunk.endSegmentIndex:
        seg = prepared[i]

        if g > 0 or seg is breakable overflow segment:
            try append from grapheme g
        else:
            try append whole segment

        if appended and break opportunity:
            updatePendingBreakForWholeSegment(...)

        if overflow:
            if can finish at soft hyphen:
                finish line there
                return line
            if can fit part of current segment after soft hyphen:
                finish line there
                return line
            if can finish at current segment end:
                finish line there
                return line
            if pendingBreak exists:
                rollback to pendingBreak
                finish line
                return line
            if segment breakable:
                split by grapheme and finish
                return line
            finish current line
            return line

        advance i/g

    if line has content:
        finish line at chunk consumed end
        return line

    return null
```

이 의사코드에서 중요한 건:

* **cursor는 이동한다**
* **pending break는 rollback 포인트다**
* **chunk는 세션 경계다**
* **overflow 해결 우선순위가 고정돼 있다**

는 점이다. ([github.com](https://github.com/chenglou/pretext/blob/main/src/line-break.ts))

---

# 9. 네가 다음에 보면 좋은 포인트

이제 이 파일을 더 읽을 때는 아래 질문을 던지면서 보면 된다.

1. `cursor.segmentIndex`와 `cursor.graphemeIndex`가 언제 같이 움직이고, 언제 하나만 움직이는가?

   * 세그먼트 전체 append vs grapheme 분할 구간을 구분하는 핵심이다.

2. `pendingBreakKind`가 `soft-hyphen`일 때 왜 분기 우선순위가 달라지는가?

   * 일반 공백 break보다 더 정교한 하이픈 처리 때문이다.

3. `chunks[].consumedEndSegmentIndex`와 `endSegmentIndex`의 차이가 어디서 드러나는가?

   * hard break를 소비한 뒤 줄 끝 인덱스를 어디까지 볼 것인지와 연결된다.

4. `emitEmptyChunk()`가 line count에 어떤 영향을 주는가?

   * 빈 줄이 실제 레이아웃 높이에 반영되는 이유다.

원하면 다음 단계로는 `prepare → analysis.ts → measurement.ts → line-break.ts`를 한 번에 엮어서
**“문자열 1개가 segment/chunk/width 배열로 변하고, 마지막에 line range로 환원되는 전체 데이터 파이프라인”**을 도식처럼 정리해줄게.
