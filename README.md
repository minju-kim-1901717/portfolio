# MINJU KIM Portfolio · NÉTHRA AI Case Study (v13)

기존 v12 포트폴리오를 바탕으로 제작한 **GitHub Pages용 정적 HTML 전체 사이트**입니다. 프레임워크/빌드/서버 설치가 필요 없습니다.

## 새로 추가된 내용

- `index.html`: 기존 움직이는 숏폼 갤러리에 NÉTHRA 프로젝트 카드 추가(총 8개), `AI Creative Lab` 소개 영역 및 메뉴 추가.
- `ai-lab.html`: 앞으로 AI 프로젝트를 필요한 만큼 추가할 수 있는 프로젝트 아카이브 페이지.
- `projects/nethra.html`: NÉTHRA 단독 상세 케이스 페이지. 브랜드 콘셉트 → 가상 모델 AÉL → 립글로스 제품 아이덴티티 → 캠페인 비주얼 → YouTube 영상 → 제작 프로세스.
- `ai-pages.css`, `ai-pages.js`: 새 페이지 디자인 및 YouTube 팝업 재생.
- `assets/nethra/*.webp`: 이번 채팅에서 제공한 NÉTHRA 이미지 16개의 경량 WebP 파일. 전체 약 2MB.
- `script.js`: 기존 영상 플레이어에 NÉTHRA 영상 ID 추가.

**중요:** GitHub에 이미 존재하는 `MINJU KIM.pdf`는 이 ZIP에 복사하지 않았습니다. 기존 저장소의 PDF는 그대로 유지하세요. PDF 다운로드 버튼도 기존 링크를 유지합니다.

## GitHub Pages에 적용하는 법 (기존 저장소 유지)

1. ZIP 압축을 풀고 아래 파일과 폴더를 **실제 Git 저장소** `minju_portfolio/portfolio/`에 복사합니다. (`minju_portfolio/` 바깥쪽이 아님.)
2. 기존 작업을 로컬에서 별도로 수정했다면, 교체 전 변경분을 백업하세요. 이 패키지는 대화에서 만든 **v12** 기반입니다.
3. 다음 전체 구조를 저장소 루트에 둡니다.

```text
portfolio/                         ← .git이 있는 폴더
├── index.html                     ← 업데이트
├── styles.css                     ← 업데이트
├── script.js                      ← 업데이트
├── ai-lab.html                    ← 새 파일
├── ai-pages.css                   ← 새 파일
├── ai-pages.js                    ← 새 파일
├── projects/
│   └── nethra.html                ← 새 파일
├── assets/
│   ├── nethra/                    ← 새 이미지
│   │   └── *.webp
│   └── 기존 SVG 파일들
├── MINJU KIM.pdf                  ← 기존 파일 유지
└── README.md                      ← 필요시 업데이트
```

터미널에서 **`.git`이 있는 안쪽 `portfolio` 폴더**로 이동 후:

```bash
git status --short
git add index.html styles.css script.js ai-lab.html ai-pages.css ai-pages.js projects/ assets/nethra/
git commit -m "Add NETHRA AI creative case study"
git push origin main
```

새 페이지 배포 URL:

- 메인: `https://minju-kim-1901717.github.io/portfolio/`
- AI 프로젝트 모음: `https://minju-kim-1901717.github.io/portfolio/ai-lab.html`
- NÉTHRA 상세: `https://minju-kim-1901717.github.io/portfolio/projects/nethra.html`

## AI 프로젝트 추가 방법 (무제한 확장)

추가 가상 브랜드가 생기면 다음 3개만 하면 됩니다.

1. `projects/nethra.html`을 복사해 `projects/new-brand.html`로 만들고 프로젝트별 브랜드명·텍스트·영상 ID·이미지 경로를 교체합니다. 페이지의 섹션을 프로젝트에 맞춰 더하거나 뺄 수 있습니다.
2. 새 이미지들을 `assets/new-brand/`에 저장하고 `src="../assets/new-brand/파일.webp"` 형태로 연결합니다.
3. `ai-lab.html`에서 `<!-- ADD A PROJECT ... -->` 바로 다음의 `<article class="lab-project-card"> ... </article>` 하나를 복제하고 새 이미지·제목·설명·`projects/new-brand.html` 링크를 넣습니다. 메인 `index.html`에는 기존 AI Creative Lab 소개 링크가 있어 프로젝트 수가 늘어도 추가 수정이 필수는 아닙니다.

**영상 연결:** 상세 페이지에서 `data-case-video="nsKG7nkPA0Y"`의 YouTube ID를 새 영상 ID로 변경합니다. `Watch on YouTube`와 팝업 하단 YouTube 링크도 새 영상 URL로 바꿉니다. 다른 프로젝트에서 상세 페이지에 여러 영상을 넣고 싶다면 서로 다른 `data-case-video` 버튼을 추가하면 됩니다.

## 동영상 오류 153 안내

유튜브 팝업은 배포된 `https://` GitHub Pages 주소에서 클릭할 때만 로드합니다. **파일 탐색기에서 HTML을 직접 여는 `file://` 방식은 로컬 안내 메시지가 나옵니다.** 153 오류 방지를 위해 HTTPS 사이트에서는 `strict-origin-when-cross-origin` 및 `origin` 값을 사용합니다. 임베드 자체가 제한된 경우에는 YouTube 직접 링크도 제공됩니다.

## 디자인 정보

기존 화이트/핑크 포트폴리오와 NÉTHRA 캠페인 전용 딥 플럼·라벤더·로즈핑크 톤을 연결했습니다. 원본 PNG 파일을 가볍게 WebP로 변환했고, 아래쪽 이미지는 `loading="lazy"`로 설정했습니다.


## v15 수정 사항

- 메인 숏폼 갤러리의 NÉTHRA 카드(이미지·제목)를 누르면 `projects/nethra.html` 상세 페이지로 바로 이동합니다. 상세 페이지의 최종 광고 영상은 기존대로 재생할 수 있습니다.
- 화면에 표시되던 GitHub Pages 배포·로컬 미리보기·YouTube 오류 153 안내와 인스타그램 임시 썸네일 제작자 안내를 삭제했습니다.
- 파일을 직접 여는 미리보기에서 동영상을 클릭하면 별도 안내문 대신 원본 YouTube 페이지가 새 탭으로 열립니다. 웹에 배포하면 기존처럼 페이지 내부 플레이어가 작동합니다.
