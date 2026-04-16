좋다. 여기서는 `line-break.ts` 기준으로 **실제 줄바꿈 엔진이 어떤 규칙으로 한 줄을 끝내는지**를 보겠다. 결론부터 말하면:

* `countPreparedLines()`는 직접 줄 수만 세는 함수가 아니라 `walkPreparedLinesRaw()`를 그대로 호출하는 얇은 래퍼다. ([GitHub][1])
* `walkPreparedLinesRaw()`는

  * `simpleLineWalkFastPath === true`면 `walkPreparedLinesSimple()`로 빠지고,
  * 아니면 `soft-hyphen`, `tab`, `chunk`를 고려하는 full path를 돈다. ([GitHub][1])
* `layoutNextLineRange()`는 전체 줄 배열을 만들지 않고, `normalizeLineStartChunkIndex()`로 시작점을 정규화한 다음 “한 줄만 계산해서 end cursor를 앞으로 이동”시키는 streaming 버전이다. ([GitHub][1])

아래부터는 네가 요청한 3개를 실제 줄바꿈 결정 규칙 중심으로 풀어준다.

---

# 1. `countPreparedLines(prepared, maxWidth)`

이 함수 자체는 로직이 없다.

```ts
export function countPreparedLines(prepared, maxWidth) {
  return walkPreparedLinesRaw(prepared, maxWidth)
}
```

즉 줄 개수 계산과 실제 줄 워킹 로직은 완전히 동일하고, 단지 `onLine` 콜백을 넘기지 않아서 **라인을 materialize하지 않고 count만 얻는 구조**다. 그래서 `layout()` hot path가 별도 규칙을 가지는 게 아니라, 같은 줄바꿈 엔진을 공유한다고 보는 게 맞다. ([GitHub][1])

의사코드는 그냥 이 정도다.

```ts
function countPreparedLines(prepared, maxWidth):
    return walkPreparedLinesRaw(prepared, maxWidth, onLine = undefined)
```

---

# 2. `walkPreparedLinesRaw(prepared, maxWidth, onLine?)`

이게 본체다.

## 2-1. 진입 분기

맨 앞에서 fast path 여부를 본다.

* `prepared.simpleLineWalkFastPath`가 true면 `walkPreparedLinesSimple(...)`
* 아니면 full path 실행

그리고 full path는 `widths`, `lineEndFitAdvances`, `lineEndPaintAdvances`, `kinds`, `breakableFitAdvances`, `discretionaryHyphenWidth`, `tabStopAdvance`, `chunks`를 사용한다. 빈 입력이거나 chunk가 없으면 0을 반환한다. ([GitHub][1])

의사코드:

```ts
function walkPreparedLinesRaw(prepared, maxWidth, onLine):
    if prepared.simpleLineWalkFastPath:
        return walkPreparedLinesSimple(prepared, maxWidth, onLine)

    unpack widths, lineEndFitAdvances, lineEndPaintAdvances,
           kinds, breakableFitAdvances,
           discretionaryHyphenWidth, tabStopAdvance, chunks

    if widths.length == 0 or chunks.length == 0:
        return 0

    ...full path 실행...
```

---

## 2-2. 엔진이 들고 가는 상태값

full path는 대략 이런 상태를 유지한다.

* `lineW`: 현재 줄에 누적된 width
* `hasContent`: 현재 줄이 비어 있는지
* `lineStartSegmentIndex`, `lineStartGraphemeIndex`
* `lineEndSegmentIndex`, `lineEndGraphemeIndex`
* `pendingBreakSegmentIndex`
* `pendingBreakFitWidth`
* `pendingBreakPaintWidth`
* `pendingBreakKind`
* `fitLimit = maxWidth + lineFitEpsilon`

즉 현재 줄의 실제 진행 상태와, “필요하면 여기서 줄을 끊을 수 있다”는 **가장 최근의 break 후보점**을 따로 들고 가는 구조다. `lineFitEpsilon`은 엔진 프로필에서 가져온다. ([GitHub][1])

핵심 helper는 `emitCurrentLine(...)`, `startLineAtSegment(...)`, `appendWholeSegment(...)`, `updatePendingBreakForWholeSegment(...)`, `appendBreakableSegmentFrom(...)`, `continueSoftHyphenBreakableSegment(...)`다. `emitCurrentLine()`은 line count를 늘리고 콜백을 호출한 뒤 상태를 리셋한다. `appendWholeSegment()`는 세그먼트 하나를 줄 끝까지 넣는다. `updatePendingBreakForWholeSegment()`는 줄을 끊을 수 있는 후보 지점을 기록한다. ([GitHub][1])

