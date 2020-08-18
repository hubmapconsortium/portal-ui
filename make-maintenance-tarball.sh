#!/usr/bin/env bash
set -o errexit

red=`tput setaf 1`
green=`tput setaf 2`
reset=`tput sgr0`
die() { set +v; echo "$red$*$reset" 1>&2 ; exit 1; }

TAR_GZ='hubmap-portal-maintenance.tar.gz'

cd context && npm run build:maintain
cd app/static/js/maintenance/

tar -czvf "$TAR_GZ" public
mv "$TAR_GZ" public
echo "${green}Send $TAR_GZ in context/app/static/js/maintenance/public to Bill.$reset" 