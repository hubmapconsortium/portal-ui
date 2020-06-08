FROM node:12.16.3-alpine as builder
WORKDIR /work
RUN apk add --no-cache python git
COPY . .
RUN npm install
RUN npm run build

FROM tiangolo/uwsgi-nginx-flask:python3.7

# NGINX should serve static content directly.
# https://github.com/tiangolo/uwsgi-nginx-flask-docker#custom-static-path
ENV STATIC_PATH /app/app/static

COPY --from=builder /work/app/static/public ${STATIC_PATH}/public

COPY requirements.txt /app
RUN pip install -r /app/requirements.txt

COPY . /app
