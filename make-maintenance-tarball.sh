  
#!/usr/bin/env bash
set -o errexit

red=`tput setaf 1`
green=`tput setaf 2`
reset=`tput sgr0`
die() { set +v; echo "$red$*$reset" 1>&2 ; exit 1; }

TAR_GZ='hubmap-portal-maintenance.tar.gz'
OUTPUT_DIR='tmp/hubmap-portal-maintenance/'
PUBLIC_DIR='../../context/app/static/js/maintenance/public'

cd context && npm run build:maintain
cd -


mkdir -p "$OUTPUT_DIR"
cd "$OUTPUT_DIR"
rm -rf *
cp -r "$PUBLIC_DIR" .

tar -czvf "$TAR_GZ" public
echo "${green}Send $TAR_GZ to Bill.$reset" 