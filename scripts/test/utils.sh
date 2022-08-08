start() { echo "::group::$1"; }
end() { echo "::endgroup::"; }
die() { set +v; echo "$*" 1>&2 ; sleep 1; exit 1; }

copy_conf() {
  scripts/dev/copy-app-conf.sh || (
    echo 'app.conf before:'
    cat context/instance/app.conf
    echo 'Rewrite conf...'
    sed -i 's/TODO/FAKE/' context/instance/app.conf
    echo 'app.conf after:'
    cat context/instance/app.conf
  )
}

server_up() {
  TRIES=0
  MAX_TRIES=250
  URL=http://localhost:$1
  until curl --silent --fail $URL; do
    [ ${TRIES} -gt ${MAX_TRIES} ] && die "Server not running at $URL"
    printf '.'
    sleep 2
    TRIES=$(($TRIES+1))
  done
  echo "Server starts up, and $URL returns 200."
}