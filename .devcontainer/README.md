# Development Container

Development environment for the configbutler.ai website: Node 24, Astro (from `package.json`),
Playwright with a baked-in Chromium, `gh`, `markdownlint-cli2`, and SSH commit signing through the
host's SSH agent.

It follows the devcontainer of [gitops-reverser](../external/gitops-reverser/.devcontainer/), the
project this site documents: same `vscode` user, same named volumes, same signing helper. The Go,
Kubernetes and Docker tooling is left out, because a static Astro site needs none of it.

## Quick Start

### Prerequisites (Before Reopening In Container)

Commits are signed, and the key comes from your host's SSH agent. On the host:

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
ssh-add -L
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

If `ssh-add -L` shows no keys, commit signing inside the devcontainer will fail.

If the environment creating the devcontainer has no Git config to hand over, set `GIT_USER_NAME` and
`GIT_USER_EMAIL` in that environment instead; [`devcontainer.json`](./devcontainer.json) forwards
both through `${localEnv:...}` and `post-create.sh` writes them into the container's global Git
config. An existing Git config always wins over these variables.

### VS Code

1. Install the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
2. Open the project in VS Code: `code .`
3. Press `F1` and run `Dev Containers: Reopen in Container`
4. Wait for the initial build to finish. `post-create.sh` checks out the submodule and runs `npm ci`.

### Verify

```bash
node --version
npx astro --version
npx playwright --version
npm run test:e2e
gh --version
git submodule status
git config --get gpg.format   # ssh
ssh-add -L
```

## What Runs When

| Hook | Script | Does |
| --- | --- | --- |
| image build | [`Dockerfile`](./Dockerfile) | Node, gh, markdownlint, Playwright browsers and their system libraries |
| first create | [`post-create.sh`](./post-create.sh) | Git identity, ownership, `git submodule update --init`, `npm ci`, Playwright version check, persisted `~/.claude.json` |
| every start | [`post-start.sh`](./post-start.sh) | Refreshes commit signing via [`sync-signing-key.sh`](./sync-signing-key.sh) |

Network-dependent steps (submodule, `npm ci`) warn instead of failing, so the container always comes
up and the step can be rerun by hand.

## Mounts

| Volume | Path | Shared with gitops-reverser |
| --- | --- | --- |
| `claudeconfig` | `~/.claude` | yes |
| `codexconfig` | `~/.codex` | yes |
| `ghconfig` | `~/.config/gh` | yes |
| `persisted-home` | `~/persisted-home` (holds `~/.claude.json`) | yes |
| `configbutler-website-npmcache` | `~/.npm` | no |

The shared names are deliberate: log in to Claude, Codex or `gh` once and both devcontainers keep
it across rebuilds.

## SELinux (Fedora, RHEL)

With SELinux enforcing and `dockerd --selinux-enabled`, a container runs as `container_t` and may
not read files labelled `user_home_t`, which is everything under your home directory. A plain bind
mount therefore gives "Permission denied" on every project file, and the host shows SELinux alerts.

The workspace is mounted with `:Z` instead, in `runArgs`, because Docker's `--mount` syntax (which
`workspaceMount` uses) cannot express it; `workspaceMount` is set to `""` so the Dev Containers CLI
adds no mount of its own. `:Z` relabels **only this folder** to `container_file_t` with a pair of
SELinux categories unique to this container:

```text
folder:    system_u:object_r:container_file_t:s0:c103,c969
container: system_u:system_r:container_t:s0:c103,c969
```

So the container reads its workspace and nothing else in your home, other containers cannot read
the workspace, and your own (unconfined) host user keeps full access. Hosts without SELinux ignore
the option.

What this deliberately avoids:

- `--security-opt label=disable` switches SELinux confinement off for the whole container.
- The `audit2allow` / `semodule` module the SELinux alert suggests would let **every** container
  read **all** of your home directory.

Practicalities:

- The relabel happens when the container is created, so changing it needs **Rebuild Container**,
  not just a reopen. Each rebuild picks new categories and relabels again; for this repo that is
  quick.
- New files inherit the folder's label. A file *moved* in from elsewhere keeps its old label and is
  unreadable in the container until the next rebuild, or `chcon -R --reference=. <path>` on the host.
- To undo the relabel on the host: `restorecon -R <repo path>`.

