연습용 프로젝트

# 작동시키는법

1. 노드JS(Node 18이상)깔고 npm install
2. 루트 폴더에 .env 생성하고 다음 변수들 설정
   GITHUB_ID, GITHUB_SECRET: 깃허브 OAUTH ID, Secret
   SECRET: 토큰 해시용 값이니 알아서 만들기
   NEXTAUTH_URL: 인증서버 도메인, 로컬에서 실행할거면 http://localhost:3000
   DATABASE_URL: Prisma가 DB에 접속할 주소
3. npx prisma db push 실행해 DB 생성하기
4. npm run dev로 demonstration 가능

# 기술스택

- Next.js
- NextAuth.js
- TypeScript
- Prisma
- React-Query