---

## 2-3. fast path: `walkPreparedLinesSimple(...)`

simple path는 `text`, `space`, `zero-width-break` 정도만 있다고 가정하는 가벼운 버전이다. 그래도 줄바꿈의 큰 원리는 full path와 같다.

핵심 흐름은:

1. 현재 줄이 비었으면 세그먼트를 그냥 시작점으로 넣는다.
2. `newW = lineW + w`가 `fitLimit`을 넘지 않으면 그대로 append.
3. 넘치면 아래 우선순위로 처리:

   * 현재 세그먼트 자체 뒤에서 끊는 것이 가능하고 그 지점이 폭 안이면 그 자리에서 줄 종료
   * 아니면 이전에 저장한 `pendingBreakSegmentIndex`로 되돌아가 줄 종료
   * 아니면 현재 세그먼트가 `breakableFitAdvances`를 가진 긴 단어면 grapheme 단위로 쪼개서 넣기
   * 그것도 안 되면 현재 줄을 먼저 emit하고 다시 시도
4. 루프가 끝났는데 줄에 내용이 있으면 마지막 줄 emit. ([GitHub][1])

의사코드:

```ts
function walkPreparedLinesSimple(prepared, maxWidth, onLine):
    init line state
    for i in 0..widths.length-1:
        w = widths[i]
        breakAfter = 세그먼트 뒤가 break opportunity 인지

        if !hasContent:
            if w > maxWidth and breakableFitAdvances[i] != null:
                appendBreakableSegmentFrom(i, 0)
            else:
                startLineAtSegment(i, w)
            if breakAfter:
                pendingBreak = after i
            continue

        newW = lineW + w
        if newW > fitLimit:
            if breakAfter and current segment까지 넣고 끊어도 fit:
                appendWholeSegment(i, w)
                emitCurrentLine(i + 1, 0, currentBreakPaintWidth)
                continue

            if pendingBreak exists:
                emitCurrentLine(pendingBreakSegmentIndex, 0, pendingBreakPaintWidth)
                continue

            if w > maxWidth and breakableFitAdvances[i] != null:
                emitCurrentLine()
                appendBreakableSegmentFrom(i, 0)
                i++
                continue

            emitCurrentLine()
            continue

        appendWholeSegment(i, w)
        if breakAfter:
            pendingBreak = after i

    if hasContent:
        emitCurrentLine()

    return lineCount
```

이 simple path의 핵심은 **“넘치면 가장 최근 break 후보로 되돌아간다”**는 점이다. 워드 프로세서의 일반적인 line breaking과 같은 형태다. ([GitHub][1])

---

## 2-4. full path: chunk 단위 순회

full path는 `chunks`를 기준으로 바깥 루프를 돈다. chunk는 hard break 기준으로 나뉜 큰 구간으로 이해하면 된다. chunk가 비어 있으면 `emitEmptyChunk()`로 빈 줄 하나를 낸다. chunk 내부에서는 `i = chunk.startSegmentIndex`부터 `chunk.endSegmentIndex` 전까지 세그먼트를 순회한다. 루프가 끝난 뒤 줄에 내용이 남아 있으면 마지막 줄을 `chunk.consumedEndSegmentIndex`까지로 emit한다. ([GitHub][1])

즉 구조는:

```ts
for each chunk:
    if empty chunk:
        emitEmptyChunk()
        continue

    reset line state for this chunk
    for each segment i in chunk:
        ...세그먼트별 줄바꿈 결정...
    if hasContent:
        emitCurrentLine(chunk.consumedEndSegmentIndex, 0, finalPaintWidth)
```

---

## 2-5. 세그먼트가 줄 안에 들어갈 때

full path에서도 기본은 simple path와 같다.

* 현재 줄이 비었으면

  * 세그먼트 폭이 너무 크고 `breakableFitAdvances[i]`가 있으면 `appendBreakableSegmentFrom(i, 0)`
  * 아니면 `startLineAtSegment(i, w)`
* 이후 `updatePendingBreakForWholeSegment(kind, breakAfter, i, w)`로 break 후보를 갱신한다. ([GitHub][1])

즉 줄이 비어 있는 상황에서는 “무조건 최소 1개 세그먼트는 넣거나, 못 넣으면 grapheme 단위로라도 쪼개서 넣는다”는 정책이다. 이게 줄 길이가 매우 짧을 때도 무한 루프에 빠지지 않게 한다. ([GitHub][1])

