# Web Client (Next.js)

Quick start
- Prereq: Node 20+, pnpm or npm. Server running on http://localhost:8080
- Setup:
  - cd web_client
  - cp .env.example .env.local
  - pnpm install  # or npm install / yarn install
  - pnpm dev      # or npm run dev

Env vars
- NEXT_PUBLIC_API_BASE_URL=http://localhost:8080

Key flows
- Auth (OTP): /auth/otp — request + verify; stores JWT locally.
- Search: /search — query + basic filters; opens detail.
- Post listing: /post — pick category + fill details + attributes; creates listing; then upload photos.
- My listings: /u/listings — view your listings, bump, upload photos.

Internationalization
- Locales: ru (default), uz.
- Next.js i18n subpaths enabled; use header toggle to switch.

Notes
- Tokens are stored in localStorage for simplicity. For production, switch to httpOnly cookies + SSR-aware auth.
