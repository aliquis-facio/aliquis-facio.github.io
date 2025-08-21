---
layout: post
comments: true
sitemap:
    changefreq: daily
    priority: 0.5

title: "Install Apache, PHP, MySQL"
excerpt: "Install Apache, PHP, MySQL in Windows 10"

date: 2022-02-14
last_modified_at: 

categories: [WEB]
tags: [WEB]
---

_해킹 맛보기_ 를 읽기 시작했다. 책의 설명을 그대로 따라갈 수는 없기에 이런저런 블로그와 사이트를 참고해서 Apache, PHP, MySQL을 다운받았다.

참고 사이트
1. https://velog.io/@yuus95/apache
2. https://fifo22.tistory.com/34
3. https://araikuma.tistory.com/774
4. https://haenny.tistory.com/202
5. https://asufi.tistory.com/entry/Windows-10-64bit-%ED%99%98%EA%B2%BD-PHP-%EC%84%A4%EC%B9%98%ED%95%98%EA%B8%B0
6. https://velog.io/@joajoa/MySQL-%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C-%EB%B0%8F-%EC%84%A4%EC%B9%98-%EB%B0%A9%EB%B2%95
7. https://m.blog.naver.com/bjh7007/221829548634

Apache, MySQL, PHP를 전부 다운받고, php.ini-development 파일과 httpd.conf 파일을 전부 수정함.

---
### php.ini-development -> php.ini
  
**before**
```
;extension_dir = "./"

;extension=mysqli
```
  
**after**
```
extension_dir = ""C:\\apm\\php\\ext""

extension=mysqli
```  
---

---
### httpd.conf
  
**before**
```
Define SRVROOT "c:/Apache24"

<IfModule dir_module>
    DirectoryIndex index.html
</IfModule>
```
  
**after**
```
Define SRVROOT "C:/apm/Apache24"

<IfModule dir_module>
    DirectoryIndex index.php index.html
</IfModule>

PHPIniDir "c:/apm/php7"
LoadModule php7_module "c:/apm/php7/php7apache2_4.dll"
AddType application/x-httpd-php .html .php
AddHandler application/x-httpd-php .php
```  
---

하지만 apache를 실행시키고 127.0.0.1을 접속하면 '사이트에 연결할 수 없음'만 나오고 있음.