---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[OS] OS(Operating System)란?"
excerpt: "Operating System: Three Easy Pieces 정리"

date: 2025-03-16
last_modified_at: 2025-04-22

categories: [OS]
tags: [OS, C/C++, TIL]
---

# 목차
1. [운영체제(OS, Operating System)란?](#운영체제os-operating-system란)
    1. [운영체제 동작 방식](#1-운영체제-동작-방식)
        1. [가상화(Virtualization)](#11-가상화virtualization)
        1. [동시성(Concurrency)](#12-동시성concurrency)
        1. [영속성(Persistence)](#13-영속성persistence)
    1. [디자인 목표](#2-디자인-목표)

# 운영체제(OS, Operating System)란?
**자원 추상화(Resource Abstraction)**: 운영체제는 CPU, 메모리, 디스크, 네트워크 등 <mark>복잡한 하드웨어를</mark> 사용자에게 <mark>편리한 인터페이스(프로세스, 가상 메모리, 파일 등)로 추상화</mark>해 제공합니다.

**자원 관리자(Resource Manager)**: OS는 여러 프로세스나 애플리케이션이 경쟁하는 <mark>자원을 할당·회수</mark>하고, <mark>충돌을 방지</mark>하며, <mark>전체 시스템 효율을 극대화</mark>합니다.

1. 프로그램들이 쉽게 동작하도록 한다
1. 프로그램들이 메모리를 공유할 수 있도록 한다
1. 프로그램들이 devices와 상호작용할 수 있도록 만든다

## 1. 운영체제 동작 방식
폰 노이만의 컴퓨터 모델을 따르면 OS가 동작하는 것을 3가지로 나누고 있다. <mark>가상화</mark>, <mark>동시성</mark>, <mark>영속성</mark> 이렇게 3가지이다.

### 1.1. 가상화(Virtualization)
* OS는 자원(CPU, 메모리(memory), 디스크(disk))을 관리한다.  
    * **CPU**: 많은 프로그램들이 동작할 수 있게 한다.
    * **메모리(memory)**: 많은 프로그램들이 동시에 자신의 명령어(코드)와 데이터에 접근할 수 있게 한다.
    * **디스크(disk)**: 많은 프로그램들이 장치에 접근할 수 있게 한다.

* System Calls: OS는 가상머신의 기능(프로그램 실행, 메모리를 할당, 파일 접근 등)을 활용할 수 있도록 하기 위해 사용자가 호출할 수 있는 몇 가지 인터페이스(APIs)를 제공한다.  

**CPU 가상화**: 한정된 물리 CPU를 시간 분할로 나눠 “무한” 가상 CPU처럼 사용하게 함

예제 코드
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
        fprintf(stderr, "usage: cpu <string>\n");
        // input 값을 새롭게 입력 받음
        exit(1); // 종료
    }

    char *str = argv[1]; // 출력할 문자열 저장

    while (1) { // 무한 루프
        // Spin(n): common.h에 정의된 busy‑wait 함수로 내부적으로 gettimeofday()를 반복 호출해 정확히 ‘n’초가 흐를 때까지 CPU를 점유한 뒤 복귀
        Spin(1);
        printf("%s\n", str); // str을 출력함
    }

    return 0; // (실제로는 도달하지 않음)
}
```

실행 결과
``` bash
# gcc로 cpu.c(소스 코드)를 cpu(실행 파일)로 컴파일한다.
prompt> gcc-o cpu cpu.c-Wall
# &: 각각의 명령어를 백그라운드에서 실행한다. -> 백그라운드에서 4개의 명령어를 동시에 실행시킴
prompt> ./cpu A & ./cpu B & ./cpu C & ./cpu D &
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

**메모리 가상화**: 각 프로세스에 독립된 가상 주소 공간을 제공해 격리·보호

<mark>각각의 프로세스는 자기 자신의 독립된 가상 주소 공간(메모리 가상화)에 접근한다.</mark>
OS는 주소 공간을 물리적인 메모리에 연결한다.
메모리는 프로그램이 동작하는 동안에 참조하는 것은 또 다른 프로세스의 주소 공간에 영향을 미치지 않는다.
물리적인 메모리는 OS에 의해 관리되는 공유된 자원이다.

예제 코드
```c
#include <unistd.h> // POSIX 운영체제 API에 대한 엑세스 제공
#include <stdio.h>
#include <stdlib.h>
#include "common.h"

int main(int argc, char *argv[]) {
    // a1: *p를 heap의 int 크기(4B)만큼 메모리 할당
    int *p = malloc(sizeof(int));
    assert(p != NULL); // p가 NULL이 아니면 경고

    // a2: 할당된 주소 출력
    printf("(%d) address pointed to by p: %p\n", getpid(), p);

    // a3: *p 초기값을 0으로 설정
    *p = 0;

    // a4: 1초씩 대기 후 값을 증가시키고 출력하는 무한 루프
    while (1) {
        Spin(1); // common.h 의 busy‑wait: n초간 CPU 점유
        *p = *p + 1; // 힙에 할당된 정수 값을 1 증가
        printf("(%d) p: %d\n", getpid(), *p);
    }

    return 0;
}
```

실행 결과
``` bash
# mem이라는 실행파일이 생성되었다고 가정.
prompt> ./mem & ./mem &

[1] 24113 # 프로세스 1 생성
[2] 24114 # 프로세스 2 생성

# 두 프로세스의 p 주소값이 같음.
(24113) address pointed to by p: 0x200000
(24114) address pointed to by p: 0x200000

# 두 프로세스의 p값이 독립적으로 증가하고 있음.
# -> 메모리가 프로세스별로 독립된 공간을 제공받는다.
(24113) p: 1
(24114) p: 1
(24114) p: 2
(24113) p: 2
(24113) p: 3
(24114) p: 3
(24113) p: 4
(24114) p: 4
...
```

**I/O 가상화**: 디스크, 네트워크 등의 장치를 추상화해 표준화된 인터페이스로 관리

### 1.2. 동시성(Concurrency)
* **프로세스/스레드 관리**: 생성(fork/exec), 소멸(exit), 동기화(mutex, semaphore) 지원

예제 코드
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

    // 생성한 스레드가 종료될 때까지 대기
    Pthread_join(p1, NULL); 
    Pthread_join(p2, NULL);

    // 모든 자식 스레드 종료 후 메인 스레드 종료 알림
    printf("Final value : %d\n", counter);
    return 0;
}
```

**ptherad**: POSIX thread, 유닉스 계열 POSIX 시스템에서 병렬적으로 작동하는 소프트웨어를 작동하기 위해 제공하는 API
  
`pthread_create()`: <mark>thread를 생성</mark>하는 함수이다.  
`int pthread_create(pthread_t*thread, const pthread_attr_t*attr, void*(*start_routine)(void *), void *arg);`  
* pthread_t*thread: 스레드 식별자이다. 생성된 스레드를 구별하기 위한 id
* const pthread_attr_t*attr: 스레드 특성을 지정한다. 보통은 NULL을 입력한다.
* void*(*start_routine)(void *): thread가 실행되었을 때 시작할 스레드 함수이름이다.
* void *arg: 스레드가 분기할 함수에 보낼 입력 파라미터이다.
  
`pthread_join()`: main을 도는 스레드가 자신이 분기시킨 <mark>스레드들이 종료되기를 기다리는</mark> 함수이다.  
`int pthread_join(pthread_t th, void **thread_return);`  
* pthread_t th: 스레드의 식별자이다. pthread_create의 pthread_t*thread와 동일하다.
* void **thread_return: 리턴값이다.

실행 결과
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

공유하는 counter를 증가시키는 것은 기계어 측면에서는 사실 3가지 명령어를 사용한다.
1. 메모리에서 counter의 값을 가져온다.
1. 증가시킨다.
1. 메모리에 다시 저장한다.

세 명령어가 한번에(atomically) 실행되지 않고, 개별적으로 실행된다. -> 즉, 중간중간 무엇인가에 방해를 받는다.

**Race Condition(경쟁 상태)**: 두 개 이상의 실행 흐름(스레드나 프로세스)이 공유 자원(메모리, 파일, I/O 장치 등)에 동시에 접근하면서, 그 접근 순서와 타이밍에 따라 결과가 달라지는 상황을 말한다.

### 1.3. 영속성(Persistence)
**파일 시스템(File System)**: 디스크에 데이터를 조직·저장·조회하고, 시스템 장애 후 복구 기능(저널링, COW 등) 제공
* **하드웨어**: 하드 드라이브, SSD와 같은 입출력 장치  
* **소프트웨어**: 파일 시스템은 디스크를 관리한다. 또한, 유저가 만든 어떤 파일들을 저장하는 것을 책임진다.

**블록 디바이스 관리**: 디스크 블록 할당, 캐싱, I/O 스케줄링을 통해 성능과 신뢰성 보장

#### 보호 및 격리(Protection & Isolation)
**메모리 보호**: 가상 주소 기반 접근 제어로 프로세스 간 간섭 방지  
**권한 관리**: 사용자/그룹별 접근 제어, 시그널(signal)로 프로세스 제어  
**보안(Security)**: 커널 모드와 사용자 모드 분리로 악의적 코드 실행 차단

#### 인터페이스 및 API
**시스템 콜(System Call)**: open(), read(), write(), fork(), exec() 등 라이브러리와 하드웨어 제어의 경계  
**라이브러리 지원**: 표준 C 라이브러리, POSIX 스레드, 파일 처리 등 편리한 프로그래밍 인터페이스 제공

예제 코드
```c
#include <stdio.h>
#include <unistd.h>
#include <assert.h>
#include <fcntl.h> // file control
#include <sys/types.h>

int main(int argc, char *argv[]) {
    int fd = open("/tmp/file", O_WRONLY|O_CREAT|O_TRUNC, S_IRWXU); // 사람이 식별하는 파일의 이름을 시스템이 이해할 수 있는 file descrypter로 변환시켜주는 역할
    assert(fd > -1);
    int rc = write(fd, "hello world\n", 13);
    assert(rc == 13);
    close(fd);
    return 0;
}
```

`open()`: 파일을 열거나 생성 후 열어준다.  
`int open(const char *filepath, int flag, mode_t mode);`  
* const char *filepath: 열고자 하는 파일의 경로
* int flag: 파일 열 때 사용할 옵션  
    * O_RDONLY : 읽기 모드 (Read Only)  
    * O_WRONLY : 쓰기 모드 (Write Only) - 읽지 않고 쓰기만 하는 경우는 크게 많지 않음  
    * O_RDWR : 읽기/쓰기 모드  
    * O_CREAT : 파일 생성  
    * O_APPEND : 파일을 쓰되 기존 파일의 맨 끝부터 이어 쓰는 기능  
    * O_TRUNC : 파일을 초기화  
    * O_EXCL : O_CREAT 와 함께 사용되며, 이미 파일이 존재한다면 에러를 리턴  
* mode_t mode: O_CREAT 옵션을 쓸 때 필수적으로 사용해야하는 옵션으로, 파일의 접근 권한을 명시  
    * 기본 값  
        * 파일 : 0666  
        * 디렉토리 : 0777  
      
    * 아래 옵션들은 bitwise 연산으로 여러개를 동시에 사용가능함  
        * S_IRWXU : 유저 읽기, 쓰기, 실행 권한 (Read, Write, Execute User)  
        * S_IRUSR : 유저 읽기 권한 (Read User)  
        * S_IWUSR : 유저 쓰기 권한 (Write User)  
        * S_IXUSR : 유저 실행 권한 (Execute User)  
        * S_IRWXG : 그룹 읽기, 쓰기, 실행 권한 (Read, Write, Execute Group)  
        * S_IRGRP : 그룹 읽기 권한  
        * S_IWGRP : 그룹 쓰기 권한  
        * S_IXGRP : 그룹 실행 권한  
        * S_IRWXO : 기타 사용자 읽기, 쓰기, 실행 권한 (Read, Write, Execute Other)  
        * S_IROTH : 기타 사용자 읽기 권한  
        * S_IWOTH : 기타 사용자 쓰기 권한  
        * S_IXOTH : 기타 사용자 실행 권한  
* 반환 값: 성공 시 0, 실패 시 -1 을 리턴하고 errno 설정

`write()`: 파일에 내용을 작성한다.  
`ssize_t write(int fd, const void *buf, size_t count);`  
* int fd : file descriptor이다. open의 반환 값이나 stdin, stdout, stderr 에 해당하는 0,1,2를 넣어주면 된다.
* const void* buf : write 할 값이 담긴 buffer이다.
* size_t count : write할 내용의 길이이다.
* 반환 값: write에 성공한 byte의 수이다. write에 실패한 경우 -1을 반환하고 errno를 설정한다.

## 2. 디자인 목표
* **추상화**: Make the system convenient and easy to use
* **높은 성능**
    * Minimize the overhead of the OS
    * OS must strive to providde virtualization without excessive overhead
* **Protection** between applications
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
* [C/C++ open 함수 - 파일 생성 / 읽기 / 쓰기](https://bubble-dev.tistory.com/entry/CC-open-%ED%95%A8%EC%88%98-%ED%8C%8C%EC%9D%BC-%EC%83%9D%EC%84%B1-%EC%9D%BD%EA%B8%B0-%EC%93%B0%EA%B8%B0)
* [open, read, write, close 사용하기](https://tempdev.tistory.com/44)