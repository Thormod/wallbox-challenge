FROM node:fermium-alpine AS base
WORKDIR "/app"
FROM base AS deps
COPY package.json /app/
COPY package-lock.json /app/
ARG NPMRC  
RUN echo ${NPMRC} > .npmrc && npm ci && rm -f .npmrc
FROM deps AS prodbase
COPY . /app/
RUN npm ci --only=production
FROM deps AS dev
COPY . /app/
RUN npm run build
FROM prodbase AS prod
COPY config/config.js /app/config/config.js
COPY --from=dev --chown=node /app/dist/ /app/dist/
COPY --from=prodbase --chown=node /app/node_modules/ /app/node_modules/
COPY --from=dev --chown=node /app/tsconfig.json /app/tsconfig.json
USER node
CMD ["node", "dist/src/main.js"]
EXPOSE 3000
