FROM node:22-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install

COPY . .

RUN if [ -f prisma/schema.prisma ]; then npx prisma generate 2>/dev/null || true; fi

EXPOSE 3000

CMD ["pnpm", "dev"]
