# KB Pay 바로할인 (사내 데모)

카카오페이 굿딜을 모티브로 한 KB Pay **바로할인** 풀스택 클론.
React + Spring Boot 풀스택을 빠르게 구현하는 사내 시연용 산출물입니다.

> 보고서는 [`docs/REPORT.md`](docs/REPORT.md) 를 보세요.

---

## 스택

| 영역 | 기술 |
|---|---|
| Frontend | React 18, Vite 5, TypeScript, Tailwind 3, React Router 6, axios, zustand |
| Backend  | Spring Boot 3.3, Java 17, Spring Security, Spring Data JPA, JJWT 0.12 |
| DB       | H2 (file mode, `./data/baroharin`) |

---

## 사전 준비

- **Java 17 이상** (Adoptium Temurin 권장: <https://adoptium.net/>)
- **Node.js 18 이상** (`node --version` 으로 확인)
- (선택) Gradle — 백엔드는 처음 실행 시 Gradle Wrapper를 생성한 다음 `./gradlew` 로 실행하면 별도 설치 불필요

> 현재 저장소에는 Gradle Wrapper(`gradlew`, `gradle/wrapper/`) 가 포함되어 있지 않습니다. 최초 1회 한정으로 시스템에 Gradle 을 설치하거나(`choco install gradle` / `scoop install gradle`), 또는 IntelliJ로 import 하여 자동 생성하시면 됩니다. 이후로는 `./gradlew bootRun` 만 사용하면 됩니다.

---

## 실행

### 1. 백엔드 (port 8080)

```powershell
cd backend

# Gradle wrapper 가 없을 때만 1회:
gradle wrapper

./gradlew bootRun
```

- 부팅 시 시드 데이터(카테고리 8 / 딜 35) 자동 적재
- H2 콘솔: <http://localhost:8080/h2-console>
  - JDBC URL: `jdbc:h2:file:./data/baroharin;AUTO_SERVER=TRUE`
  - User: `sa` / Password: 빈 값

### 2. 프론트엔드 (port 5173)

```powershell
cd frontend
npm install
npm run dev
```

브라우저에서 <http://localhost:5173> 접속.

> Vite proxy 가 `/api/*` 요청을 자동으로 `http://localhost:8080` 으로 포워딩합니다.

---

## 데모 시나리오

1. 우측 상단 **로그인** → 회원가입 → 자동으로 100,000원 충전
2. 홈에서 카테고리 탭 / 인기·할인율·마감임박 정렬 / 검색
3. 딜 카드 클릭 → 상세 페이지에서 카운트다운/재고 진행바 확인
4. **바로할인 결제하기** → 결제 시뮬레이션 → 잔액·재고 차감 확인
5. **주문 내역** 탭에서 결제 내역 확인
6. **마이** 탭에서 잔액 확인 / 충전(데모) / 로그아웃

---

## 디렉토리

```
Study-02/
├── backend/          Spring Boot
├── frontend/         React + Vite
├── docs/
│   └── REPORT.md     최종 보고서 (5–10p)
└── README.md
```

## 주요 API

| Method | Path | 설명 | Auth |
|---|---|---|---|
| POST | `/api/auth/signup` | 회원가입 | - |
| POST | `/api/auth/login` | 로그인 → JWT | - |
| GET  | `/api/categories` | 카테고리 목록 | - |
| GET  | `/api/deals?categoryId=&q=&sort=popular\|discount\|ending` | 딜 검색 | - |
| GET  | `/api/deals/{id}` | 딜 상세 | - |
| POST | `/api/orders` `{ "dealId": 1 }` | 결제 시뮬레이션 | JWT |
| GET  | `/api/orders/me` | 내 주문 내역 | JWT |
| GET  | `/api/users/me` | 내 정보(잔액) | JWT |
| POST | `/api/users/me/charge` `{ "amount": 10000 }` | 잔액 충전 (데모) | JWT |

---

## 트러블슈팅

| 증상 | 원인 / 해결 |
|---|---|
| `./gradlew: command not found` | 시스템에 Gradle 설치 후 `gradle wrapper` 한 번 실행해 wrapper 파일을 생성하세요. |
| 결제 시 `잔액이 부족합니다` | `/me` 페이지에서 충전(데모) 후 다시 시도. |
| `H2 console`에 접속이 안됨 | `application.yml` 에 `h2.console.enabled: true` 가 있는지 확인. |
| 프론트에서 CORS 오류 | 직접 `localhost:8080` 으로 호출 시 발생. Vite dev 서버를 통해 `/api` 로 호출하세요. |

---

## 클라우드 배포 (Render Free + Docker 단일 서비스)

프론트(Vite)를 빌드해 Spring Boot 의 정적 리소스로 번들링하는 **단일 컨테이너** 구조입니다. 동일 출처 + `'/api'` baseURL 그대로 동작하므로 CORS 설정이 필요 없습니다.

### 1. GitHub 저장소로 푸시

```bash
git init
git add .
git commit -m "chore: initial commit"
gh repo create baroharin --public --source=. --push
# (gh 가 없다면) GitHub 웹에서 빈 저장소 만든 뒤:
#   git remote add origin https://github.com/<user>/baroharin.git
#   git branch -M main
#   git push -u origin main
```

### 2. Render Blueprint 로 배포

1. <https://dashboard.render.com> → **New +** → **Blueprint**
2. 위에서 푸시한 GitHub 저장소를 선택 → `render.yaml` 자동 인식
3. **Apply** 클릭 → Docker 빌드(약 3–5분) 후 `https://baroharin.onrender.com` 형태 URL 발급
4. 환경변수는 Blueprint 가 자동 세팅:
   - `APP_JWT_SECRET` (자동 생성, 매 배포 동일)
   - `H2_CONSOLE_ENABLED=false` (운영에서는 H2 콘솔 차단)
   - `APP_CORS_ALLOWED_ORIGINS=""` (단일 출처라 비워둠)

### 3. 데이터 / 한계

- **H2 파일 DB는 비영속**: 무료 플랜은 디스크가 ephemeral 이라 컨테이너 재기동마다 초기화됩니다. `data.sql` 의 `MERGE INTO ... KEY(...)` 가 매 부팅마다 시드를 다시 보장하므로 데모 시나리오는 그대로 동작합니다. 데이터를 영속화하려면 Postgres 로 전환하거나 Fly.io 볼륨을 붙이세요.
- **콜드 스타트**: 무료 플랜은 15분 무요청 시 컨테이너가 잠들어 첫 요청이 30~50초 걸립니다.
- **빌드 시 Java 메모리**: Render 무료 플랜은 512MB. 컨테이너에 `-XX:MaxRAMPercentage=70` 적용했습니다.

### 4. 로컬에서 도커 빌드 검증

```bash
docker build -t baroharin .
docker run --rm -p 8080:8080 baroharin
# → http://localhost:8080 에서 SPA + API 동시 동작 확인
```

---

## 보안/한계 (시연 한정)

- JWT secret 이 `application.yml` 에 평문으로 들어 있습니다 (운영 시 환경 변수로 분리 필요).
- 결제는 시뮬레이션이며 실제 PG 연동이 없습니다.
- 실재 브랜드명/이미지는 사내 시연용 데모 자산입니다 (외부 공개 시 가상 브랜드로 치환 권장).
