# Smart Calendar Server Setup

## 환경 변수 설정

1. `server` 디렉토리에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Database Configuration
DATABASE_URL="postgresql://postgres:password@localhost:5432/smart_calendar"

# Google OAuth Configuration
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3001/api/auth/google/callback"

# Session Configuration
COOKIE_SESSION_SECRET="your-super-secret-session-key-change-this-in-production"

# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
```

## PostgreSQL 데이터베이스 설정

1. PostgreSQL이 설치되어 있는지 확인하세요
2. `smart_calendar` 데이터베이스를 생성하세요:
   ```sql
   CREATE DATABASE smart_calendar;
   ```
3. DATABASE_URL의 사용자명, 비밀번호, 호스트를 실제 PostgreSQL 설정에 맞게 수정하세요

## Google OAuth 설정

1. [Google Cloud Console](https://console.cloud.google.com/)에서 새 프로젝트를 생성하세요
2. Google+ API를 활성화하세요
3. OAuth 2.0 클라이언트 ID를 생성하세요:
   - 애플리케이션 유형: 웹 애플리케이션
   - 승인된 리디렉션 URI: `http://localhost:3001/api/auth/google/callback`
4. 생성된 클라이언트 ID와 시크릿을 `.env` 파일에 입력하세요

## 데이터베이스 마이그레이션

환경 변수를 설정한 후 다음 명령을 실행하세요:

```bash
cd server
npx prisma migrate dev --name init
```

## 서버 실행

```bash
cd server
npm run dev
```

## 문제 해결

- DATABASE_URL 오류: PostgreSQL이 실행 중이고 데이터베이스가 생성되었는지 확인하세요
- Google OAuth 오류: 클라이언트 ID와 시크릿이 올바른지 확인하세요
- 포트 충돌: 다른 애플리케이션이 3001 포트를 사용하고 있는지 확인하세요
