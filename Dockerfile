# 1단계: Node.js 환경에서 React 애플리케이션 빌드
FROM node:20-alpine AS build

# npm 6으로 다운그레이드
RUN npm install -g npm@6

# 작업 디렉토리 설정
WORKDIR /app

# package.json 및 package-lock.json 복사 및 의존성 설치
COPY package*.json ./
RUN npm ci && npm cache clean --force

# 소스 코드 복사 및 애플리케이션 빌드
COPY . .
RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build && gzip -r build/

# 2단계: Nginx로 정적 파일 서빙
FROM nginx:alpine

# Nginx 기본 경로의 기존 파일 삭제
RUN rm -rf /usr/share/nginx/html/*

# 1단계에서 빌드된 파일을 Nginx로 복사
COPY --from=build /app/build /usr/share/nginx/html

# 커스텀 Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 80 포트 개방
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
