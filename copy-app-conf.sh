#!/usr/bin/env bash
APP_INSTANCE="context/instance"
APP_CONF="$APP_INSTANCE/app.conf"

if [ ! -e $APP_CONF ]; then
  mkdir -p "$APP_INSTANCE"
  cp example-app.conf "$APP_CONF"
else
  echo "Using existing $APP_CONF."
fi

grep 'TODO' "$APP_CONF" && die "Replace 'TODO' in $APP_CONF."
