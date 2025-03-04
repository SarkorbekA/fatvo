# Stage 1: Dependencies installation
FROM node:23-alpine AS deps
RUN apk add --no-cache libc6-compat curl
WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm install --force; \
    elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm install --frozen-lockfile; \
    else echo "Lockfile not found." && exit 1; \
    fi

# Stage 2: Build the application
FROM node:23-alpine AS builder
WORKDIR /app
COPY . . 
RUN apk add --no-cache curl
RUN npm install --force
RUN npm install --unsafe-perm -g sharp

ENV NEXT_TELEMETRY_DISABLED 1
ENV NEXT_SHARP_PATH=/tmp/node_modules/sharp

RUN npm run build

# Stage 3: Prepare the production environment
FROM node:23-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV NEXT_SHARP_PATH=/tmp/node_modules/sharp

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next/standalone ./

USER nextjs

CMD ["node", "server.js"]
