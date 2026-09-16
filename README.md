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

## Architecture

Every page is an async Server Component that fetches directly from the
backend at request time (`cache: "no-store"`, see `src/lib/api.ts`) — there
is no client-side data-fetching library and no server-side database of its
own:

```
  browser
     |
     v
  Next.js App Router (Server Components, no client fetching)
     |
     |-- /                     src/app/page.tsx              -> listPayments()
     |-- /payments/[id]        src/app/payments/[id]/page.tsx -> getPayment() + getPaymentWebhookEvents()
     |
     v
  src/lib/api.ts  (fetch wrapper, runtime type guards, no `any`)
     |
     v
  stellar-pay-backend REST API   (GET /v1/payments, /v1/payments/:id, /v1/payments/:id/webhook-events, /health)
```

`src/lib/api.ts` is the only module that talks to the network. Every
response is parsed as `unknown` and narrowed with a hand-written type guard
(`isPayment`, `isListPaymentsResponse`, ...) before the caller ever sees it
typed — a malformed or unexpectedly-shaped backend response fails loudly as
an `ApiRequestError` instead of silently flowing through as `any`:

```ts
async function requestJson<T>(
  path: string,
  validate: (value: unknown) => value is T,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { ...buildHeaders(), ...init?.headers },
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await extractErrorMessage(response);
    throw new ApiRequestError({ message, status: response.status });
  }

  const data: unknown = await response.json();
  if (!validate(data)) {
    throw new ApiRequestError({ message: "Unexpected response shape from API", status: response.status });
  }

  return data;
}
```

### Route and component tree

```
src/app/
  page.tsx                      Payments list (reads ?status & ?page search params)
    -> StatusFilter              client component, writes the ?status search param
    -> PaymentsTable              -> StatusBadge (per-row status pill)
    -> PaginationControls
  payments/[id]/page.tsx        Payment detail
    -> PaymentDetailPanel         -> StatusTimeline, StellarTxLink, CopyableAddress
    -> WebhookEventsTable         -> WebhookStatusBadge
  layout.tsx                    -> HealthIndicator (polls GET /health)
  error.tsx / loading.tsx       route-level error and loading boundaries (+ per-detail-route variants)
```

The list page reads pagination and filter state straight from the URL
instead of client-side state, so a shared link reproduces the exact view:

```tsx
export default async function PaymentsPage({ searchParams }: PaymentsPageProps): Promise<ReactElement> {
  const params = await searchParams;
  const status = parseStatus(params.status);
  const page = parsePage(params.page);

  const response = await listPayments({ status, page, perPage: DEFAULT_PAGE_SIZE });

  return (
    <div className="flex flex-col gap-6 px-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Payments</h1>
        <StatusFilter />
      </div>
      <PaymentsTable payments={response.data} />
      <PaginationControls page={response.page} perPage={response.per_page} total={response.total} status={status} />
    </div>
  );
}
```

The detail page turns a `404` from the backend into Next.js's `notFound()`
rather than rendering a generic error state, and re-throws anything else for
the route's `error.tsx` boundary to catch:

```tsx
try {
  [payment, webhookEvents] = await Promise.all([getPayment(id), getPaymentWebhookEvents(id)]);
} catch (error) {
  if (error instanceof ApiRequestError && error.status === 404) {
    notFound();
  }
  throw error;
}
```

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
