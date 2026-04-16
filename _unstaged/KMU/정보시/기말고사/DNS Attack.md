## 6. DNS를 이용한 공격

DNS는 “도메인 ↔ IP 변환”이라는 필수 인프라라서, 공격에 많이 활용됨.

- **DNS Tunneling**
    - DNS 쿼리/응답에 데이터를 인코딩해서 **C2(Command & Control) 통신이나 데이터 유출**에 활용.
    - 보통의 HTTP/HTTPS와 달리 DNS 트래픽은 막기 어려워 **우회 통로**로 쓰임.
- **DNS Hijacking / Spoofing / Cache Poisoning**
    - DNS 서버 또는 캐시를 조작해서, 사용자를 **가짜 사이트로 유도**.
    - 피싱 페이지, 악성코드 유포 등에 활용.
- 방어 키워드
    - DNS 로그 분석, DNS 보안 게이트웨이, 도메인 평판 분석, DNS over HTTPS/TLS, 내부 DNS 정책 강화 등.