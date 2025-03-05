---
layout: post
comments: true
sitemap:
    changefreq: daily
    priority: 0.5

title: "[BAEKJOON] 백준 1912 누적합 문제 풀이"
excerpt: "w. Python"

date: 2025-03-05
last_modified_at: 

tags: [ALGORITHM, BAEKJOON, PYTHON]
---

1. 원소 배열 하나하나 돌면서 첫번째 최댓값, 두번째 최댓값, ..., n번째 최댓값을 비교해서 최종 최댓값 하나를 구하려고 했다.
<img src = "https://github.com/aliquis-facio/aliquis-facio.github.io/blob/master/_image/2025-03-05-7.png?raw=true">
```python
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
    prefix_sum: int = 0
    curr_max: int = lst[idx]

    for i in range(idx, n):
        prefix_sum += lst[i]
        if curr_max < prefix_sum:
            curr_max = prefix_sum
    return curr_max

for i in range(n):
    curr_max = solve(i, lst)
    if curr_max > total_max:
        total_max = curr_max

print(total_max)
```
그러자 당연하게도 결과는 시간 초과

O(n)만에 끝낼 수 있다는 말을 듣고 그게 가능하다고 하면서 생각한 것은
1. 누적합 값이 현재 최댓값보다 크면 최댓값을 현재 누적합 값으로 바꾸고,  
누적합 값이 0보다 작다면 0으로 초기화하는 것이었다.
<img src = "https://github.com/aliquis-facio/aliquis-facio.github.io/blob/master/_image/2025-03-05-8.png?raw=true">
```python
import sys
from typing import *

input = sys.stdin.readline

n: int = int(input().strip())
lst: List[int] = list(map(int, input().split()))

curr_max: int = lst[0]
prefix_sum: int = lst[0]

for i in range(1, n):
    prefix_sum += lst[i]
    if prefix_sum > curr_max:
        curr_max = prefix_sum
    if prefix_sum < 0:
        prefix_sum = 0

print(curr_max)
```

1. 누적합 값이 0보다 작다면 0으로 초기화하는 것을 현재 원소값으로 초기화하는 것으로 바꿨다.
```python
import sys
from typing import *

input = sys.stdin.readline

n: int = int(input().strip())
lst: List[int] = list(map(int, input().split()))

curr_max: int = lst[0]
prefix_sum: int = lst[0]

for i in range(1, n):
    prefix_sum += lst[i] # 누적합 계산
    if prefix_sum > curr_max: # prefix_sum이 curr_max보다 크면 curr_max값은 prefix_sum으로 초기화
        curr_max = prefix_sum
    if prefix_sum < 0: # 누적합이 음수가 되면 lst[i]으로 초기화
        prefix_sum = lst[i]

print(curr_max)
```

1. 누적합이 음수가 됐을 때 lst[i + 1]로 초기화하고, 다음 for문 돌 때 중복값을 더하지 않게 바꿨다.
```python
import sys
from typing import *

input = sys.stdin.readline

n: int = int(input().strip())
lst: List[int] = list(map(int, input().split()))

curr_max: int = lst[0]
prefix_sum: int = lst[0]
check: bool = True

for i in range(1, n): # 1 ~ n-1까지 반복
    if check:
        prefix_sum += lst[i] # 누적합 계산
    else:
        check = True

    if prefix_sum > curr_max:
        # prefix_sum이 curr_max보다 크면 curr_max값은 prefix_sum으로 초기화
        curr_max = prefix_sum

    if prefix_sum < 0: # 누적합이 음수가 되면 lst[i + 1]로 초기화 -> 다음 누적합 계산을 생략해야 함
        if i+1 < n:
            prefix_sum = lst[i + 1]
            check = False
        else:
            break

print(curr_max)
```

1. 누적합값이 현재 원소값보다 작을 수 있음을 깨달았음.
```python
import sys
from typing import *

input = sys.stdin.readline

n: int = int(input().strip())
lst: List[int] = list(map(int, input().split()))

curr_max: int = lst[0]
prefix_sum: int = lst[0]
check: bool = True

for i in range(1, n): # 1 ~ n-1까지 반복
    if check:
        prefix_sum += lst[i] # 누적합 계산
    else:
        check = True

    if prefix_sum > curr_max:
        # prefix_sum이 curr_max보다 크면 curr_max값은 prefix_sum으로 초기화
        curr_max = prefix_sum

    if lst[i] > curr_max:
        curr_max = lst[i]
    
    if prefix_sum < 0:
        # 누적합이 음수가 되면 lst[i + 1]로 초기화
        # -> 다음 누적합 계산을 생략해야 함
        # -> 다음 prefix_sum과 curr_max값을 비교해야 함
        # 누적합이 음수가 됐다 <- lst[i]값이 누적합보다 절댓값이 큰 음수이다.
        if i + 1 < n:
            prefix_sum = lst[i + 1]
            check = False

print(curr_max)
```
case가
3
-3 2 1
일 때 틀리길래 최댓값은 바꿔줬는데 뭐가 안 바뀌었을까 생각하니 현재 누적합 값을 안 바꿔줬다.

1. 최종 정답
``` python
import sys
from typing import *

input = sys.stdin.readline

n: int = int(input().strip())
lst: List[int] = list(map(int, input().split()))

curr_max: int = lst[0] # 최댓값
prefix_sum: int = lst[0] # 누적합
check: bool = True

for i in range(1, n): # 1 ~ n-1까지 반복
    if check:
        prefix_sum += lst[i] # 누적합 계산
    else:
        check = True

    if prefix_sum > curr_max: # 누적합값이 최댓값보다 클 경우
        curr_max = prefix_sum

    if lst[i] > curr_max: # lst[i]가 최댓값보다 클 경우
        curr_max = lst[i]
        prefix_sum = lst[i] # lst[i]가 누적합값보다 큼
    
    if prefix_sum < 0:
        if i + 1 < n: # IOE 방지
            prefix_sum = lst[i + 1] # 누적합값을 lst[i + 1] 값으로 초기화
            check = False # 다음 누적합 계산 생략 -> 중복값 계산 X

print(curr_max)
```