# 타원 곡선 암호화 알고리즘, ECC Algorithm

## 정의
$$
y^2 = x^3 + ax + b
$$

![](20250903202632.png)


![](20250903202649.png)
## 비특이 타원 곡선(Nonsingular Elliptic Curve)
첨점(Sharp Point), 교차점(Intersection Point)이 존재하지 않는 타원 곡선
e.g. 
$y^2 = x^3$
$y^2 = x^3 - 3x + 2$

## 비특이 타원 곡성 특징
x축 상에서 y의 값이 대칭
두 점 P와 Q를 연결하는 직선은 반드시 다른 한 점(R)을 연결
P와 Q가 동일할 때도 성립: 접선(tangent)

## 타원 곡선 점
P = (x, y)
0 = (x, 0)
-P = (x, -y)

## 타원 곡선 점 덧셈 연산
P + Q + R = 0
P + Q = -R
R + (-R) = R - R = 0

## 타원 곡선 점 곱셈 연산
P + P + ... + P = kP(점 P의 k 스칼라 곱)

## 결합법칙, 교환법칙, 분배법칙
3G = (G + G) + G = G + (G + G)
3G = 2G + G = G + 2G
(2+2)G = 2G + 2G
6G = 3(2G) = 2(3G)
24G = 3(2(4G)) = 4(2(3G))

## 항등원, 역원
덧셈 항등원: 0
P의 덧셈 역원: -P
곱셈 항등원: 1
곱셈 역원: P^-1

## 배가 연산
(2^n)G 덧셈 횟수 = $n(log_2(2^n))$

## 빠른 덧셈 연산: 배가와 덧셈 알고리즘
k_max = $2^{n-1} + 2^{n-2} + ... + 2^0$
k_maxG 연산 횟수 = 배가 연산 (n-1)회 + 덧셈 연산 (n-1)회 = 2(n-1)회
e.g. k가 256bit -> kG의 최대 연산 횟수 = 255 + 255 = 510회

## 타원 곡산 이산 대수 연산
### 타원 곡선 이산 대수 문제
K = xG에서 K와 G가 주어질 때 x를 구하는 문제
### 타원 곡선 이산 대수 문제의 해법
점 K로부터 점 G를 빼는 연산 반복 수행

## 타원 곡선 암호
### 모듈로 p 타원 곡선 방정식
$y^2 \; mod \; p = (x^3 + ax + b) \; mod \; p, p는 소수$

## 타원 곡선 디지털 서명
k = 개인키
r = 비밀의 큰 수
kG = 공개키
m = 메시지
hash(m, rG)kG + rG = (hash(m, rG)k + r)G
R = rG
s = hash(m, rG)k + r
K = kG
hash(m, R)K + R = sG

## 타원 곡선 Diffie-Hellman(ECDH)
### 사용자 A, 공개키를 B에게 전송
개인키: $k_A$
공개키: $K^+_A$ = $K_AG$
### 사용자 B, 공개키를 A에게 전송
개인키: $k_B$
공개키: $K^+_B$ = $K_BG$

### 사용자 A의 대칭키
$k_AK^+_B$

### 증명
$k_AK^+_B = k_A(k_BG) = k_Bk_AG = k_BK^+_A$

# 참고
* [기초 암호학(4) - ECC(타원곡선 암호화 알고리즘)](https://developer-mac.tistory.com/83)
* [타원 곡선 이산 대수 문제의 풀기 어려움에 대한 설명](https://www.reddit.com/r/cryptography/comments/11s6myd/clarification_on_the_intractability_of_the/?tl=ko)
* [공개키암호2_타원곡선암호(ECC)](https://www.youtube.com/watch?v=xtkDTtf_efs&t=840s)
* [P-NP Problem](Computer Science/P-NP Problem.md)