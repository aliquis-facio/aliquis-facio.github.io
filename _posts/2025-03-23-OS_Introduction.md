---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[OS] OS(Operating System)란?"
excerpt: "Intro"

date: 2025-03-16
last_modified_at: 

categories: [OS]
tags: [OS, TIL]
---

# 목차

# 운영체제(OS, Operating System)란?
운영체제(OS, Operating System)는 컴퓨터 시스템의 핵심 소프트웨어로, 컴퓨터 하드웨어와 응용 프로그램 간의 상호작용을 관리하고 제어하는 역할을 한다.

1. 프로그램들이 쉽게 동작하도록 한다
1. 프로그램들이 메모리를 공유할 수 있도록 한다
1. 프로그램들이 devices와 상호작용할 수 있도록 만든다

-> OS는 시스템이 사용하기 쉬운 방식으로 정확하고 효율적이게 동작하게 만드는 역할을 담당한다.

## 1. 운영체제 동작 방식
폰 노이만의 컴퓨터 모델을 따르면 OS가 동작하는 것을 3가지로 나누고 있다. 가상화, 동시성, 영속성 이렇게 3가지이다.

### 1.1. 가상화(Virtualization)
OS는 물리적 자원(e.g. 프로세서, 메모리, 디스크 등)을 사용한다. 그리고 좀 더 일반적이고 강력하고 가상화 형태로 사용하기 쉽게 변환한다. 그래서 우리는 운영체제를 가상머신이라 부르기도 한다.
* System Calls: OS는 가상머신의 기능(프로그램 실행, 메모리를 할당, 파일 접근 등)을 활용할 수 있도록 하기 위해 사용자가 호출할 수 있는 몇 가지 인터페이스(APIs)를 제공한다.  
* OS는 자원(CPU, 메모리(memory), 디스크(disk))을 관리한다.  
    * CPU: 많은 프로그램들이 동작할 수 있게 한다.
    * 메모리(memory): 많은 프로그램들이 동시에 자신의 명령어(코드)와 데이터에 접근할 수 있게 한다.
    * 디스크(disk): 많은 프로그램들이 장치에 접근할 수 있게 한다.

#### 예제 코드: CPU Virtualization
```c
#include <stdio.h> // standard input output
#include <stdlib.h> // standard library
#include <sys/time.h>
#include <assert.h> // assert: 에러 검출용 코드
#include "common.h"

int main(int argc, char *argv[]) {
    // int argc: main 함수에 전달되는 정보의 갯수
    // char* argv[]: main 함수에 전달되는 실질적인 정보, 문자열의 배열. 첫번째 문자열은 프로그램의 실행경로로 항상 고정이 되어 있음.
    if (argc != 2) { // input 값이 2개가 아니라면
        fprintf(stderr, "usage: cpu <string>\n"); // input 값을 새롭게 입력 받음.
        exit(1); // 종료
    }
    char *str = argv[1];
    while (1) { // 무한 루프
        Spin(1); // 1초마다 Spin 함수가 실행. 내부적으로 sleep 함수가 있다고 가정.
        printf("%s\n", str); // str을 출력함함
    }
    return 0;
}
```

실행 결과
``` bash
prompt> gcc-o cpu cpu.c-Wall
# gcc로 cpu.c(소스 코드)를 cpu(실행 파일)로 컴파일한다.
prompt> ./cpu A & ./cpu B & ./cpu C & ./cpu D &
# &: 각각의 명령어를 백그라운드에서 실행한다. -> 백그라운드에서 4개의 명령어를 동시에 실행시킴
[1] 7353 # -> Process 1, PID: 7353
[2] 7354 # -> Process 2, PID: 7354
[3] 7355 # -> Process 3, PID: 7355
[4] 7356 # -> Process 4, PID: 7356
A
B
D
C
A
B
D
C
A
...
```

-> CPU 가상화: CPU가 물리적으로는 적은 수로 구성되어 있지만, 가상화를 통해 시스템이 많은 수의 가상 CPU를 가진 것처럼(여러 프로그램이 한 번에 실행되는 것처럼) 보이게 한다.

#### 예제 코드: Memory Virtualization
```c
#include <unistd.h> // POSIX 운영체제 API에 대한 엑세스 제공
#include <stdio.h>
#include <stdlib.h>
#include "common.h"

int main(int argc, char *argv[]) {
    int *p = malloc(sizeof(int)); // a1
    // 포인터 p에 int(4 bytes)의 크기만큼의 메모리를 할당해 그 주소를 저장하겠다.
    assert(p != NULL); // p가 NULL이 아니면 경고
    printf("(%d) address pointed to by p: %p\n", getpid(), p); // a2
    *p = 0; // a3
    while (1) {
        Spin(1);
        *p = *p + 1;
        printf("(%d) p: %d\n", getpid(), *p); // a4
    }
    return 0;
}
```

실행 결과
``` bash
prompt> ./mem & ./mem &
# mem이라는 실행파일이 생성되었다고 가정.
[1] 24113 # 프로세스 1 생성
[2] 24114 # 프로세스 2 생성
(24113) address pointed to by p: 0x200000
(24114) address pointed to by p: 0x200000
# 두 프로세스의 p 주소값이 같음.
(24113) p: 1
(24114) p: 1
(24114) p: 2
(24113) p: 2
(24113) p: 3
(24114) p: 3
(24113) p: 4
(24114) p: 4
# 두 프로세스의 p값이 독립적으로 증가하고 있음.
# 메모리가 프로세스별로 독립된 공간을 제공받는다.
...
```

