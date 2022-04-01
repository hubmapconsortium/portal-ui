start() { echo "::group::$1"; }
end() { echo "::endgroup::"; }
die() { set +v; echo "$*" 1>&2 ; sleep 1; exit 1; }