Check from the host with `ls -Zd .` and `docker inspect -f '{{.ProcessLabel}}' <container>`.

## Playwright

The image installs Playwright's browsers into `/ms-playwright` (`PLAYWRIGHT_BROWSERS_PATH`) at
`PLAYWRIGHT_VERSION`. Those browser builds belong to one Playwright release, so **the version in the
Dockerfile must equal the exact `@playwright/test` version in `package.json`**. `post-create.sh`
warns when they differ.

To upgrade Playwright:

1. `npm install -D --save-exact @playwright/test@<version>`
2. Set `PLAYWRIGHT_VERSION=<version>` in the [`Dockerfile`](./Dockerfile)
3. Rebuild the container

Only Chromium is installed. To add Firefox or WebKit, extend `PLAYWRIGHT_BROWSERS` in the Dockerfile
and add a project in [`playwright.config.ts`](../playwright.config.ts).

`devcontainer.json` gives the container `--shm-size=2g` (Chromium crashes on Docker's 64MB
default) and `--init` (reaps browser child processes).

## How SSH Signing Works Here

The devcontainer uses SSH commit signing, not GPG keyring-based signing. Most of it is plain Git
configuration:

```bash
commit.gpgsign=true                    # every commit is signed
gpg.format=ssh                         # signed with an SSH key
gpg.ssh.defaultKeyCommand="ssh-add -L" # the key comes from the live agent
```

Git signs with whatever the agent currently holds, and refuses to commit when it holds nothing.
No key is cached, so nothing goes stale when a reconnect changes the forwarded socket.

[`sync-signing-key.sh`](./sync-signing-key.sh) applies that baseline and writes
`~/.config/git/allowed_signers` so `git log --show-signature` can verify. If an agent key's comment
contains your Git email, that key is pinned as `user.signingkey`. A `user.signingkey` configured by
something else is never replaced. The full rationale is in the
[gitops-reverser devcontainer README](../external/gitops-reverser/.devcontainer/README.md).

### Keeping The Signing Scripts In Sync

`sync-signing-key.sh` and `test-signing.sh` are verbatim copies from gitops-reverser. After bumping
the submodule, check for upstream fixes:

```bash
diff .devcontainer/sync-signing-key.sh external/gitops-reverser/.devcontainer/sync-signing-key.sh
diff .devcontainer/test-signing.sh external/gitops-reverser/.devcontainer/test-signing.sh
```

Copy any changes over, then run `bash .devcontainer/test-signing.sh`, which tests the helper against
a disposable key and agent.

## Optional `.env` for `gh`

A repo-root `.env` is optional. If present, login shells export its variables via
`/etc/profile.d/workspace-dotenv.sh`, for example a fine-grained `GH_TOKEN`. It is gitignored.
Alternatively run `gh auth login` once; `~/.config/gh` is a named volume, so it survives rebuilds.

## Troubleshooting

### Commit Signing Fails

```bash
ssh-add -L
git config --get commit.gpgsign
git config --get gpg.ssh.defaultKeyCommand
bash .devcontainer/sync-signing-key.sh
```

Typical error when no key is reachable:

```text
fatal: either user.signingkey or gpg.ssh.defaultKeyCommand needs to be configured
```

Common causes: no host `ssh-agent`, no key loaded into it, or `user.email` missing.

### Playwright: "Executable doesn't exist"

The `@playwright/test` version and `PLAYWRIGHT_VERSION` in the Dockerfile differ. Align them and
rebuild, or as a stopgap run `npx playwright install chromium`.

### "Permission denied" On Every Project File, SELinux Alerts On The Host

The workspace was mounted without the `:Z` relabel, for example by a container created before this
was added. Run `Dev Containers: Rebuild Container`. See [SELinux](#selinux-fedora-rhel).

### `external/gitops-reverser` Is Empty

```bash
git submodule update --init --recursive
```

## Files

- [`Dockerfile`](./Dockerfile) - Container image
- [`devcontainer.json`](./devcontainer.json) - Devcontainer configuration
- [`post-create.sh`](./post-create.sh) - Initial bootstrap
- [`post-start.sh`](./post-start.sh) - Per-start refresh
- [`sync-signing-key.sh`](./sync-signing-key.sh) - SSH signing refresh helper (from gitops-reverser)
- [`test-signing.sh`](./test-signing.sh) - Tests for the signing helper (from gitops-reverser)