---

## 2-6. 세그먼트가 overflow를 일으킬 때의 우선순위

이 부분이 실제 규칙의 핵심이다. `newW > fitLimit`이면 full path는 다음 순서로 판단한다.

### 1) soft hyphen을 먼저 끊을지

현재 pending break가 `soft-hyphen`이고, 엔진 프로필이 `preferEarlySoftHyphenBreak`를 켜고 있으며, 그 pending break 폭이 들어가면 바로 거기서 줄을 끝낸다. ([GitHub][1])

### 2) soft hyphen 뒤 세그먼트를 이어서 일부까지 넣을 수 있는지

`pendingBreakKind === 'soft-hyphen'`이면 `continueSoftHyphenBreakableSegment(i)`를 시도한다. 이 helper는 `fitSoftHyphenBreak(...)`를 이용해서 현재 세그먼트의 grapheme 단위 누적 폭을 보며, 하이픈까지 포함한 상태로 몇 글자까지 들어가는지 계산한다.

* 전부 다 들어가면 그냥 현재 줄에 다 넣고 끝
* 일부만 들어가면 `fittedWidth + discretionaryHyphenWidth`로 줄을 종료하고, 남은 grapheme은 다음 줄에서 이어서 처리한다. ([GitHub][1])

### 3) 현재 세그먼트 뒤에서 끊을 수 있는지

`breakAfter`이고 현재 세그먼트까지 넣은 뒤의 fit width가 허용되면, 현재 세그먼트까지 포함해서 줄을 끝낸다. 이때 paint width는 `currentBreakPaintWidth`를 쓴다. `tab`은 fit 계산에서는 0으로 다루지만 paint에서는 폭을 반영하는 식의 분리가 들어간다. ([GitHub][1])

### 4) 이전 pending break로 되돌아갈 수 있는지

위가 안 되면 가장 최근 `pendingBreakSegmentIndex`를 사용한다. 즉 현재 세그먼트를 이번 줄에 포함하지 않고, 이전 break opportunity에서 줄을 닫는다. ([GitHub][1])

### 5) 현재 세그먼트가 긴 breakable run인지

현재 세그먼트 자체가 `breakableFitAdvances`를 가진 긴 세그먼트면, 줄을 emit한 뒤 `appendBreakableSegmentFrom(i, 0)`으로 그 세그먼트를 grapheme 단위 분할해서 새 줄에 집어넣는다. ([GitHub][1])

### 6) 아무 것도 안 되면 현재 줄만 끊고 다음 줄에서 다시 본다

즉 overflow가 났고 안전한 끊는점도 없으면 줄을 먼저 닫고 같은 세그먼트를 새 줄에서 다시 처리한다. ([GitHub][1])

이 우선순위를 의사코드로 쓰면:

```ts
if newW > fitLimit:
    if pendingBreakKind == soft-hyphen
       and preferEarlySoftHyphenBreak
       and pendingBreakFitWidth <= fitLimit:
        emit at pending soft hyphen
        continue

    if pendingBreakKind == soft-hyphen
       and continueSoftHyphenBreakableSegment(i):
        i++
        continue

    if breakAfter and currentBreakFitWidth <= fitLimit:
        appendWholeSegment(i, w)
        emit at current segment end
        i++
        continue

    if pendingBreak exists:
        emit at pendingBreak
        continue

    if w > maxWidth and breakableFitAdvances[i] != null:
        emitCurrentLine()
        appendBreakableSegmentFrom(i, 0)
        i++
        continue

    emitCurrentLine()
    continue
```

이게 사실상 이 엔진의 줄바꿈 정책 그 자체다. ([GitHub][1])

---

## 2-7. `appendBreakableSegmentFrom(...)`가 하는 일

이 helper는 긴 세그먼트를 grapheme 단위로 넣는다. `fitAdvances`를 보고 grapheme마다:

* 줄이 비었으면 현재 grapheme으로 시작
* 넣으면 넘치면 먼저 줄 emit 후 그 grapheme으로 새 줄 시작
* 아니면 그냥 `lineW += gw`

를 반복한다. 끝까지 다 들어가면 `lineEndSegmentIndex = segmentIndex + 1`, `lineEndGraphemeIndex = 0`으로 정상 세그먼트 종료를 표시한다. 즉 `segmentIndex는 같고 graphemeIndex만 변하는 내부 상태`를 유지하다가 마지막에만 segment 단위 종료로 승격된다. ([GitHub][1])

의사코드:

