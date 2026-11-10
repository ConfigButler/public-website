#!/usr/bin/env bash

set -euo pipefail

log() {
  echo "[post-create] $*"
}

warn() {
  echo "[post-create] WARNING: $*" >&2
}

workspace_dir="${1:-${containerWorkspaceFolder:-${WORKSPACE_FOLDER:-$(pwd)}}}"
log "Using workspace directory: ${workspace_dir}"

# Git identity is developer personalization, not part of building a usable
# development environment, so its absence is reported and not fatal. Whatever
# created this container (VS Code copying the host Git config, a platform's own
# personalization step) may supply it before, during or after this hook.
git_name="$(git config --get user.name || true)"
git_email="$(git config --get user.email || true)"

if [ -z "${git_name}" ] && [ -n "${GIT_USER_NAME:-}" ]; then
  git_name="${GIT_USER_NAME}"
fi

if [ -z "${git_email}" ] && [ -n "${GIT_USER_EMAIL:-}" ]; then
  git_email="${GIT_USER_EMAIL}"
fi

if [ -n "${git_name}" ] && [ -z "$(git config --global --get user.name || true)" ]; then
  git config --global user.name "${git_name}"
fi

if [ -n "${git_email}" ] && [ -z "$(git config --global --get user.email || true)" ]; then
  git config --global user.email "${git_email}"
fi

if [ -z "${git_name}" ] || [ -z "${git_email}" ]; then
  warn "no Git identity yet. Set user.name and user.email, or provide GIT_USER_NAME and"
  warn "GIT_USER_EMAIL to the devcontainer environment. Commits need one; the rest of the"
  warn "environment does not, so setup continues."
fi

# Signing is not configured here. post-start.sh runs on every start, including
# the first one right after this hook, and that is where an SSH agent can
# actually be expected to exist.

if [ -d "${workspace_dir}" ]; then
  log "Fixing ownership for workspace and home directories"
  sudo chown -R vscode:vscode "${workspace_dir}" /home/vscode || true
else
  log "Workspace directory not found; fixing ownership for home only"
  sudo chown -R vscode:vscode /home/vscode || true
fi

cd "${workspace_dir}"

# Submodules (external/gitops-reverser, the source of the documentation corner).
# A clone made without --recurse-submodules leaves the directory empty; this checks
# out exactly the commit the website pins. It never moves the pin -- bumping it is a
# deliberate change, see the README. Non-fatal: it needs the network.
log "Checking out pinned submodules"
if ! git submodule update --init --recursive; then
  warn "could not check out submodules. Run 'git submodule update --init --recursive'"
  warn "once you have network; the site itself builds without them."
fi

# Node dependencies. `npm ci` installs exactly what package-lock.json records.
# Non-fatal for the same reason as above: the container is still usable without it.
log "Installing Node dependencies"
if ! npm ci --no-audit --no-fund; then
  warn "npm ci failed; run it by hand to see why."
fi

# The browsers in the image are built for one Playwright version. If package.json
# moved on without the Dockerfile following, tests fail with a confusing
# "Executable doesn't exist" error -- so say it plainly here instead.
if [ -f node_modules/@playwright/test/package.json ]; then
  project_pw="$(node -p "require('./node_modules/@playwright/test/package.json').version")"
  if [ "${project_pw}" != "${PLAYWRIGHT_VERSION:-}" ]; then
    warn "package.json uses @playwright/test ${project_pw}, but the image has browsers for"
    warn "${PLAYWRIGHT_VERSION:-<unknown>}. Set PLAYWRIGHT_VERSION=${project_pw} in .devcontainer/Dockerfile"
    warn "and rebuild, or for now run: npx playwright install ${PLAYWRIGHT_BROWSERS:-chromium}"
  else
    log "Playwright ${project_pw} matches the browsers in the image"
  fi
fi

# Persist the ~/.claude.json file by making it a symlink (this trick can be used for other potenial config file in the home folder as well)
touch /home/vscode/persisted-home/.claude.json
rm -f /home/vscode/.claude.json && ln -s /home/vscode/persisted-home/.claude.json /home/vscode/.claude.json

log "post-create completed"
