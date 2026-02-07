---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[BAEKJOON] 백준 1912 연속합 문제 풀이"
excerpt: "w. Python"

date: 2025-03-05
last_modified_at: 2025-11-01

categories: [ALGORITHM]
tags: [ALGORITHM, BAEKJOON, PYTHON]
---

<!-- markdownlint-disable MD010 MD025 -->

# 연속합

**출처: <https://www.acmicpc.net/problem/1912>**  
![문제](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-03-07-1.png?raw=true)

## 첫 번째 시도

원소 배열 하나하나 돌면서 첫번째 최댓값, 두번째 최댓값, ..., n번째 최댓값을 비교해서 최종 최댓값 하나를 구하려고 했다.

![그림 1](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-03-05-7.png?raw=true)

``` python
import sys
from typing import *

input = sys.stdin.readline

n: int = int(input().strip())
lst: List[int] = list(map(int, input().split()))

curr_max: int
total_max: int = lst[0]

def solve(idx: int, lst: List[int]) -> int:
    global n

    idx: int = idx
    straight_sum: int = 0
    curr_max: int = lst[idx]

    for i in range(idx, n):
        straight_sum += lst[i]
        if curr_max < straight_sum:
            curr_max = straight_sum
    return curr_max

for i in range(n):
    curr_max = solve(i, lst)
    if curr_max > total_max:
        total_max = curr_max

print(total_max)
```

그러자 당연하게도 결과는 시간 초과

## 두 번째 시도

O(n)만에 끝낼 수 있다는 말을 듣고 생각해본 것  
연속합 값이 현재 최댓값보다 크면 최댓값을 현재 연속합 값으로 바꾸고, 연속합 값이 0보다 작다면 0으로 초기화하는 것이었다.

![그림 2](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-03-05-8.png?raw=true)

``` python
import sys
from typing import *

input = sys.stdin.readline

n: int = int(input().strip())
lst: List[int] = list(map(int, input().split()))

curr_max: int = lst[0]
straight_sum: int = lst[0]

for i in range(1, n):
    straight_sum += lst[i]
    if straight_sum > curr_max:
        curr_max = straight_sum
    if straight_sum < 0:
        straight_sum = 0

print(curr_max)
```

## 세 번째 시도

연속합 값이 0보다 작다면 0으로 초기화하는 것을 현재 원소값으로 초기화하는 것으로 바꿨다.

``` python
import sys
from typing import *

input = sys.stdin.readline

n: int = int(input().strip())
lst: List[int] = list(map(int, input().split()))

curr_max: int = lst[0]
straight_sum: int = lst[0]

for i in range(1, n):
    straight_sum += lst[i] # 연속합 계산
    if straight_sum > curr_max:
        # straight_sum이 curr_max보다 크면 curr_max값은 straight_sum으로 초기화
        curr_max = straight_sum
    if straight_sum < 0:
        # 연속합이 음수가 되면 lst[i]으로 초기화
        straight_sum = lst[i]

print(curr_max)
```

## 네 번째 시도

연속합이 음수가 됐을 때 lst[i + 1]로 초기화하고, 다음 for문 돌 때 중복값을 더하지 않게 바꿨다.

``` python
import sys
from typing import *

input = sys.stdin.readline

n: int = int(input().strip())
lst: List[int] = list(map(int, input().split()))

curr_max: int = lst[0]
straight_sum: int = lst[0]
check: bool = True

for i in range(1, n): # 1 ~ n-1까지 반복
    if check:
        straight_sum += lst[i] # 연속합 계산
    else:
        check = True

    if straight_sum > curr_max:
        # straight_sum이 curr_max보다 크면 curr_max값은 straight_sum으로 초기화
        curr_max = straight_sum

    if straight_sum < 0:
        # 연속합이 음수가 되면 lst[i + 1]로 초기화 -> 다음 연속합 계산을 생략해야 함
        if i+1 < n:
            straight_sum = lst[i + 1]
            check = False
        else:
            break

print(curr_max)
```

## 다섯 번째 시도

연속합값이 현재 원소값보다 작을 수 있음을 깨달았음.

``` python
import sys
from typing import *

input = sys.stdin.readline

n: int = int(input().strip())
lst: List[int] = list(map(int, input().split()))

curr_max: int = lst[0]
straight_sum: int = lst[0]
check: bool = True

for i in range(1, n): # 1 ~ n-1까지 반복
    if check:
        straight_sum += lst[i] # 연속합 계산
    else:
        check = True

    if straight_sum > curr_max:
        # straight_sum이 curr_max보다 크면 curr_max값은 straight_sum으로 초기화
        curr_max = straight_sum

    if lst[i] > curr_max:
        curr_max = lst[i]
    
    if straight_sum < 0:
        # 연속합이 음수가 되면 lst[i + 1]로 초기화
        # -> 다음 연속합 계산을 생략해야 함
        # -> 다음 straight_sum과 curr_max값을 비교해야 함
        # 연속합이 음수가 됐다 <- lst[i]값이 연속합보다 절댓값이 큰 음수이다.
        if i + 1 < n:
            straight_sum = lst[i + 1]
            check = False

print(curr_max)
```

case가

```text
3
-3 2 1
```

일 때 틀리길래 최댓값은 바꿔줬는데 뭐가 안 바뀌었을까 생각하니 현재 연속합 값을 안 바꿔줬었다.

## 풀이

``` python
import sys
from typing import *

input = sys.stdin.readline

n: int = int(input().strip())
lst: List[int] = list(map(int, input().split()))

curr_max: int = lst[0] # 최댓값
straight_sum: int = lst[0] # 연속합
check: bool = True

for i in range(1, n): # 1 ~ n-1까지 반복
    if check:
        straight_sum += lst[i] # 연속합 계산
    else:
        check = True

    if straight_sum > curr_max: # 연속합값이 최댓값보다 클 경우
        curr_max = straight_sum

    if lst[i] > curr_max: # lst[i]가 최댓값보다 클 경우
        curr_max = lst[i]
        straight_sum = lst[i] # lst[i]가 연속합값보다 큼
    
    if straight_sum < 0:
        if i + 1 < n: # IOE 방지
            straight_sum = lst[i + 1] # 연속합값을 lst[i + 1] 값으로 초기화
            check = False # 다음 연속합 계산 생략 -> 중복값 계산 X

print(curr_max)
```