```ts
function appendBreakableSegmentFrom(segmentIndex, startGraphemeIndex):
    fitAdvances = breakableFitAdvances[segmentIndex]
    for g from startGraphemeIndex to fitAdvances.length-1:
        gw = fitAdvances[g]
        if !hasContent:
            startLineAtGrapheme(segmentIndex, g, gw)
        else if lineW + gw > fitLimit:
            emitCurrentLine()
            startLineAtGrapheme(segmentIndex, g, gw)
        else:
            lineW += gw
            lineEndSegmentIndex = segmentIndex
            lineEndGraphemeIndex = g + 1

    if ended exactly at segment end:
        lineEndSegmentIndex = segmentIndex + 1
        lineEndGraphemeIndex = 0
```

즉 긴 단어 overflow 처리도 “문자 하나씩 잘라보는 임시 처리”가 아니라, prepare 단계에서 만들어 둔 `breakableFitAdvances`를 정식으로 사용하는 방식이다. ([GitHub][1])

---

## 2-8. `fitSoftHyphenBreak(...)` / `continueSoftHyphenBreakableSegment(...)`

soft hyphen은 별도 우대 규칙이 있다. `fitSoftHyphenBreak(...)`는 grapheme 누적 폭을 보면서, **중간에서 끊기면 하이픈 폭까지 포함했을 때 fit하는지**를 계산한다. 마지막 grapheme까지 다 들어가면 하이픈을 더하지 않고, 중간에서 끊길 때만 `discretionaryHyphenWidth`를 더한다. ([GitHub][1])

그 위에 `continueSoftHyphenBreakableSegment(...)`는:

* pending break가 soft hyphen인지 확인
* 현재 세그먼트가 grapheme 분할 가능한지 확인
* `fitSoftHyphenBreak(...)`로 몇 grapheme까지 넣을 수 있는지 계산
* 0개면 실패
* 전부 다 들어가면 그냥 현재 줄에 포함
* 일부만 들어가면 하이픈을 더해 줄 종료하고, 이어서 남은 부분은 다음 줄로 넘김

을 수행한다. ([GitHub][1])

이건 일반 공백 break보다 더 정교하다. 즉 soft hyphen이 걸린 단어는 “하이픈 지점에서 끊고, 다음 세그먼트 일부까지 같은 줄에 밀어 넣을 수 있으면 그렇게 한다”는 쪽으로 동작한다. ([GitHub][1])

---

# 3. `layoutNextLineRange(prepared, start, maxWidth)`

이 함수는 전체 줄을 다 돌지 않고 **주어진 cursor에서 다음 한 줄만** 계산한다. 시작부는 분명하다.

1. `end`를 `start` 복사본으로 만듦
2. `chunkIndex = normalizeLineStartChunkIndex(prepared, end)`
3. `chunkIndex < 0`이면 `null`
4. 이후 내부 line stepping 로직으로 `end`를 한 줄 뒤로 이동
5. `{start..., end..., width}` 형태의 `InternalLayoutLine` 반환 ([GitHub][1])

즉 개념적으로는 이렇다.

```ts
function layoutNextLineRange(prepared, start, maxWidth):
    end = copy(start)
    chunkIndex = normalizeLineStartChunkIndex(prepared, end)
    if chunkIndex < 0:
        return null

    width = "현재 위치에서 한 줄만 계산"  // 내부 stepping
    if width == null:
        return null

    return {
        startSegmentIndex: normalized start,
        startGraphemeIndex: normalized start,
        endSegmentIndex: mutated end,
        endGraphemeIndex: mutated end,
        width
    }
```

`layout.ts`에서 보이던 `stepPreparedLineGeometry(...)`에 해당하는 실질 로직이 여기서는 `line-break.ts` 내부의 한 줄짜리 stepping 경로로 풀려 있는 셈이다. `walkPreparedLinesRaw()`와 같은 줄바꿈 규칙을 쓰지만, 전체 배열 대신 **한 줄 끝에서 즉시 반환**한다는 점만 다르다. ([GitHub][1])

---

## 3-1. 시작점 정규화: `normalizeLineStartInChunk(...)`

이 부분도 중요하다.
`normalizeLineStartChunkIndex()`는 먼저 `findChunkIndexForStart(...)`로 현재 segment가 속한 chunk를 찾고, 그 뒤 `normalizeLineStartInChunk(...)`를 호출한다. 만약 cursor가 이미 텍스트 끝 이상이면 `-1`이다. ([GitHub][1])

`normalizeLineStartInChunk(...)`는 특히 두 가지를 한다.

