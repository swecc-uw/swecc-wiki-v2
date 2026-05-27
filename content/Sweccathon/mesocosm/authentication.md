---
aliases:
  - authentication
  - Authentication
---

# Authentication

Mesocosm supports **member** sessions (SWECC account) and **guest** sessions (short-lived, no account). Credentials are saved locally so you do not need to log in on every command.

## Member login

```bash
mesocosm auth login
```

- Prompts for **username** and **password** (no password flags on the CLI)
- Uses the SWECC API for login (default production: `https://api.swecc.org`)
- Saves a JWT and bench API URL to your credentials file

### Override server URL

```bash
mesocosm auth login --server-url https://api.swecc.org
```

With `MESOCOSM_LOCAL=1`, the default server URL is `http://127.0.0.1:8000` unless you set `SWECC_SERVER_URL`.

### After login

Credentials typically include:

- `mode`: `member`
- `token`: JWT for bench-api calls
- `server_url`, `bench_url`

Member auth is required for **teams**, **env submit**, and most account-scoped operations. Guests cannot use those commands.

## Print token for scripts

```bash
mesocosm auth token
```

Prints the saved member JWT to stdout (for `curl`, scripts, etc.). Requires a prior `auth login`; fails if you only have guest credentials.

## Guest session

```bash
mesocosm auth guest
```

Creates a short-lived guest session on the bench API — no SWECC account.

- Default bench URL: production `https://api.swecc.org/bench` unless you pass `--bench-url` or set `MESOCOSM_BASE_URL` / `SWECC_BENCH_URL`
- **Does not** use saved credentials or `MESOCOSM_LOCAL` for its default URL

Guests can run some platform commands (e.g. `run create` in guest mode) but **cannot** use `team *` or `env submit`.

## Who am I?

```bash
mesocosm auth whoami
```

Calls `GET /v1/me` and prints your principal as JSON.

Useful after login or guest to confirm the token and URL are correct. If connection fails, see [[mesocosm/troubleshooting|Troubleshooting]].

## Logout

```bash
mesocosm auth logout
```

Deletes the credentials file (default: `~/.config/swecc/bench_credentials.json`, or the path in `SWECC_BENCH_CREDENTIALS`).

## Non-interactive / CI

`auth login` always prompts; it is not suitable for unattended scripts.

**Option A — member JWT**

```bash
export SWECC_BENCH_TOKEN='your-member-jwt'
mesocosm run create ...
```

**Option B — guest**

```bash
mesocosm auth guest
# or
export SWECC_BENCH_GUEST_TOKEN='...'
```

## Credentials file

| Item | Detail |
| --- | --- |
| Default path | `~/.config/swecc/bench_credentials.json` |
| Override | `SWECC_BENCH_CREDENTIALS=/path/to/file.json` |
| Written by | `auth login`, `auth guest`, `team use`, `team create --use` |
| Cleared by | `auth logout` |

## Global `--bench-url`

Most commands accept a parent flag:

```bash
mesocosm auth whoami --bench-url https://api.swecc.org/bench
```

Resolution order for bench-api URL is documented in [[mesocosm/command-reference#global-configuration|Command reference — Global configuration]].

## Related

- [[mesocosm/teams|Teams]] — requires member auth
- [[mesocosm/submitting-environments|Submitting environments]] — requires member auth
- [[mesocosm/troubleshooting#authentication-issues|Troubleshooting — auth errors]]
- [[mesocosm/command-reference#authentication|Command reference — auth commands]]
