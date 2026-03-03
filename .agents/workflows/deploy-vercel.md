---
description: Vercel을 사용한 Next.js 프로젝트 배포 방법
---

이 프로젝트를 Vercel에 배포하려면 다음 단계를 따르세요.

### 1단계: Vercel 계정 연결
1. [Vercel](https://vercel.com/) 홈페이지에 접속하여 GitHub 계정으로 로그인합니다.

### 2단계: 프로젝트 가져오기
1. Vercel 대시보드에서 **"Add New..."** 버튼을 클릭하고 **"Project"**를 선택합니다.
2. GitHub 저장소 목록에서 `shopping-review-chatbot`을 찾아 **"Import"** 버튼을 클릭합니다.

### 3단계: 환경 변수(Environment Variables) 설정
Vercel은 보안상 `.env` 파일을 읽지 않으므로, 프로젝트 설정 화면의 **"Environment Variables"** 섹션에서 다음 변수들을 직접 추가해야 합니다.

| Key | Value |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | 사용자의 Supabase URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | 사용자의 Supabase Public Key |
| `PINECONE_API_KEY` | 사용자의 Pinecone API Key |
| `OPENAI_API_KEY` | 사용자의 OpenAI API Key |

> [!IMPORTANT]
> 변수명을 오타 없이 정확히 입력해야 기능이 정상 작동합니다.

### 4단계: 배포 실행
1. 모든 설정을 마쳤다면 하단의 **"Deploy"** 버튼을 클릭합니다.
2. 빌드 프로세스가 완료될 때까지 기다립니다 (약 1~2분 소요).
3. 배포가 완료되면 생성된 URL을 통해 웹사이트에 접속할 수 있습니다.

### 5단계: (선택 사항) 도메인 연결
1. Vercel 프로젝트 설정의 **"Settings" > "Domains"** 메뉴에서 원하는 커스텀 도메인을 연결할 수 있습니다.
