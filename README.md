# stellar-pay-frontend

Read-only merchant dashboard for `stellar-pay`, an open-source XLM payment
infrastructure project. Built with Next.js (App Router), TypeScript, and
Tailwind CSS.

## Scope (v0.1)

This dashboard is read-only:

- Lists payments with status filtering and pagination.
- Shows a payment's detail view with a status timeline.
- Shows webhook delivery attempts for a payment.

Explicitly out of scope for v0.1:

- No payment-creation UI. Merchants integrate directly against the
  `stellar-pay-backend` API to create payments.
- No authentication. The backend has none in v0.1 either.

## Backend dependency

This app is a thin client over the `stellar-pay-backend` API and has no
shared code or database with it. It depends on these backend endpoints:

- `GET /v1/payments` (paginated list, optional `status` filter)
- `GET /v1/payments/:id` (single payment)
- `GET /v1/payments/:id/webhook-events` (webhook delivery attempts for a payment)
- `GET /health` (used by the header's live/offline indicator)

**`GET /v1/payments` and `GET /v1/payments/:id/webhook-events` are new
endpoints required by this dashboard and may not exist yet in the backend
repo**, since `stellar-pay-backend` is being built in parallel. The API
client here is written against the documented contract; nothing in this repo
assumes the backend is currently running.

## Setup

```bash
npm install
cp .env.example .env
```

Set `NEXT_PUBLIC_API_BASE_URL` in `.env` to point at a running
`stellar-pay-backend` instance (defaults to `http://localhost:3000`).

## Run

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Test

```bash
npm run test
```

Vitest + React Testing Library cover pure logic (`src/lib/format.ts`,
`src/lib/api.ts`) and the two components with real interactive logic
(`StatusBadge`, `CopyableAddress`). Server Components are left to manual QA
and a future Playwright pass rather than forced into React Testing Library.

## Lint

```bash
npm run lint
```
