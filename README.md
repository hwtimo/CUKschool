# CUK School 웹사이트 — 구조 & 관리 안내

캐나다 유니티 코리안 스쿨 (cukschool.com) 정적 웹사이트입니다.
빌드 없이 바로 배포되는 순수 HTML/CSS/JS 사이트이며, 콘텐츠(공지·갤러리·일정)는
관리자 페이지에서 편집합니다.

---

## 1. 콘텐츠 수정 — 코드를 몰라도 되는 부분

공지사항 / 갤러리 / 학사일정은 **관리자 페이지**에서 추가·수정합니다.

- 주소: `https://cukschool.com/admin/`
- 로그인 후 항목을 편집하고 저장하면 `notices.json` / `gallery.json` / `schedule.json`
  에 저장되고, **약 1~2분 뒤** 사이트에 자동 반영됩니다.
- 코드를 직접 만질 필요가 없습니다.

---

## 2. 공통 영역(메뉴·푸터) 수정 — 개발자용

예전에는 상단 메뉴(nav)와 하단 푸터(footer)가 **12개 HTML 파일에 각각 복사**되어 있어,
한 곳만 고치면 페이지마다 내용이 달라지는 문제가 있었습니다. 이제는 **단일 소스**입니다.

- 메뉴 원본: [`_partials/nav.html`](_partials/nav.html)
- 푸터 원본: [`_partials/footer.html`](_partials/footer.html)

수정 절차:

```bash
# 1) _partials/nav.html 또는 _partials/footer.html 을 수정
# 2) 아래 명령으로 12개 페이지에 한 번에 반영
node build.mjs
# 3) 변경된 *.html 을 커밋/푸시
```

`build.mjs` 는:
- 각 페이지의 `<nav class="navbar">…</nav>` 와 `<footer class="footer">…</footer>` 블록을
  원본 파티셜로 교체합니다.
- 웹폰트 프리커넥트(성능)를 `<head>` 에 넣습니다.
- **여러 번 실행해도 결과가 같습니다(idempotent).** 산출물이 곧 배포 파일이라
  Netlify 설정을 바꿀 필요가 없습니다.

> 활성 메뉴 강조(현재 페이지 밑줄)는 파일마다 손댈 필요 없이 `main.js` 가
> URL을 보고 자동 처리합니다. (`data-nav` 속성 기준)

---

## 3. 파일 구조

```
index.html, notices.html, programs.html, … (12개 페이지)  ← 배포되는 실제 HTML
_partials/nav.html, _partials/footer.html                 ← 공통 영역 원본(단일 소스)
build.mjs                                                  ← 공통 영역 반영 스크립트
styles.css                                                ← 전체 스타일(디자인 토큰 포함)
main.js                                                    ← 동작(메뉴·공지 렌더·모달·폼)
i18n.js                                                    ← 한/영 번역 사전 + 전환
notices.json / gallery.json / schedule.json               ← 관리자 페이지가 저장하는 콘텐츠
admin/                                                     ← 관리자(Decap CMS) 페이지
uploads/                                                   ← 업로드 이미지
hero-bg.jpg / hero-bg.webp                                 ← 히어로 배경(웹 최적화)
```

---

## 4. ⚠️ 중요 — 관리자 로그인 이관 필요 (Netlify Identity 종료)

현재 관리자 로그인은 **Netlify Identity + Git Gateway** 를 사용합니다.
이 서비스는 **2025년 2월부로 Netlify가 지원 종료(deprecated)** 했습니다.
지금은 동작하지만, 언젠가 로그인이 막힐 수 있으므로 아래 중 하나로 이관해야 합니다.

### 권장: DecapBridge (무료, Decap 전용 인증)

1. https://decapbridge.com 에서 가입하고 GitHub 저장소(`hwtimo/CUKschool`)를 연결합니다.
2. DecapBridge가 주는 설정 스니펫으로 [`admin/config.yml`](admin/config.yml) 의
   `backend:` 부분을 교체합니다. 대략 아래 형태입니다:

   ```yaml
   backend:
     name: git-gateway
     # ↓ DecapBridge 가입 후 발급되는 값으로 교체
     gateway_url: https://gateway.decapbridge.com
     auth_endpoint: https://auth.decapbridge.com
     # site_id / 기타 값은 DecapBridge 안내대로 입력
   ```
3. [`admin/index.html`](admin/index.html) 에서 `netlify-identity-widget.js` 스크립트 한 줄을
   제거합니다(DecapBridge는 필요 없음). 나머지 브랜딩/스플래시는 그대로 두면 됩니다.

### 대안: GitHub OAuth 백엔드
GitHub OAuth App + 작은 OAuth 프록시(서버리스 함수)가 필요합니다. DecapBridge보다 손이 갑니다.

> 어느 쪽이든 **호스팅(Netlify)은 그대로** 둬도 됩니다. 바꿔야 하는 건 서버가 아니라
> "로그인 방식"입니다. (Vercel 이전은 오히려 현재 관리자 기능을 깨뜨리므로 권장하지 않습니다.)
