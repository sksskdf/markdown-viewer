# MD Viewer

가장 단순한 마크다운 뷰어 · 편집기. **열고, 읽고, 고친다.** 외부 의존성 0, 단일 HTML 파일.

> 설치형 PWA로 동작하며, `.md` 파일을 더블클릭하면 앱으로 열 수 있습니다.

**▶ 바로 사용:** https://sksskdf.github.io/markdown-viewer/prototyping/

### 앱으로 설치 (권장)

위 주소를 Chrome/Edge로 열고 → 주소창의 **설치 아이콘**(⊕/모니터 모양) 클릭 → "MD Viewer 설치".
독립 창 앱으로 실행되고 시작 메뉴/바탕화면에 등록되며, 서비스워커 캐시 덕에 **오프라인·컴퓨터 재시작에도 동작**합니다(로컬 서버 불필요). 이후 `.md` 더블클릭으로 이 앱에서 열 수 있습니다.

## 특징

- **멀티탭** — 여러 파일을 드래그하면 각각 탭으로. 탭별로 내용·보기/편집 모드·스크롤 위치를 독립 보존
- **보기 ⇄ 편집** — `읽기 | 편집` 토글(`Ctrl/Cmd+E`). 편집은 화면 전환(플립) 방식
- **무손실 자동저장** — 편집 내용을 `localStorage`에 자동 보관, 브라우저를 닫았다 열어도 세션 복원
- **다크 모드 자동** — 시스템 설정(`prefers-color-scheme`)을 따름, 토글 없음
- **오프라인 PWA** — 서비스워커로 자산 캐시, 네트워크 없이 동작. `manifest.json`의 `file_handlers`로 `.md` 연결
- **의존성 0** — 마크다운 파서 내장(제목·강조·취소선·코드·인용·목록·표·링크·이미지). XSS 방지(속성 이스케이프 + 위험 URL 스킴 차단)

## 로컬 개발

`File System Access`·서비스워커 같은 기능은 보안 컨텍스트(`localhost`/HTTPS)에서만 동작합니다.

```bash
# 로컬 서버
cd prototyping
python -m http.server 4321
# → http://localhost:4321
```

또는 `prototyping/index.html`을 브라우저에서 바로 열어도 보기/편집/멀티탭은 동작합니다.

## 단축키

| 키 | 동작 |
| --- | --- |
| `Ctrl/Cmd + E` | 보기 ⇄ 편집 전환 |
| `Ctrl/Cmd + S` | `.md`로 내보내기(핸들 있으면 원본에 저장) |
| `Ctrl/Cmd + O` | 파일 열기 |
| `Ctrl/Cmd + W` | 탭 닫기 *(설치형 앱)* |
| `Ctrl/Cmd + Tab` | 탭 전환 *(설치형 앱)* |

## 구조

```
prototyping/
├── index.html      # 앱 전체 (UI + 파서 + 상태 + PWA 연결)
├── manifest.json   # PWA 매니페스트 (file_handlers 포함)
├── sw.js           # 서비스워커 (오프라인 캐시)
├── icon-192.png    # 아이콘
├── icon-512.png    # 아이콘 (maskable)
└── favicon.ico
```

## 패키징 방향

설치형 **PWA**를 기본으로 합니다(빌드/스토어 심사 없음, 오프라인, `.md` 더블클릭 연결). HTML을 래퍼 비의존적으로 작성해, 필요 시 Tauri/Pake로 가벼운 Windows `.exe`(WebView2)로도 감쌀 수 있습니다.

---

*프로토타입입니다.*
