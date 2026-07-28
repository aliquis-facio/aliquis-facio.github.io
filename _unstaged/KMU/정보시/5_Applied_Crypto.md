## 2. 블라인드 서명(Blind Signatures)

- 개념: 서명자(Bob)가 **메시지 내용을 보지 못한 채** 서명해 주도록 하는 기법(Chaum, RSA 기반). 발신자(Alice)가 임의 난수 k를 뽑아 메시지를 **블라인딩**하고, Bob은 이를 서명한 뒤 Alice가 **언블라인딩**하여 최종 서명을 얻는다.
- <font color="#ff0000">수식(RSA)</font>: t = m·kᵉ (mod n) → Bob: tᵈ = mᵈ·k (mod n) → Alice: (tᵈ·k⁻¹) = mᵈ (mod n).
- 활용: **전자투표** 등 발신자 프라이버시가 중요한 환경(투표 인증은 하되, 선택 내용은 노출 금지).

## 3. Kerberos