각각의 프로세스는 자기 자신의 독립된 가상 주소 공간(메모리 가상화)에 접근한다.
OS는 주소 공간을 물리적인 메모리에 연결한다.
메모리는 프로그램이 동작하는 동안에 참조하는 것은 또 다른 프로세스의 주소 공간에 영향을 미치지 않는다.
물리적인 메모리는 OS에 의해 관리되는 공유된 자원이다.

### 1.2. 동시성(Concurrency)
#### 예제 코드
```c
#include <stdio.h>
#include <stdlib.h>
#include "common.h"
#include "common_threads.h"

volatile int counter = 0; // volatile: 컴파일러가 알 수 없는 이유로 언제든지 값이 변할 수 있다는 것을 알림.
int loops; // BSS 영역에 정의됨.

void *worker(void *arg) {
    int i;
    for (i = 0; i < loops; i++) {
        counter++; // counter를 증가시키는 operation이 atomic하지 않아서 밑의 결과가 발생하게 됨. 경쟁 조건이 존재함.
        // load -> add -> store
    }
    return NULL;
}

int main(int argc, char *argv[]) {
    if (argc != 2) {
        fprintf(stderr, "usage: threads <value>\n"); // 값 2개를 받음: threads, values(string)
        exit(1);
    }
    loops = atoi(argv[1]); // atoi: ascii to integer
    pthread_t p1, p2;
    printf("Initial value : %d\n", counter);
    Pthread_create(&p1, NULL, worker, NULL); // p1 스레드 생성
    Pthread_create(&p2, NULL, worker, NULL); // p2 스레드 생성
    Pthread_join(p1, NULL); 
    Pthread_join(p2, NULL);
    printf("Final value : %d\n", counter);
    return 0;
}
```

ptherad: POSIX thread, 유닉스 계열 POSIX 시스템에서 병렬적으로 작동하는 소프트웨어를 작동하기 위해 제공하는 API
  
pthread_create(): thread를 생성하는 함수이다.  
`int pthread_create(pthread_t*thread, const pthread_attr_t*attr, void*(*start_routine)(void *), void *arg);`
: * pthread_t*thread: 스레드 식별자이다. 생성된 스레드를 구별하기 위한 id
: * const pthread_attr_t*attr: 스레드 특성을 지정한다. 보통은 NULL을 입력한다.
: * void*(*start_routine)(void *): thread가 실행되었을 때 시작할 스레드 함수이름이다.
: * void *arg: 스레드가 분기할 함수에 보낼 입력 파라미터이다.
  
pthread_join(): main을 도는 스레드가 자신이 분기시킨 스레드들이 종료되기를 기다리는 함수이다.  
`int pthread_join(pthread_t th, void **thread_return);`
: * pthread_t th: 스레드의 식별자이다. pthread_create의 pthread_t*thread와 동일하다.
: * void **thread_return: 리턴값이다.

Execution Stack

```bash
# 1번째
prompt> gcc-o threads threads.c-Wall-pthread prompt> ./threads 1000
Initial value : 0
Final value : 2000
# 2번째
prompt> ./threads 100000
Initial value : 0
Final value : 143012
prompt> ./threads 100000
Initial value : 0
Final value : 137298
# 실행한 결과값이 다르다.
# 비결정적이다.
```

공유하는 counter를 증가시키는 것은 3가지 명령어를 사용한다.
1. 메모리에서 counter의 값을 가져온다.
1. 증가시킨다.
1. 메모리에 다시 저장한다.

세 명령어가 한번에(atomically) 실행되지 않고, 개별적으로 실행된다. -> 즉, 중간중간 무엇인가에 방해를 받는다.

### 1.3. 영속성(Persistence)
#### 예제 코드

## 2. 디자인 목표
* 추상화: Make the system convenient and easy to use
* 높은 성능
    * Minimize the overhead of the OS
    * OS must strive to providde virtualization without excessive overhead
* Protection between applications
    * Isolation: Bad behavior of one does not harm other and the OS itself.
* High degree of reliability: The OS must also run non-stop.
* 기타
    * 에너지 효율성
    * 보안성
    * Mobility

# 참고
* [[운영체제] 운영체제(OS)란?](https://jerryjerryjerry.tistory.com/171)
* [Operating Systems: Three Easy Pieces](https://pages.cs.wisc.edu/~remzi/OSTEP/)
* [C언어 main( ) 함수의 명령 인수 (argc, argv)](https://blog.naver.com/sharonichoya/220501242693)
* [[C언어/C++] assert 함수에 대해서 : 디버깅을위한, 더 안전한 코드를 위한 오류 검출 방법](https://blockdmask.tistory.com/286)
* [gcc 그리고 unistd.h](https://wonillism.tistory.com/151)
* [c언어의 volatile 키워드](https://m.blog.naver.com/eslectures/80143556699)
* [[C] pthread란? pthread 예제](https://m.blog.naver.com/whtie5500/221692793640)