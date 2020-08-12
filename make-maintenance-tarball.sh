#!/usr/bin/env bash
set -o errexit

red=`tput setaf 1`
green=`tput setaf 2`
reset=`tput sgr0`
die() { set +v; echo "$red$*$reset" 1>&2 ; exit 1; }

WGET_DEST='/tmp/hubmap-portal-maintenance'
wget --recursive http://localhost:5001/ --directory-prefix "$WGET_DEST" || die 'Server not running on port 5001.'
grep '"maintenance_mode": true' "$WGET_DEST"/localhost:5001/index.html || die 'Set "MAINTENANCE_MODE = True" in app.conf and restart.'

TAR_GZ='/tmp/hubmap-portal-maintenance.tar.gz'
cd "$WGET_DEST"
rm -rf hubmap-portal-maintenance
mv localhost:5001 hubmap-portal-maintenance
tar -czvf "$TAR_GZ" hubmap-portal-maintenance
echo "${green}Send $TAR_GZ to Bill.$reset" 