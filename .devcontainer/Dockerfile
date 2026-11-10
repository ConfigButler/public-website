# Development container for the configbutler.ai website (Astro, static output).
#
# Modelled on the gitops-reverser devcontainer (external/gitops-reverser/.devcontainer):
# same user, same mounts, same SSH commit-signing helpers. It is a Node project, so the
# Go/Kubernetes toolchain is replaced by Node, Playwright and a docs linter.
#
# Pinned by digest so a rebuild is reproducible; bump version and digest together:
#   docker buildx imagetools inspect debian:trixie-slim
FROM debian:trixie-slim@sha256:a72b4433de1cf7d6bae0c4cee74d0547f58601a643b3375f070c51600d63b6b2

ENV DEBIAN_FRONTEND=noninteractive

# Run RUN steps under bash with pipefail so a failure anywhere in a
# `curl ... | gpg` pipeline aborts the build instead of silently continuing.
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# Tool versions - centralized for easy updates.
#
# Finding the latest versions:
# NODE_MAJOR -> https://github.com/nodejs/node/releases (track a current LTS line)
# PLAYWRIGHT_VERSION -> https://www.npmjs.com/package/@playwright/test?activeTab=versions
#   MUST equal the exact "@playwright/test" version in package.json: the browser builds
#   baked in below are tied to that version. post-create.sh warns when they drift.
# PLAYWRIGHT_BROWSERS -> space-separated subset of: chromium firefox webkit
# MARKDOWNLINT_CLI2_VERSION -> https://www.npmjs.com/package/markdownlint-cli2?activeTab=versions
ENV NODE_MAJOR=24 \
    PLAYWRIGHT_VERSION=1.65.0 \
    PLAYWRIGHT_BROWSERS="chromium" \
    MARKDOWNLINT_CLI2_VERSION=0.24.0 \
    PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

# Base packages, plus the apt repositories for gh and Node.js.
# openssh-client provides ssh-add/ssh-keygen, which the commit-signing helper needs.
# locales + en_US.UTF-8: VS Code forwards the host's LANG/LC_* into terminals, and a
# slim image only ships C.UTF-8, so every bash would warn "setlocale: cannot change
# locale" without it.
RUN apt-get update \
    && apt-get -y install --no-install-recommends \
    git \
    curl \
    ca-certificates \
    gnupg \
    openssh-client \
    sudo \
    vim \
    less \
    jq \
    yq \
    ripgrep \
    rsync \
    procps \
    bash-completion \
    locales \
    && sed -i 's/^# *\(en_US.UTF-8 UTF-8\)/\1/' /etc/locale.gen \
    && locale-gen \
    && install -m 0755 -d /etc/apt/keyrings \
    && curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg \
       -o /etc/apt/keyrings/githubcli-archive-keyring.gpg \
    && chmod a+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" \
       > /etc/apt/sources.list.d/github-cli.list \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
       | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && chmod a+r /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_${NODE_MAJOR}.x nodistro main" \
       > /etc/apt/sources.list.d/nodesource.list \
    && apt-get update \
    && apt-get -y install --no-install-recommends gh nodejs \
    && apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

# markdownlint-cli2 (structural markdown linter). The documentation corner will be
# markdown, and this is the same linter gitops-reverser runs on its docs.
RUN npm install -g "markdownlint-cli2@${MARKDOWNLINT_CLI2_VERSION}" \
    && npm cache clean --force

# Playwright browsers plus the system libraries they need (--with-deps runs apt).
# Baked into the image because the download is large and only changes with the
# Playwright version. The project's own @playwright/test finds them through
# PLAYWRIGHT_BROWSERS_PATH. word splitting of PLAYWRIGHT_BROWSERS is intended.
# hadolint ignore=SC2086
RUN npx -y "playwright@${PLAYWRIGHT_VERSION}" install --with-deps ${PLAYWRIGHT_BROWSERS} \
    && npm cache clean --force \
    && rm -rf /var/lib/apt/lists/* /root/.npm

# Silently load the optional repo-root .env into login shells (e.g. a GH_TOKEN).
# The single-quoted lines are written verbatim; build-time expansion must NOT happen.
# hadolint ignore=SC2016
RUN printf '%s\n' \
    '# Silently load the optional repo-root .env into login shells.' \
    'workspace_dir="${PROJECT_PATH:-}"' \
    'if [ -n "${workspace_dir}" ] && [ -f "${workspace_dir}/.env" ]; then' \
    '  set -a' \
    '  . "${workspace_dir}/.env"' \
    '  set +a' \
    'fi' \
    > /etc/profile.d/workspace-dotenv.sh \
    && chmod 0644 /etc/profile.d/workspace-dotenv.sh

# vscode user for non-root development, same uid/name as the gitops-reverser
# devcontainer so the shared named volumes (~/.claude, ~/.config/gh, ...) keep
# matching ownership across both projects. The browser directory is handed to
# vscode too, so `npx playwright install` works without sudo after a version bump.
RUN groupadd --gid 1000 vscode \
    && useradd --uid 1000 --gid vscode --shell /bin/bash --create-home vscode \
    && echo 'vscode ALL=(ALL) NOPASSWD:ALL' > /etc/sudoers.d/vscode \
    && chmod 0440 /etc/sudoers.d/vscode \
    && mkdir -p /workspaces /home/vscode/.npm /home/vscode/.claude /home/vscode/.codex \
       /home/vscode/.config/gh /home/vscode/persisted-home \
    && chown -R vscode:vscode /workspaces /home/vscode \
    && chown -R vscode:vscode "${PLAYWRIGHT_BROWSERS_PATH}"

WORKDIR /workspaces
USER vscode

ENV DEBIAN_FRONTEND=dialog

CMD ["/bin/bash"]
