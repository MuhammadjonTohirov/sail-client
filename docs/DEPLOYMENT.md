# Deployment (Coolify)

The client is a **server-rendered Next.js (App Router) app** — every route is
`ƒ (Dynamic) server-rendered on demand`. It **cannot** be served as a static
site; it must run a Node process listening on port **3000**.

Deployment is done with the repo `Dockerfile`, which builds the app into Next.js
[standalone output](https://nextjs.org/docs/app/api-reference/next-config-js/output)
(`.next/standalone/server.js`) and runs `node server.js`.

## Coolify configuration

1. **Build Pack:** `Dockerfile` (not Nixpacks, not Static).
2. **Ports Exposes:** `3000`.
3. **Build-time variables** (Coolify → Environment Variables → mark as *Build
   Variable* / available at build):

   | Variable | Value |
   |---|---|
   | `NEXT_PUBLIC_API_URL` | `https://api.sail.uz` |
   | `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` | `sail2_bot` |

   > `NEXT_PUBLIC_*` values are **inlined into the client bundle at build time**.
   > If they are only set as runtime env vars they will be missing from the
   > browser bundle. The `Dockerfile` declares matching `ARG`s so Coolify passes
   > them through as build args.

4. Redeploy.

## Why a 502 / white screen happens

A blank page at https://sail.uz with `HTTP 502` from Caddy means the upstream on
port 3000 is **not responding** — the Next.js server isn't running. Caddy is up,
but it has nothing to proxy to. Typical causes when this app is otherwise healthy
locally:

- Build pack set to **Static** (the `try_files /index.html /index.php` Caddy
  label is the tell-tale) — no Node server is started.
- Nixpacks build **OOM-killed** on a small host (look for `Killed` in build logs).
- App not listening on port 3000 / wrong exposed port.

The `Dockerfile` approach removes all three by making the build and start command
explicit (`node server.js`, `EXPOSE 3000`, `HOSTNAME=0.0.0.0`).

## Verify a build locally

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://api.sail.uz \
  --build-arg NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=sail2_bot \
  -t sail-client:test .

docker run --rm -p 3001:3000 sail-client:test
curl -I http://localhost:3001/   # expect HTTP 200
```
