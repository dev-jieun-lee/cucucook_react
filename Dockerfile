# 1. Node.js 20 버전의 경량화된 alpine 이미지를 사용
FROM node:20-alpine

# 2. 애플리케이션의 루트 디렉토리 설정
WORKDIR /app

# 3. package.json 및 package-lock.json 복사
COPY package*.json ./

# 4. npm 의존성 설치
RUN npm install --production

# 5. 소스 코드 전체를 복사
COPY . .

# 6. 애플리케이션 빌드
RUN npm run build

# 7. 필요한 포트 개방
EXPOSE 3000

# 8. 환경 변수 설정 (메모리 최적화)
ENV NODE_OPTIONS="--max-old-space-size=2048"

# 9. 애플리케이션 시작 명령어
CMD [ "npm", "start" ]
