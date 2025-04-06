# Base
FROM node:20.18.0 AS base
WORKDIR /home/perplexica
RUN apt-get update && apt-get install -y \
    python3 \
    build-essential \
    g++ \
    make \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*
RUN npm install -g bun@1.2.8
COPY package.json ./

# Production deps
FROM base AS prod-deps
WORKDIR /home/perplexica
ENV PYTHON=/usr/bin/python3
COPY bun.lock ./
RUN bun install --frozen-lockfile --production

FROM base AS dev-deps
WORKDIR /home/perplexica
COPY bun.lock ./
RUN bun install --frozen-lockfile

# Builder stage
FROM dev-deps AS builder
WORKDIR /home/perplexica
COPY tsconfig.json next.config.mjs next-env.d.ts postcss.config.js drizzle.config.ts tailwind.config.ts ./
COPY src ./src
COPY public ./public
COPY drizzle ./drizzle
RUN mkdir -p /home/perplexica/data
RUN bun run build

# Production stage
FROM prod-deps AS production
WORKDIR /home/perplexica
COPY --from=builder /home/perplexica/src/lib/db ./src/lib/db
COPY --from=builder /home/perplexica/drizzle.config.ts ./
COPY --from=builder /home/perplexica/drizzle ./drizzle
COPY --from=builder /home/perplexica/public ./public
COPY --from=builder /home/perplexica/.next/static ./public/_next/static
COPY --from=builder /home/perplexica/.next/standalone ./
COPY --from=builder /home/perplexica/data ./data
RUN mkdir -p /home/perplexica/uploads
EXPOSE 3000
CMD npm run db:migrate && node server.js
