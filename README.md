# 🛒 쇼핑 리뷰 분석 챗봇 (Shopping Review Analysis Bot)

AI를 활용하여 수천 개의 쇼핑 리뷰를 분석하고 핵심 정보를 요약해주는 스마트 챗봇 서비스입니다. 광고성 리뷰를 거르고 구매에 필요한 진짜 정보를 한눈에 확인하세요.

---

## 🚀 주요 기능
- **AI 리뷰 분석**: RAG(Retrieval-Augmented Generation) 기술을 사용하여 실제 리뷰 데이터를 바탕으로 사용자 질문에 답변합니다.
- **데이터 인덱싱**: 샘플 리뷰 데이터를 Pinecone 벡터 데이터베이스에 실시간으로 인덱싱하여 분석 준비를 마칩니다.
- **맞춤형 대화**: 특정 상품을 선택하여 해당 상품의 장단점, 배터리 성능, 배송 만족도 등 구체적인 정보를 물어볼 수 있습니다.
- **실시간 인증 시스템**: Supabase를 통한 안전한 로그인/회원가입 및 대시보드 접근 권한 관리를 제공합니다.

## 🛠 기술 스택
- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Backend / Auth**: [Supabase](https://supabase.com/)
- **AI / Vector DB**: [OpenAI](https://openai.com/), [Pinecone](https://www.pinecone.io/), [LangChain](https://js.langchain.com/)
- **Language**: TypeScript

## 📋 사전 요구 사항
- [Node.js](https://nodejs.org/) (v18 이상 권장)
- Supabase 프로젝트 (URL 및 API Key)
- OpenAI API Key
- Pinecone API Key (및 Index 설정)

## ⚙️ 설치 및 시작 방법
1. **저장소 클론**
   ```bash
   git clone https://github.com/MDA04systack/shopping-review-chatbot.git
   cd shopping-review-chatbot
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **환경 변수 설정**
   `.env` 파일을 루트 디렉토리에 생성하고 다음 내용을 입력합니다:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_key
   PINECONE_API_KEY=your_pinecone_key
   OPENAI_API_KEY=your_openai_key
   ```

4. **개발 서버 실행**
   ```bash
   npm run dev
   ```
   브라우저에서 `http://localhost:3000`으로 접속합니다.

## 💡 사용 예시
1. **로그인**: 회원가입 후 로그인을 진행합니다.
2. **데이터 준비**: 대시보드 왼쪽의 `샘플 데이터 인덱싱` 버튼을 클릭하여 리뷰 데이터를 준비합니다.
3. **질문하기**: 검색창에 "이 제품의 배터리 성능은 어때요?" 또는 "실제 구매자들의 가장 큰 불만은 무엇인가요?"와 같이 질문합니다.

## 🔍 추가 정보
- [문제 해결 가이드 (Troubleshooting)](./docs/troubleshooting.md)
- [변경 로그 (Changelog)](./docs/changelog.md)

## 🤝 지원 및 문의
- 버그 보고나 기능 제안은 [GitHub Issues](https://github.com/MDA04systack/shopping-review-chatbot/issues) 게시판을 이용해 주세요.

---
© 2026 Shopping Review Analysis Bot. All rights reserved.
