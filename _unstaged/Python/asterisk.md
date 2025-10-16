# `*(asterisk/star)`와 **(double asterisk/double star)


`*args` 및 `**kwargs`는 파이썬 문서의 `<More on Defining Functions>` 섹션에 설명된대로 function에 임의 개수의 인수(argument)를 허용하는 일반적인 관용구이다.

두 관용구 모두 일반 인수와 혼합해 고정 인수와 가변 인수를 허용할 수 있다.
``` python
def foo(a, b, c):
	print(a, b, c)

obj = {"b": 10, "c": "C"}

foo(100, **obj)
# 100 10 C
```

`*lst` function을 호출할 때 인수 리스트를 언팩(unpack argument lists)할 수 있다.
``` python
first, *rest = [1, 2, 3, 4]
first, *lst, last = [1, 2, 3, 4]
print(rest)
print(first)
print(lst)
print(last)

# [2, 3, 4]
# 1
# [2, 3]
# 4
```
## `*args`

모든 function parameter(매개 변수)를 튜플로 제공한다.
``` python
def foo(*args):
	for a in args:
		print(a)
		
foo(1)
# 1

foo(1, 2, 3)
# 1
# 2
# 3
```

## `**kwargs`

keyword arguments(키워드 인수)를 딕셔너리로 제공한다.
``` python
def bar(**kwargs):
	print(kwargs)

bar(name='one', age=27)
# {'name': 'one', 'age': 27}
```

# 참고

* [4.9. More on Defining Functions](https://docs.python.org/dev/tutorial/controlflow.html#more-on-defining-functions)
* [파라미터에 사용되는 * 와 ** (asterisk와 double asterisk, star와 double star)](https://m.blog.naver.com/hankrah/222399059877)