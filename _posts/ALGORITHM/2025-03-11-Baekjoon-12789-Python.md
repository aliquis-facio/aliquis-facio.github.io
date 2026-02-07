---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[BAEKJOON] 백준 12789 도키도키 간식드리미 문제 풀이"
excerpt: "w. Python"

date: 2025-03-05
last_modified_at: 2025-11-01

categoreis: [ALGORITHM]
tags: [ALGORITHM, BAEKJOON, PYTHON]
---

<!-- markdownlint-disable MD010 MD025 -->

# 12789 도키도키 간식드리미

**출처: <https://www.acmicpc.net/problem/12789>**  
![문제](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-03-11-1.png?raw=true)

## 문제 이해

1. numbers를 앞에서부터 하나씩 본다.
1. 현재 number가 가장 작은 수 p인지 확인한다
1. 같다면 p를 1 증가시키고 다음 number를 확인한다
1. 다르다면 stack의 마지막 수랑 p를 비교한다
    1. 같다면 stack의 마지막 수를 빼주고 p를 1증가시키고 다음 마지막 수와 비교한다
    1. 다르다면 반복을 종료한다

1. ![그림1](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-03-11-2.jpg?raw=true)
1. ![그림2](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-03-11-3.jpg?raw=true)
1. ![그림3](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-03-11-4.jpg?raw=true)
1. ![그림4](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-03-11-5.jpg?raw=true)
1. ![그림5](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-03-11-6.jpg?raw=true)
1. ![그림6](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-03-11-7.jpg?raw=true)
1. ![그림7](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-03-11-8.jpg?raw=true)
1. ![그림8](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-03-11-9.jpg?raw=true)

## 풀이

``` python
import sys
from typing import *

input = sys.stdin.readline

N:int = int(input())
numbers:List[int] = list(map(int, input().split()))
stack:List[int] = []
p:int = 1

for n in numbers:
    if n == p: # 현재 number가 p랑 같다면
        p += 1
        continue
    else: # 다르다면면
        while(stack): # stack이 채워져있다면
            if stack[-1] == p: # stack의 마지막 원소가 p와 같다면
                stack.pop() # stack 마지막 원소 빼주기
                p += 1
            else: # 다르다면
                break # 반복 안 하기
        
        stack.append(n)

while(stack):
    if stack[-1] == p:
        stack.pop()
        p += 1
    else:
        break

if stack: # stack을 다 못 빼냈다 = 승환이는 간식을 받지 못한다
    print("Sad")
else:
    print("Nice")
```
