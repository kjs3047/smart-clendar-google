# 🚨 Smart Calendar 문제 해결 가이드

이 문서는 Smart Calendar 개발 및 배포 과정에서 발생할 수 있는 문제들과 해결 방법을 정리한 문서입니다.

## 📋 목차

1. [TypeScript 스코프 오류 (Vercel 배포 실패)](#typescript-스코프-오류-vercel-배포-실패)
2. [데이터베이스 연결 문제](#데이터베이스-연결-문제)
3. [Google OAuth 인증 문제](#google-oauth-인증-문제)
4. [성능 및 네트워크 지연 문제](#성능-및-네트워크-지연-문제)
5. [일반적인 개발 오류](#일반적인-개발-오류)

---

## TypeScript 스코프 오류 (Vercel 배포 실패)

### 🔍 문제 증상
- 로컬 개발 환경(`npm run dev`)에서는 정상 작동
- Vercel 배포 시 TypeScript 컴파일 오류로 빌드 실패
- 에러 메시지: "Variable 'variableName' is used before being assigned"

### 🎯 근본 원인
```typescript
// ❌ 문제가 되는 코드 패턴
export async function POST(request: NextRequest) {
  return withAuth(request, async (req: AuthenticatedRequest) => {
    try {
      const { date, categoryId, subCategoryId, ...eventData } = await request.json();
      // ... 비즈니스 로직
    } catch (error) {
      console.error('Error details:', { 
        date, categoryId, subCategoryId, ...eventData  // ❌ 스코프 오류!
      });
    }
  });
}
```

**왜 이런 일이 발생하는가?**
1. **로컬 개발 모드**: `npm run dev` 실행 시 TypeScript 검사가 관대함
2. **프로덕션 빌드**: `npm run build` 실행 시 엄격한 TypeScript 컴파일
3. **변수 스코프**: try 블록 내에서 선언된 변수는 catch 블록에서 접근 불가

### ✅ 해결 방법

```typescript
// ✅ 올바른 코드 패턴
export async function POST(request: NextRequest) {
  return withAuth(request, async (req: AuthenticatedRequest) => {
    // 변수를 try 블록 외부에서 선언
    let date: string = '';
    let categoryId: string = '';
    let subCategoryId: string | null = null;
    let eventData: any = {};
    
    try {
      // 구조분해할당으로 값 할당
      ({ date, categoryId, subCategoryId, ...eventData } = await request.json());
      // ... 비즈니스 로직
    } catch (error) {
      console.error('Error details:', { 
        date, categoryId, subCategoryId, ...eventData  // ✅ 접근 가능!
      });
    }
  });
}
```

### 🔧 적용된 수정 사항

**수정된 파일들:**
- `app/api/v1/events/route.ts` - POST 메서드
- `app/api/v1/events/[eventId]/route.ts` - PUT, DELETE 메서드
- `app/api/v1/categories/route.ts` - PUT 메서드
- `app/api/v1/events/[eventId]/tasks/route.ts` - 태스크 관련 메서드
- `lib/errorHandler.ts` - 타입 안전성 개선

### 🛡️ 예방 방법

1. **배포 전 로컬 빌드 테스트**:
   ```bash
   npm run build  # 프로덕션 빌드 테스트
   ```

2. **TypeScript 컴파일 검사**:
   ```bash
   npx tsc --noEmit  # 타입 검사만 수행
   ```

3. **일관된 코딩 패턴 사용**:
   - 모든 API 라우트에서 동일한 변수 선언 패턴 적용
   - try 블록 외부에서 변수 선언, 내부에서 할당

---

## 데이터베이스 연결 문제

### 🔍 문제 증상
- "Database connection failed" 오류
- Prisma 클라이언트 초기화 실패
- API 호출 시 500 오류

### ✅ 해결 방법

1. **PostgreSQL 서비스 확인**:
   ```bash
   # Windows
   services.msc에서 PostgreSQL 서비스 확인
   
   # Linux/Mac
   sudo service postgresql status
   ```

2. **환경변수 확인**:
   ```env
   # .env.local
   DATABASE_URL="postgresql://username:password@host:port/database"
   ```

3. **데이터베이스 존재 확인**:
   ```sql
   CREATE DATABASE smart_calendar;
   ```

4. **Prisma 재생성**:
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

---

## Google OAuth 인증 문제

### 🔍 문제 증상
- "OAuth error: invalid_client" 오류
- 리디렉션 후 인증 실패
- 403 Forbidden 오류

### ✅ 해결 방법

1. **Google Cloud Console 설정 확인**:
   - OAuth 2.0 클라이언트 ID 생성
   - 승인된 리디렉션 URI: `http://localhost:3000/api/auth/google/callback`
   - Google+ API 활성화

2. **환경변수 확인**:
   ```env
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   GOOGLE_CALLBACK_URL="http://localhost:3000/api/auth/google/callback"
   ```

3. **프로덕션 환경 설정**:
   - Vercel 환경변수에 Google OAuth 정보 추가
   - 프로덕션 도메인을 Google Console에 추가

---

## 성능 및 네트워크 지연 문제

### 🔍 문제 증상
- 데이터 저장/조회가 느림 (350ms 이상)
- API 응답 지연
- 사용자 경험 저하

### 🎯 근본 원인
현재 아키텍처의 네트워크 홉:
```
사용자(한국) → Vercel(미국) → NAS PostgreSQL(한국)
```
**결과**: 태평양을 2번 횡단하는 지연

### ✅ 해결 방법

#### Option 1: Vercel Postgres 사용 (추천)
```
사용자(한국) → Vercel(미국) → Vercel Postgres(미국)
지연시간: 350ms → 105ms (70% 개선)
```

**장점**:
- 초고속 데이터베이스 연결
- 완전 관리형 서비스
- 무료 플랜 256MB 제공

**마이그레이션 방법**:
1. Vercel Dashboard → Storage → Create Postgres
2. 환경변수 자동 설정
3. `npx prisma migrate deploy`

#### Option 2: 현재 구조 최적화
1. **연결 풀링 최적화**:
   ```typescript
   // prisma/schema.prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. **배치 처리**:
   ```typescript
   // 개별 저장 (느림)
   await prisma.event.create(event1);
   await prisma.event.create(event2);
   
   // 배치 저장 (빠름)
   await prisma.event.createMany({
     data: [event1, event2]
   });
   ```

3. **캐싱 전략**:
   ```typescript
   // 자주 사용하는 데이터 캐싱
   const categories = cache.get('categories') || await prisma.category.findMany();
   ```

---

## 일반적인 개발 오류

### Prisma 생성 권한 오류 (Windows)
```
Error: EPERM: operation not permitted, rename
```

**해결 방법**:
- Windows Defender 실시간 검색 일시 비활성화
- 관리자 권한으로 터미널 실행
- 프로젝트 폴더를 바이러스 검사 제외 목록에 추가

### Hot Reload 작동 안함
**해결 방법**:
```bash
# Next.js 캐시 클리어
rm -rf .next
npm run dev
```

### 타입 오류 무시하고 빌드
```bash
# tsconfig.json 임시 수정
"strict": false,
"noUnusedLocals": false,
"noUnusedParameters": false
```

---

## 📞 문제 해결 체크리스트

### 배포 전 확인사항
- [ ] `npm run build` 로컬 테스트 성공
- [ ] `npx tsc --noEmit` 타입 검사 통과
- [ ] 환경변수 Vercel에 올바르게 설정
- [ ] 데이터베이스 연결 테스트 완료
- [ ] Google OAuth 프로덕션 설정 완료

### 문제 발생 시 디버깅 순서
1. 브라우저 개발자도구 Console 확인
2. Vercel Function Logs 확인
3. 데이터베이스 연결 상태 점검
4. 환경변수 설정 재확인
5. 로컬 환경에서 동일 오류 재현 시도

---

**💡 추가 문제가 발생하면 이 문서를 업데이트하여 팀 전체가 활용할 수 있도록 합니다.**