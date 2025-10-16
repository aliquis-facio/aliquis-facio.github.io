---
tags:
  - python
---
# asyncio

async/await 구문을 사용해 동시성 코드를 작성할 수 있게 해주는 모듈이다.
단일 스레드 작업을 병렬로 처리할 수 있게 한다.
python 3.7 이상부터 사용할 수 있다.

함수를 비동기로 호출하려면 def 앞에 async라는 키워드를 넣으면 된다. async를 적용한 비동기 함수를 coroutines이라 부른다.

coroutines 안에서 다른 coroutines을 호출할 때는 await을 함수명 앞에 붙여 호출해야 한다. coroutines 수행 중 await coroutines을 만나면 await로 호출한 coroutines이 종료될 때까지 기다리지 않고 제어권을 메인 스레드나 다른 coroutines으로 넘긴다. 이러한 방식을 non-blocking이라 한다. 그리고 호출한 coroutines이 종료되면 이벤트에 의해 다시 그 이후 작업이 수행된다.

`asyncio.create_task()`: 수행할 coroutines 작업(task)을 생성한다.
`await [task]`: coroutines 실행
`[task].result()`: 실행 task의 결과값 반환
`asyncio.run(main())`: run loop를 생성해 main() coroutines을 실행한다. coroutines을 실행하려면 run loop가 반드시 필요하다. coroutines이 모두 비동기적으로 실행되기 때문에 그 시작과 종료를 감지할 수 있는 이벤트 loop가 반드시 필요하기 때문이다.


``` python
import asyncio
import time


async def sleep():
	# coroutines이 아닌 time.sleep(1)을 사용한다면 await가 적용되지 않아 실행 시간을 줄일 수 없다.
    await asyncio.sleep(1)


async def sum(name, numbers):
    start = time.time()
    total = 0
    for number in numbers:
        await sleep()
        total += number
        print(f'작업중={name}, number={number}, total={total}')
    end = time.time()
    print(f'작업명={name}, 걸린시간={end-start}')
    return total


async def main():
    start = time.time()
	
	# asyncio.create_task()는 수행할 coroutines 작업(task)을 생성한다.
    task1 = asyncio.create_task(sum("A", [1, 2]))
    task2 = asyncio.create_task(sum("B", [1, 2, 3]))
	
	# coroutines 실행
    await task1
    await task2
	
	# 실행 task의 결과값
    result1 = task1.result()
    result2 = task2.result()

    end = time.time()
    print(f'총합={result1+result2}, 총시간={end-start}')


if __name__ == "__main__":
    asyncio.run(main()) # main() coroutines 실행

```

# 참고
* [071 비동기 방식으로 프로그래밍하려면? ― asyncio](https://wikidocs.net/125092)
* [코루틴과 태스크](https://docs.python.org/ko/3/library/asyncio-task.html)