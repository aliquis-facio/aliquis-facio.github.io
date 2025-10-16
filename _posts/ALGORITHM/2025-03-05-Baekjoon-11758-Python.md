---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[BAEKJOON] 백준 11758 CCW 문제 풀이"
excerpt: "w. Python"

date: 2025-03-05
last_modified_at: 

categories: [ALGORITHM]
tags: [ALGORITHM, BAEKJOON, PYTHON]
---

# 11758 CCW

**출처: <https://www.acmicpc.net/problem/11758>**  
![문제](https://github.com/aliquis-facio/aliquis-facio.github.io/blob/master/_image/2025-03-05-9.png?raw=true)

## 문제 이해

![그림 1](https://github.com/aliquis-facio/aliquis-facio.github.io/blob/master/_image/2025-03-05-10.png?raw=true)  

P1 -> P2 -> P3 순서로 화살표를 그리면 나오는 방향으로 시계 방향, 반시계 방향을 판단하는 것 같다  

![그림 2](https://github.com/aliquis-facio/aliquis-facio.github.io/blob/master/_image/2025-03-05-11.png?raw=true)  

선분 P1P2를 직선으로 쭉 늘렸을 때 P3의 y좌표가 위쪽에 위치할 경우 반시계 방향, 아래에 위치할 경우 시계 방향으로 판단할 수 있다.  
그렇게 P1과 P2로 방정식을 구하게 되면 부동소수점의 한계로 오차가 생기게 되므로 양쪽에 ***P2의 x좌표 - P1의 x좌표***를 곱해 나눗셈을 제거한다.  

## 풀이

``` python
from sys import stdin
from typing import *

input = stdin.readline

P1: List[int] = list(map(int, input().split())) # [x1, y1]
P2: List[int] = list(map(int, input().split())) # [x2, y2]
P3: List[int] = list(map(int, input().split())) # [x3, y3]

point: int = (P2[1] - P1[1]) * (P3[0] - P1[0]) + (P2[0] - P1[0]) * P1[1]

direct: int
if point > (P2[0] - P1[0]) * P3[1]:
    direct = -1
elif point == (P2[0] - P1[0]) * P3[1]:
    direct = 0
else:
    direct = 1

print(direct)
```