* `cursor.graphemeIndex > 0`이면 이미 세그먼트 내부 분할 상태이므로 그대로 현재 chunk 유지
* 아니라면, 현재 cursor가 chunk의 실질 시작인지, 아니면 이미 소비된 hard-break/빈 chunk 경계 뒤인지 등을 정리해서 올바른 line start로 맞춘다. 코드상 빈 chunk 처리와 `cursor.graphemeIndex = 0`, `return chunkIndex + 1` 같은 경로가 있어, 실질적으로 “다음 유효 시작점”으로 넘겨주는 역할도 한다. ([GitHub][1])

즉 `layoutNextLineRange()`는 사용자가 약간 애매한 cursor를 넘겨도 내부적으로 **line-start canonicalization**을 먼저 하고 시작한다. ([GitHub][1])

---

## 3-2. streaming path의 줄바꿈 규칙도 본질적으로 같다

`layoutNextLineRange()` 쪽 후반부 스니펫을 보면, overflow 시 판단 순서가 batch path와 매우 비슷하다.

* soft hyphen early break 우선
* `maybeFinishAtSoftHyphen(i)` 시도
* 현재 세그먼트 뒤에서 끊을 수 있으면 그 자리에서 finish
* 아니면 이전 pending break로 finish
* breakable segment면 grapheme 단위 분할
* 아니면 현재 줄을 finish ([GitHub][1])

즉 `walkPreparedLinesRaw()`는 모든 줄을 끝까지 순회하는 배치형이고, `layoutNextLineRange()`는 같은 규칙을 **한 줄 단위로 멈춰서 반환**하는 스트리밍형이다. 규칙이 다르지 않다는 점이 중요하다. ([GitHub][1])

---

# 4. 실제 줄바꿈 결정 규칙을 한 장으로 요약

이 라이브러리의 line-break 엔진은 한 세그먼트를 볼 때 대략 이렇게 판단한다고 보면 된다.

```ts
for each next segment:
    compute candidate width if appended

    if line empty:
        append segment
        remember break opportunity if any
        continue

    if fits:
        append segment
        remember break opportunity if any
        continue

    // overflow
    if pending break is soft hyphen and early break preferred and fits:
        finish line at soft hyphen
        continue

    if pending break is soft hyphen and current segment can partially fit after it:
        fit graphemes with hyphen-aware width
        finish line there
        continue

    if current segment end is a legal break and that break width fits:
        append current segment
        finish line at current segment end
        continue

    if previous pending break exists:
        finish line at previous pending break
        continue

    if current segment is breakable by grapheme:
        finish current line
        append part of segment grapheme-by-grapheme
        continue

    finish current line
```

이 규칙을 가능하게 하는 핵심 데이터가 바로 prepare 단계에서 만든:

* `widths`
* `lineEndFitAdvances`
* `lineEndPaintAdvances`
* `breakableFitAdvances`
* `kinds`
* `chunks`

다. 즉 line-break.ts는 거의 “prepared 데이터 해석기”라고 보면 된다. ([GitHub][1])

---

# 5. 네가 코드 읽을 때 특히 체크할 포인트

이 파일을 더 읽을 때는 아래 4개를 잡고 보면 된다.

첫째, `pendingBreak*` 세트는 “최근 안전한 줄바꿈 후보”다. overflow가 나면 가장 먼저 이 후보를 활용한다. ([GitHub][1])

둘째, `fitWidth`와 `paintWidth`를 따로 둔 이유는 trailing whitespace/tab/soft hyphen 같은 요소 때문이다. 줄에 “들어가는가”와 “보이는 폭”이 같지 않을 수 있다. ([GitHub][1])

셋째, `breakableFitAdvances`가 있으면 세그먼트 내부에서도 줄을 자를 수 있다. 그래서 긴 영단어, CJK run, 특수 분절 세그먼트가 폭을 초과해도 대응 가능하다. ([GitHub][1])

넷째, soft hyphen은 일반 break opportunity보다 우선순위가 조금 더 높고, 하이픈 폭까지 포함한 별도 fitting 규칙을 탄다. ([GitHub][1])

원하면 다음 답변에서는 이어서 `normalizeLineStartInChunk`, `findChunkIndexForStart`, `emitEmptyChunk`, `updatePendingBreakForWholeSegment`까지 포함해서 **cursor/chunk 기준 상태 머신**처럼 도식화해줄게.

[1]: https://github.com/chenglou/pretext/blob/main/src/line-break.ts "pretext/src/line-break.ts at main · chenglou/pretext · GitHub"
