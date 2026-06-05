# Deployment (Coolify)

The client is a **server-rendered Next.js (App Router) app** — every route is
`ƒ (Dynamic) server-rendered on demand`. It **cannot** be served as a static
site; it must run a Node process listening on port **3000**.

Deployment is done with the repo `Dockerfile`, which builds the app into Next.js
[standalone output](https://nextjs.org/docs/app/api-reference/next-config-js/output)
(`.next/standalone/server.js`) and runs `node server.js`.

---

## Deploying a change (day-to-day runbook)

This is everything you need to ship a change. The Coolify project is **already
configured** — you do not touch any settings. You only push code and watch it go
live.

### How a deploy works (the mental model)

You don't build or upload anything by hand. You push your code to the `main`
branch on GitHub, and **Coolify** (our deployment server) does the rest:

1. Coolify pulls the latest `main`.
2. It builds the app inside Docker using the repo's `Dockerfile`.
3. It starts the new container and switches traffic over to it.

The live site is **https://sail.uz**. The backend it talks to is
**https://api.sail.uz**.

### Step 1 — Get your change onto `main`

> Never commit secrets. Only `NEXT_PUBLIC_*` values are safe in this repo, and
> they are already set in Coolify — you don't add them here.

```bash
# Make sure you're up to date first
git checkout main
git pull origin main

# ... make your code changes ...

git add .
git commit -m "Describe what you changed"
git push origin main
```

That's it from your side — the push is what triggers a deploy.

> If your team uses pull requests, open a PR instead of pushing straight to
> `main`. The deploy fires when the PR is **merged into `main`**.

### Step 2 — Watch the deploy in Coolify

1. Open Coolify and go to the **sail-client** application.
2. Open the **Deployments** tab. A new deployment should appear within a few
   seconds of your push. (If it doesn't auto-start, click **Redeploy** — that
   manually triggers the exact same process.)
3. Click the running deployment to watch the **build logs** live.
4. Wait for it to finish. A good build ends with the Next.js route table and the
   status turns **green / “Running”**. The whole thing usually takes 1–3 minutes.

### Step 3 — Verify the site is actually up

Don't trust “green” alone — open the site and confirm:

1. Visit **https://sail.uz** in a browser (use a hard refresh: `Cmd/Ctrl+Shift+R`).
2. The home page should load normally — not a blank/white page.
3. Quick terminal check (expects `HTTP/2 200`):

   ```bash
   curl -I https://sail.uz/
   ```

If you see `200`, you're done. 🎉

### If something goes wrong

| What you see | What it usually means | What to do |
|---|---|---|
| `HTTP 502` / white page | The new container failed to start | Open the deployment’s **build logs** in Coolify and read the error |
| Build log says `Killed` | The server ran out of memory mid-build | Tell a senior dev — the host may need more RAM/swap |
| Site loads but data is missing/broken | The app can’t reach the API | Check `https://api.sail.uz` is up; confirm the page’s Network tab calls the right URL |
| Page looks like old code | Browser cache | Hard refresh (`Cmd/Ctrl+Shift+R`) |

**Rolling back:** Coolify keeps previous deployments. To undo a bad release, open
the **Deployments** list, find the last good one, and click **Redeploy** on it.

### Optional — test the production build on your own machine first

If you want to be sure before pushing, build the exact same Docker image Coolify
builds and run it locally (see [Verify a build locally](#verify-a-build-locally)
below). This catches build errors without waiting on a deploy.

---

## Coolify configuration

> ✅ **Already done** — this is reference only. A junior dev deploying a change
> does **not** need to set any of this.

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
