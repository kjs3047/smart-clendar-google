# Smart Calendar - Next.js Migration

Smart Calendar가 성공적으로 Next.js로 마이그레이션되었습니다! 이제 하나의 통합된 애플리케이션으로 실행됩니다.

## 🎉 마이그레이션 완료 사항

✅ **프론트엔드**: React + Vite → Next.js 15 App Router  
✅ **백엔드**: Express → Next.js API Routes  
✅ **데이터베이스**: Prisma 설정 마이그레이션  
✅ **인증**: Google OAuth 2.0 Next.js 통합  
✅ **API**: RESTful API Routes 구현  
✅ **스타일링**: Tailwind CSS 설정  
✅ **빌드**: 성공적인 Production 빌드 완료  

## 🚀 실행 방법

### 개발 서버 실행 (통합 실행)
```bash
npm run dev
```
→ 애플리케이션이 http://localhost:3000 에서 실행됩니다.

### 프로덕션 빌드
```bash
npm run build
npm start
```

## 🔧 환경 설정

1. `.env.example`을 `.env.local`로 복사
2. 환경 변수 설정:
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/smart_calendar"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   GOOGLE_CALLBACK_URL="http://localhost:3000/api/auth/google/callback"
   COOKIE_SESSION_SECRET="your-super-secret-session-key"
   ```

3. Google OAuth 설정:
   - [Google Cloud Console](https://console.cloud.google.com/)에서 프로젝트 생성
   - OAuth 2.0 Client ID 생성
   - 리디렉션 URI: `http://localhost:3000/api/auth/google/callback`

4. 데이터베이스 설정:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

## ⭐ 주요 개선사항

### 단순화된 구조
- **포트 하나로 통합**: 3000번 포트 하나만 사용
- **명령어 간소화**: `npm run dev` 하나로 전체 앱 실행
- **의존성 관리**: 하나의 package.json으로 통합

### 기능 유지
- Google OAuth 인증
- 이벤트 관리 (CRUD)
- 칸반 보드 (업무 이벤트)
- 카테고리 및 서브카테고리 관리
- 태스크 템플릿 시스템

### 개발 경험 향상
- Hot reload 개발 환경
- TypeScript 지원
- ESLint 설정
- 자동 최적화된 번들링
- Next.js App Router의 최신 기능

## 🛠️ 기술 스택

- **Frontend & Backend**: Next.js 15 (App Router)
- **UI**: React 19, TypeScript, Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Google OAuth 2.0
- **Session**: Cookie-based sessions

## 📁 새로운 프로젝트 구조

```
smart-calendar/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── auth/          # 인증 엔드포인트
│   │   └── v1/            # API v1 엔드포인트
│   ├── globals.css        # 글로벌 스타일
│   ├── layout.tsx         # 루트 레이아웃
│   └── page.tsx           # 홈페이지
├── components/            # React 컴포넌트
├── lib/                   # 유틸리티 & 설정
│   ├── auth.ts           # 인증 헬퍼
│   ├── db.ts             # Prisma 클라이언트
│   └── api.ts            # API 클라이언트
├── prisma/               # 데이터베이스 스키마
└── types.ts              # TypeScript 타입 정의
```

## 🚨 문제 해결

### 데이터베이스 연결 문제
- PostgreSQL이 실행 중인지 확인
- `.env.local`의 DATABASE_URL 확인
- `smart_calendar` 데이터베이스 존재 확인

### Google OAuth 문제
- Client ID와 Secret 확인
- 리디렉션 URI가 정확한지 확인 (`/api/auth/google/callback`)
- Google+ API 활성화 확인

이제 **단일 명령어**로 전체 애플리케이션을 실행할 수 있습니다! 🎉
