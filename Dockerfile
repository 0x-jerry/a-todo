FROM node:lts-alpine AS base
RUN npm install pnpm@9 -g

# ----------- build back-end
FROM base AS server
WORKDIR /app

COPY ./server /app

RUN pnpm i && pnpm run build

# ----------- prepare node_modules
FROM base AS pre-release
WORKDIR /app

COPY ./server /app
ENV NODE_ENV=production
RUN pnpm i

# ----------- finnal release
FROM node:lts-alpine AS release
WORKDIR /app

ENV NODE_ENV=production

COPY ./server/package.json /app/
COPY ./server/prisma /app/prisma
COPY ./server/docker /app/docker

COPY --from=server /app/generated /app/generated
COPY --from=server /app/dist /app/dist

COPY --from=pre-release /app/node_modules /app/node_modules

ENV DATABASE_URL='file:../data/db.sqlite'

EXPOSE 3560
ENTRYPOINT [ "sh", "docker/entrypoint.sh" ]
