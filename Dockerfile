FROM node:18.16.0-alpine AS install
ENV SKIP_ENV_VALIDATION=1
ENV CYPRESS_INSTALL_BINARY=0
COPY libc6-compat-1.2.4-r0.apk ./libc6-compat-1.2.4-r0.apk
RUN apk add --allow-untrusted libc6-compat-1.2.4-r0.apk
WORKDIR /install
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build
RUN npm prune --production

FROM node:18.16.0-alpine AS run
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
USER nodejs
COPY --from=install --chown=nodejs:nodejs /install/node_modules ./node_modules
COPY --from=install --chown=nodejs:nodejs /install/.next ./.next
COPY --from=install --chown=nodejs:nodejs /install/public ./public
COPY --from=install --chown=nodejs:nodejs /install/next.config.mjs ./next.config.mjs
COPY --from=install --chown=nodejs:nodejs /install/package.json ./package.json
CMD [ "npm", "run", "start" ]
