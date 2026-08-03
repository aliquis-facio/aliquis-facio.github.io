# Chapter 1: Intro to Design Patterns

### 📄 p.1~3 : 오리 시뮬레이터의 시작

- 책은 **"Duck Simulator"** 라는 재미있는 예제에서 시작합니다.
- 기본 아이디어: 다양한 오리 클래스를 만들고 싶다. (`MallardDuck`, `RubberDuck`, `RedHeadDuck` 등)
- 이들은 공통적으로 `quack()` (꽥꽥), `swim()` (수영) 같은 기능이 있고, 어떤 오리는 `fly()` (날기) 기능도 있다.
- **문제:** 상속을 쓰면 편리할 것 같지만, 모든 오리가 동일하게 날거나 울 필요는 없다.
    - 예: 고무 오리는 날 수 없어야 하고, 소리도 "삑삑"이어야 한다.
    - 그런데 단순 상속을 쓰면 불필요하거나 잘못된 기능까지 상속받는다.

![2025-10-01-10-32-50](/_image/2025-10-01-10-32-50.png)
> 그림1: 다양한 오리 클래스들

👉 **해설:** 여기서 저자는 "상속 기반 설계의 문제"를 유머러스하게 보여주면서, "유연한 설계"의 필요성을 강조합니다.

---

### 📄 p.4~7 : 상속의 문제점

- `Duck`이라는 부모 클래스를 만들고, 오리들이 이를 상속받는 구조를 그림으로 설명.
- 그러나 특정 오리(고무 오리, 장난감 오리)는 부모 클래스의 메서드가 적절하지 않음.
	- 고무 오리(Rubber Duck): quack() → squeak(), fly() → null
	- 장난감 오리(Decoy Duck): quack() → null, fly() → null
- 이를 해결하려고 **메서드 오버라이딩**을 하다 보면, 중복 코드와 유지보수 문제가 발생.

👉 **핵심 포인트:**  
상속은 "코드 재사용"에는 좋아 보이지만, **행동이 자주 변하거나, 오리별로 달라지는 경우에는 불필요한 결합과 중복**을 만들어낸다.

---

### 📄 p.8~12 : 올바른 해결책은?

- 저자는 "**변하는 부분을 찾아내서, 변하지 않는 부분과 분리하라**"는 원칙을 제시합니다.
	- 변하지 않는 부분(안정적인 로직)과 변하는 부분(자주 바뀌는 알고리즘, 정책)
- 오리들의 **행동(날기, 울기)** 을 별도의 클래스(전략 객체)로 분리하면 문제 해결 가능.
- 예:
    - `Flyable` 인터페이스: `fly()` 메서드를 정의.
    - `Quackable` 인터페이스: `quack()` 메서드를 정의.
- 각각에 대해 여러 구현을 둔다.
    - `FlyWithWings`, `FlyNoWay`, `FlyRocketPowered`
    - `Quack`, `Squeak`, `MuteQuack`

![2025-10-01-00-00-00](/_image/2025-10-01-00-00-00.png)
> 그림2: 인터페이스

👉 **해설:** 이것이 바로 **Strategy Pattern(전략 패턴)** 의 핵심 아이디어. "행동을 객체로 캡슐화하여 바꿀 수 있게 한다."
* 변하는 부분을 찾아내어 캡슐화하라. 그러면 코드의 나머지 부분에 영향을 주지 않게 된다. 결과는? 코드 변경으로 인한 의도치 않은 부작용은 줄고, 시스템은 훨씬 더 유연해진다.
* **encapsulate** → 변화를 독립된 모듈(클래스/인터페이스)로 빼내어 격리한다.
* 구현이 아닌 인터페이스에 맞추어 프로그래밍하라.
	* 구체적인 클래스에 직접 의존 X, 추상화에 의존해야 한다 → 코드가 특정 구현에 묶이지 않고, 유연성과 확장성을 확보할 수 있다.
	* Dependency Inversion Principle(DIP): 상위 모듈은 하위 모듈에 의존해서는 안 되며, 둘 다 추상화에 의존해야 한다. 의존성의 방향을 구체 클래스 → 추상화로 뒤집어라
	* 객체 생성조차 코드에 박아두지 않고, 런타임에서 구체 클래스 할당 → 의존성 최소화, 팩토리 기법 활용 가능.

---

### 📄 p.13~18 : 코드 적용

- `Duck` 클래스는 이제 `FlyBehavior`와 `QuackBehavior` 객체를 **포함(Composition)** 하여 행동을 위임한다.
- 즉, 오리의 행동을 상속이 아니라 **위임(delegation)** 으로 처리.
- 예시 코드:
    ```java
	public abstract class Duck {
		FlyBehavior flyBehavior;
		QuackBehavior quackBehavior;
		
		public Duck() {}
		
		public void performFly() {
			flyBehavior.fly();
		}
	
		public void performQuack() {
			quackBehavior.quack();
		}
	
		public void swim() {
			System.out.println("모든 오리는 물에 뜹니다. 장난감 오리도 예외는 아니죠!");
		}
	
		public void setFlyBehavior(FlyBehavior fb) {
			flyBehavior = fb;
		}
	
		public void setQuackBehavior(QuackBehavior qb) {
			quackBehavior = qb;
		}
	}
	
	public class MallardDuck extends Duck {
		public MallardDuck() {
			quackBehavior = new Quack();
			flyBehavior = new FlyWithWings();
		}
		
		public void display() {
			System.out.println("I'm a real Mallard Duck!");
		}
	}
	```
- 이렇게 하면 오리의 행동을 런타임에 바꿀 수도 있다.

👉 **해설:** 이 부분은 "상속(Inheritance) → 합성(Composition)"으로 사고 전환을 강조.

---

### 📄 p.19~24 : 디자인 원칙 정리

1. **변하는 부분을 캡슐화하라.**
    - 변하는 부분(날기, 울기)을 따로 빼내어 관리.
2. **구현이 아닌 인터페이스에 맞춰 프로그래밍하라.**
    - `Duck`은 `FlyBehavior`와 `QuackBehavior`라는 인터페이스에 의존.
3. **상속보다는 구성(Composition)을 선호하라.**
    - 오리의 행동은 "가지고 있는 객체"로 해결.

---

### 📄 p.25~30 : 패턴 적용의 효과

- 새로운 행동을 쉽게 추가 가능 (`FlyRocketPowered` 같은 클래스 추가).
- 특정 오리의 행동을 런타임에 교체 가능.
- 중복 코드가 사라지고, 변경이 용이해짐.
- **Strategy 패턴**이라는 이름으로 정리:
    - "알고리즘군을 정의하고, 각 알고리즘을 캡슐화하여 상호 교체 가능하게 만든다."

---

## ✅ 1장 전체 핵심

- 문제: 상속 기반 설계는 유연하지 못하고 중복을 만든다.
- 해결: **변하는 부분을 인터페이스로 추상화하고, 합성(Composition)으로 행동을 캡슐화한다.**
- 원칙:
    1. 변하는 부분을 캡슐화
    2. 구현이 아닌 인터페이스에 맞춰 프로그래밍
    3. 상속보다 합성을 선호
- 결과: **Strategy Pattern**
