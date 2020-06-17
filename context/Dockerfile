FROM node:12.16.3-alpine as builder
WORKDIR /work
RUN apk add --no-cache python git

# COPY only what is needed so layers can be cached.
COPY package.json .
COPY package-lock.json .

RUN npm install
# TODO: Get rid of prepublish... wget the prov-vis schema shouldn't be necessary. See PR #232.
RUN npm run prepublish

COPY . .
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build

FROM tiangolo/uwsgi-nginx-flask:python3.7

# NGINX should serve static content directly.
# https://github.com/tiangolo/uwsgi-nginx-flask-docker#custom-static-path
ENV STATIC_PATH /app/app/static

COPY --from=builder /work/app/static/public ${STATIC_PATH}/public

COPY requirements.txt /app
RUN pip install -r /app/requirements.txt

COPY . /app
