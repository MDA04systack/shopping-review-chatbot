# 🔍 문제 해결 가이드 (Troubleshooting)

프로젝트 실행 중 발생할 수 있는 주요 문제와 해결 방법입니다.

### 1. 인증 오류 (Supabase)
- **증상**: 로그인이 되지 않거나 대시보드 접근이 거부됨.
- **해결**: `.env` 파일의 `NEXT_PUBLIC_SUPABASE_URL`과 `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`가 정확한지 확인하세요.

### 2. 인덱싱 실패 (Pinecone)
- **증상**: "인덱싱 실패" 메시지가 나타남.
- **해결**: 
    - `PINECONE_API_KEY`가 유효한지 확인하세요.
    - Pinecone 대시보드에서 `review-chatbot`이라는 이름의 인덱스가 생성되어 있는지 확인하세요.
    - 인덱스의 차원(Dimensions)이 사용하는 Embedding 모델과 일치해야 합니다.

### 3. AI 답변 지연 또는 오류 (OpenAI)
- **증상**: 챗봇이 답변을 생성하지 못하거나 시간이 오래 걸림.
- **해결**: 
    - `OPENAI_API_KEY`의 할당량이 남아있는지 확인하세요.
    - 네트워크 연결 상태를 확인하세요.

### 4. 빌드 오류
- **증상**: `npm run dev` 실행 시 에러 발생.
- **해결**: `node_modules` 폴더를 삭제하고 `npm install`을 다시 실행해 보세요.
