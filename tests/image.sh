#!/usr/bin/env bash
# Black-box test of the container image (Dockerfile + nginx/default.conf).
#
#   tests/image.sh                         # build from the repo, test, clean up
#   IMAGE=ghcr.io/foo/bar:tag tests/image.sh   # test an existing image
set -euo pipefail
cd "$(dirname "$0")/.."

PORT="${PORT:-18088}"
CONTAINER="site-image-test-$$"
IMAGE="${IMAGE:-}"
BUILT_IMAGE=""

cleanup() {
    docker rm -f "$CONTAINER" >/dev/null 2>&1 || true
    [ -n "$BUILT_IMAGE" ] && docker rmi "$BUILT_IMAGE" >/dev/null 2>&1 || true
}
trap cleanup EXIT

if [ -z "$IMAGE" ]; then
    BUILT_IMAGE="site-image-test:$$"
    IMAGE="$BUILT_IMAGE"
    echo "==> docker build -> $IMAGE"
    docker build -q -t "$IMAGE" . >/dev/null
fi

echo "==> running $IMAGE on :$PORT"
docker run -d --name "$CONTAINER" -p "$PORT:8080" "$IMAGE" >/dev/null
base="http://localhost:$PORT"

for _ in $(seq 1 30); do
    curl -fsS -o /dev/null "$base/" 2>/dev/null && break
    sleep 0.5
done

fail=0
pass() { printf '  ok   %s\n' "$1"; }
bad()  { printf '  FAIL %s\n' "$1"; fail=1; }

assert_status() {
    local got
    got=$(curl -s -o /dev/null -w '%{http_code}' "$base$1")
    [ "$got" = "$2" ] && pass "$1 -> $got" || bad "$1 -> $got (want $2)"
}

# 2xx with no Location header: nothing can leak the internal :8080.
assert_served_directly() {
    local headers code loc
    headers=$(curl -s -D - -o /dev/null "$base$1")
    code=$(printf '%s' "$headers" | awk 'NR==1{print $2}')
    loc=$(printf '%s' "$headers" | grep -i '^location:' || true)
    if [ "${code:0:1}" = "2" ] && [ -z "$loc" ]; then
        pass "$1 served directly ($code)"
    else
        bad "$1 want direct 2xx, got code=$code location='$loc'"
    fi
}

# Capture first; piping curl into `grep -q` flakes under pipefail (SIGPIPE).
assert_body_contains() {
    local body
    body=$(curl -s "$base$1")
    [[ "$body" == *"$2"* ]] && pass "$1 contains '$2'" || bad "$1 missing '$2'"
}

echo "== status =="
assert_status "/"                       200
assert_status "/robots.txt"             200
assert_status "/sitemap.xml"            200
assert_status "/does-not-exist-xyz123"  404

echo "== pretty URLs, no redirect =="
for p in /about /about/ /gitops /gitops/ /technology /technology/; do
    assert_served_directly "$p"
done

echo "== real pages =="
assert_body_contains "/"       "ConfigButler"
assert_body_contains "/about"  "ConfigButler"

echo
[ "$fail" -eq 0 ] || { echo "IMAGE TESTS FAILED" >&2; exit 1; }
echo "ALL IMAGE TESTS PASSED"
