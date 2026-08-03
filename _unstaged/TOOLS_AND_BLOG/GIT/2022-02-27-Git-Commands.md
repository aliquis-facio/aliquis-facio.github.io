---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[GIT] Git 명령어 정리"
excerpt: "자주 쓰는 20개 정리"

date: 2022-02-27
last_modified_at: 2026-02-05

categories: [GIT]
tags: [GIT]
---

<!-- markdownlint-disable MD010 MD025 MD029 -->

# Git Commands

## 목차

---

## 1. 시작/설정

1. **저장소 만들기**

	* `git init` (현재 폴더를 git 저장소로)

2. **사용자 설정**

	* `git config --global user.name "NAME"`
	* `git config --global user.email "EMAIL"`
	* `git config --global -l` (설정 확인)

## 2. 기본 흐름: 작업 → 스테이징 → 커밋

3. **상태 확인**

	* `git status`

4. **변경 내용 보기**

	* `git diff` (작업트리 vs 스테이징 전)
	* `git diff --staged` (스테이징 vs 마지막 커밋)

5. **스테이징**

	* `git add <file>`
	* `git add .` (전체)

6. **커밋**

	* `git commit -m "message"`
	* `git commit` (에디터로 자세히)

7. **마지막 커밋 수정**

	* `git commit --amend` (메시지/내용 수정)

8. **파일 추적 제외**

	* `.gitignore` 작성 후 `git add .gitignore`

## 3. 원격(Remote) + 푸시/풀

9. **원격 저장소 복제**

	* `git clone <url>`

10. **원격 확인/등록**

	* `git remote -v`
	* `git remote add origin <url>`

11. **원격 브랜치/최신 반영(안 합침)**

	* `git fetch` (원격만 업데이트)

12. **가져와서 합치기**

	* `git pull` (= fetch + merge/rebase)

13. **올리기**

	* `git push origin <branch>`
	* 최초 1회: `git push -u origin main`

14. **브랜치 이름 변경(요즘 main)**

	* `git branch -M main`

## 4. 브랜치/병합

15. **브랜치 목록/생성**

	* `git branch`
	* `git branch <name>`

16. **브랜치 이동/생성+이동**

	* `git switch <name>`
	* `git switch -c <name>` (생성+이동)

	  * (구버전: `git checkout`)

17. **병합**

	* `git merge <branch>` (현재 브랜치에 합침)

18. **리베이스(히스토리 깔끔하게)**

	* `git rebase <base-branch>`
	  * 충돌 시: 해결 → `git add .` → `git rebase --continue`

## 5. 히스토리/되돌리기/응급처치

19. **로그 보기(필수)**

	* `git log --oneline --graph --decorate --all`

20. **되돌리기 3종 세트 (상황별 선택)**

* **(A) “커밋을 취소하는 새 커밋”**: 공유된 브랜치(원격)에 안전

	  * `git revert <commit>`
* **(B) “커밋 자체를 없애고 과거로”**: 혼자 쓰는 브랜치에서만 권장

	  * `git reset --soft <commit>` (커밋만 취소, add 상태 유지)
	  * `git reset --mixed <commit>` (기본값, add 해제)
	  * `git reset --hard <commit>` (작업물까지 삭제: 주의)
* **(C) “잠깐 치우기”** (브랜치 옮기기/풀 받기 전에)

	  * `git stash`
	  * `git stash pop`

# “실무에서 자주 터지는 상황” 빠른 처방

## 1) `push` 했는데 “이미 up to date”인데 내 변경이 없다?

* 보통 **커밋이 없거나 다른 브랜치**에 있음

	  1. `git status`
	  2. `git branch --show-current`
	  3. `git log --oneline -5`

## 2) pull 하다 충돌났을 때

* 파일 열어서 `<<<<<<` 구간 해결 →
  `git add .` →
  (merge면) `git commit` / (rebase면) `git rebase --continue`

## 3) “원격에 올린 커밋을 수정”해야 한다

* 혼자 쓰는 브랜치면: `git commit --amend` 후 `git push --force-with-lease`
* 협업 브랜치면: 웬만하면 `revert`로 처리

---

# 참고

1. <https://jw910911.tistory.com/77>
