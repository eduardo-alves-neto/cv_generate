# Feature Specification: Auth, Billing, and Conversion History

**Feature Branch**: `006-auth-billing-history`
**Created**: 2026-04-11
**Status**: Draft
**Input**: User description: "login e um histórico temporário dos currículos (caso tenha plano pago), adicionar cobranças para quem for usar — R$2 por conversão como referência de preço justo"

---

## Context & Motivation

The current application is completely anonymous and free — every user gets unlimited conversions with no persistence. This feature introduces:

1. **User accounts** — registration + login, required for paid usage and history.
2. **Billing** — a credit-based pay-per-use model (R$2/conversion) and a monthly subscription (R$9,90/month) via Mercado Pago (PIX + cartão de crédito).
3. **Conversion history** — paid users can re-download their last N conversions for up to 30 days (credits) or 90 days (subscription).

This is an **architecture-level change**: the application gains a database, an authentication layer, and a payment integration for the first time.

---

## Business Rules

### Plans

| Plan | Price | Free Conversions | Paid Conversions | History Retention |
|---|---|---|---|---|
| **Gratuito** | R$0 | 3 lifetime (per account) | — | None |
| **Créditos** | R$2,00 per credit | — | 1 credit = 1 conversion | 30 days |
| **Mensal** | R$9,90/month | — | Unlimited | 90 days |

### Credit bundles (avulso)

| Bundle | Price | Savings |
|---|---|---|
| 1 crédito | R$2,00 | — |
| 5 créditos | R$9,50 | R$0,50 |
| 10 créditos | R$17,90 | R$2,10 |
| 20 créditos | R$32,00 | R$8,00 |

### Conversion quota enforcement

- Free quota is per **user account**, not per IP — account creation is required to unlock the 3 free conversions.
- Unauthenticated users MUST register before performing any conversion.
- A paid conversion is only deducted after the conversion completes successfully — failed or timed-out conversions do NOT consume a credit.
- A subscribed user's monthly limit resets on the calendar anniversary of their first payment date.

### History retention

- PDFs are stored server-side and available for re-download.
- After the retention window expires, the PDF file is deleted from storage and the history entry is marked `expired` (title and date remain visible, download is disabled).
- Cancelling a subscription does not immediately delete history — the retention window applies from the *conversion date*, not the cancellation date.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Registration and Login (Priority: P1)

A job seeker visits the site for the first time. They see the conversion form but it prompts them to create an account before converting. They register with an e-mail address and password, verify their e-mail via a one-click link, and are redirected back to the conversion form — now logged in with 3 free conversions available.

**Why this priority**: Authentication gates every other story in this feature. Without a working auth system, billing and history cannot be tested.

**Independent Test**: Navigate to the app without an account. Fill out the conversion form and click "Converter". Verify that a registration modal or redirect appears. Complete registration + e-mail verification. Verify that the session is established and the form is accessible.

**Acceptance Scenarios**:

1. **Given** an unauthenticated user attempts to submit the conversion form, **When** they click "Converter", **Then** a modal or redirect prompts them to log in or create an account, and the conversion does not proceed.
2. **Given** a new user submits the registration form with a valid e-mail and password (min 8 characters), **When** the form is submitted, **Then** a verification e-mail is sent and the UI shows a "check your e-mail" message.
3. **Given** the user clicks the verification link in the e-mail, **When** the link is valid and not expired (24-hour TTL), **Then** their account is activated and they are redirected to the app, logged in.
4. **Given** a verified user submits the login form with correct credentials, **When** login completes, **Then** a session is established and persists across page reloads (refresh token in httpOnly cookie).
5. **Given** a logged-in user clicks "Sair", **When** logout completes, **Then** the session is invalidated server-side and the UI returns to the unauthenticated state.
6. **Given** a user attempts to register with an already-used e-mail, **When** the form is submitted, **Then** a clear error informs them the account already exists, with a link to the login page.

---

### User Story 2 — Free Conversions (Priority: P2)

A newly registered user performs their first conversion. The top of the page shows "3 conversões gratuitas restantes". They complete a conversion successfully and the counter drops to 2. After using all 3, the "Converter" button is replaced by a prompt to purchase credits or subscribe.

**Why this priority**: The free tier drives acquisition and validates the core experience before asking for payment. It must work correctly before billing can be built on top.

**Independent Test**: Register a fresh account. Perform 3 conversions. On the 4th attempt, verify the paywall is shown instead of a progress indicator.

**Acceptance Scenarios**:

1. **Given** a new verified user, **When** they view the conversion form, **Then** a counter shows "3 conversões gratuitas restantes".
2. **Given** a free-tier user completes a successful conversion, **When** the success screen appears, **Then** the counter decrements by 1.
3. **Given** a free conversion fails (network error, AI error), **When** the error is displayed, **Then** the counter does NOT decrement.
4. **Given** a user has used all 3 free conversions, **When** they attempt another conversion, **Then** the submit action is blocked and a paywall CTA is shown ("Comprar créditos" / "Assinar por R$9,90/mês").
5. **Given** a free-tier user completes a conversion, **When** they view the success screen, **Then** no history entry is saved and no re-download link from history is shown (the immediate session download still works).

---

### User Story 3 — Purchasing Credits (Priority: P3)

A user who has used their free conversions wants to buy 5 credits for R$9,50. They click "Comprar créditos", choose the 5-credit bundle, and are presented with a PIX QR code. They pay via their banking app. Within a few seconds, the page updates to show "5 créditos disponíveis" and they can resume converting.

**Why this priority**: Credits are the primary revenue path. PIX is the most-used payment method in Brazil and has near-instant confirmation.

**Independent Test**: Trigger the credit purchase flow from the paywall CTA. Select the 1-credit bundle (R$2,00). Complete a Mercado Pago sandbox PIX payment. Verify the credit appears on the account without page reload.

**Acceptance Scenarios**:

1. **Given** a user opens the credit purchase screen, **When** they select a bundle and confirm, **Then** a Mercado Pago PIX QR code and copy-paste key are displayed with a 30-minute expiry countdown.
2. **Given** the user pays the PIX, **When** Mercado Pago sends the webhook, **Then** the credits are added to their account within 10 seconds and the UI updates without requiring a page refresh.
3. **Given** the 30-minute PIX window expires without payment, **When** the timer reaches zero, **Then** the QR code is marked invalid and the user is prompted to generate a new one.
4. **Given** a user with an active Mercado Pago checkout navigates away and returns, **When** they open the purchase flow again, **Then** the existing pending payment is shown (not a new one), preventing duplicate charges.
5. **Given** a credit purchase completes, **When** a conversion is subsequently performed and succeeds, **Then** the credit balance decrements by 1.

---

### User Story 4 — Monthly Subscription (Priority: P4)

A user in active job search decides the R$9,90/month plan is better value. They subscribe via cartão de crédito. Their credit balance is no longer shown — instead the UI shows "Plano Mensal Ativo" with the renewal date. They can convert without limits and their history is retained for 90 days.

**Why this priority**: Subscription revenue is more predictable. Users doing 5+ conversions/month strongly prefer this over per-conversion pricing.

**Independent Test**: Subscribe via the Mercado Pago sandbox. Verify the UI reflects "Plano Mensal Ativo". Perform more than 3 conversions. Verify none are blocked. Verify history entries are created.

**Acceptance Scenarios**:

1. **Given** a user subscribes, **When** the first payment is confirmed, **Then** their plan status changes to "Mensal Ativo" and conversion attempts no longer deduct credits.
2. **Given** an active subscriber converts a CV, **When** the conversion completes, **Then** a history entry is created with a 90-day expiry.
3. **Given** a subscriber's monthly renewal date arrives, **When** Mercado Pago charges the card successfully, **Then** the subscription remains active with no action required from the user.
4. **Given** a subscriber's renewal payment fails, **When** the webhook reports failure, **Then** the user is notified by e-mail and given a 3-day grace period before plan downgrades to free.
5. **Given** a subscriber cancels their plan, **When** the cancellation is confirmed, **Then** the plan remains active until the end of the current billing period, after which the account reverts to free tier.

---

### User Story 5 — Conversion History (Priority: P5)

A paid user (credits or subscription) navigates to "Meu Histórico". They see a list of their past conversions with the date and a truncated job title (extracted from the job description). They click "Baixar novamente" on a conversion from 2 days ago and immediately receive the PDF — no re-conversion is run.

**Why this priority**: History is the differentiating benefit of the paid tier. It must be reliable and clearly communicate when entries expire.

**Independent Test**: Perform 3 paid conversions. Open the history page. Verify all 3 appear in reverse-chronological order. Click re-download on each. Verify the correct PDF is served.

**Acceptance Scenarios**:

1. **Given** a paid user opens the history page, **When** the page loads, **Then** conversions are listed in reverse-chronological order (newest first), each showing: date, job title excerpt (first 60 chars of job description), and expiry date.
2. **Given** a history entry is within its retention window, **When** the user clicks "Baixar novamente", **Then** the original PDF is served immediately without re-running the AI.
3. **Given** a history entry has passed its retention window, **When** the user views it, **Then** the download button is disabled and replaced with an "Expirado" badge. The job title and date remain visible.
4. **Given** a free-tier user navigates to the history URL, **When** the page loads, **Then** an empty state message explains that history is available for paid plans, with a CTA to purchase credits.
5. **Given** there are more than 20 history entries, **When** the user scrolls to the bottom, **Then** older entries load via pagination (or infinite scroll) without a full page reload.

---

### Edge Cases

- What happens if a user is mid-conversion when their last credit is deducted by a concurrent tab? The current conversion completes (optimistic deduction); the balance may go to -1 temporarily, corrected on the next page load.
- What happens if the Mercado Pago webhook arrives before the frontend polls? The backend updates the balance immediately; the frontend reflects it on next query (React Query refetch interval: 10 s on the credits endpoint).
- What happens if a stored PDF is missing from the filesystem (e.g., manual deletion)? The history entry shows a "Arquivo não encontrado" error instead of a download button; the entry is not silently removed.
- What happens if a user tries to register with a disposable e-mail service? Out of scope for v1 — no disposable e-mail blocking.
- What happens if the verification e-mail is never confirmed? The account exists but cannot convert; a "resend verification" link is available on the login page.

---

## Requirements *(mandatory)*

### Functional Requirements

#### Authentication

- **FR-001**: Users MUST register with a valid e-mail address and a password of at least 8 characters.
- **FR-002**: Passwords MUST be stored as bcrypt hashes (cost factor ≥ 12). Plaintext passwords MUST never be logged or persisted.
- **FR-003**: Registration MUST trigger a verification e-mail with a single-use, time-limited (24 h) link.
- **FR-004**: Unverified accounts MUST NOT be able to perform conversions.
- **FR-005**: Successful login MUST issue a short-lived JWT access token (15-minute TTL) and a long-lived refresh token (30-day TTL) stored in an httpOnly, Secure, SameSite=Strict cookie.
- **FR-006**: The refresh token endpoint MUST issue a new access token without requiring re-login, up to the refresh token's expiry.
- **FR-007**: Logout MUST invalidate the refresh token server-side (token rotation or explicit revocation list).
- **FR-008**: All authenticated API endpoints MUST validate the JWT access token on every request.

#### Billing — Credits

- **FR-009**: A user's free conversion quota MUST be enforced server-side; client-side checks are UI-only.
- **FR-010**: The backend MUST deduct 1 credit atomically after a conversion completes successfully.
- **FR-011**: Failed conversions (AI error, timeout, parse error) MUST NOT deduct a credit.
- **FR-012**: Credit purchases MUST be initiated via the Mercado Pago Payments API, producing a PIX payment with a 30-minute expiry.
- **FR-013**: Mercado Pago webhooks MUST be validated using the provider's HMAC signature before credits are added.
- **FR-014**: The system MUST be idempotent on webhook replay — the same payment ID MUST NOT add credits more than once.

#### Billing — Subscription

- **FR-015**: Monthly subscriptions MUST be created via Mercado Pago Subscriptions (pre-approved payments).
- **FR-016**: Active subscribers MUST bypass the credit-per-conversion deduction.
- **FR-017**: On subscription renewal failure, the user MUST receive an e-mail notification and the system MUST grant a 3-day grace period before downgrading the account.
- **FR-018**: Cancellation MUST stop future renewals without immediately downgrading the plan.

#### Conversion History

- **FR-019**: Successful paid conversions MUST store the resulting PDF on the server's configured storage path with a filename derived from `{userId}/{conversionId}.pdf`.
- **FR-020**: History entries MUST record: user ID, conversion ID, job title excerpt (first 60 chars of job description), creation timestamp, expiry timestamp, and storage path.
- **FR-021**: The history list endpoint MUST return entries for the authenticated user only — cross-user access MUST return 403.
- **FR-022**: Re-download MUST serve the stored PDF from disk; it MUST NOT re-invoke the AI.
- **FR-023**: An automated background job MUST delete expired PDF files and mark their history entries as `expired` once the retention window passes.
- **FR-024**: Free-tier conversions MUST NOT create history entries and MUST NOT store PDFs server-side.

#### General

- **FR-025**: The existing `/api/convert` endpoint MUST now require a valid auth token.
- **FR-026**: All new API endpoints MUST validate request bodies with Zod schemas.
- **FR-027**: Rate limiting MUST be applied to auth endpoints (max 10 requests/minute per IP for login; max 5/minute for registration).

---

## Key Entities

### `User`
```typescript
interface User {
  id: string               // UUID
  email: string            // unique
  passwordHash: string
  emailVerified: boolean
  plan: 'free' | 'credits' | 'monthly'
  freeConversionsRemaining: number  // starts at 3, never negative
  creditBalance: number    // credits purchased (avulso plan)
  subscriptionId?: string  // Mercado Pago subscription ID
  subscriptionExpiresAt?: Date
  createdAt: Date
  updatedAt: Date
}
```

### `EmailVerificationToken`
```typescript
interface EmailVerificationToken {
  id: string
  userId: string
  token: string    // single-use random hex (64 chars)
  expiresAt: Date  // 24 hours from creation
  usedAt?: Date
}
```

### `RefreshToken`
```typescript
interface RefreshToken {
  id: string
  userId: string
  tokenHash: string  // SHA-256 of the raw token stored in cookie
  expiresAt: Date    // 30 days
  revokedAt?: Date
}
```

### `Payment`
```typescript
interface Payment {
  id: string
  userId: string
  provider: 'mercadopago'
  providerPaymentId: string   // unique — idempotency key
  type: 'credits' | 'subscription_first'
  amountBRL: number           // in reais (e.g., 9.50)
  creditsGranted: number
  status: 'pending' | 'approved' | 'rejected' | 'expired'
  createdAt: Date
  completedAt?: Date
}
```

### `ConversionRecord` (replaces in-memory `ConversionJob`)
```typescript
interface ConversionRecord {
  id: string
  userId: string
  jobTitleExcerpt: string     // first 60 chars of jobDescription
  status: 'completed' | 'failed' | 'expired'
  pdfStoragePath?: string     // null for free-tier conversions
  expiresAt?: Date            // null for free-tier conversions
  creditDeducted: boolean
  createdAt: Date
}
```

---

## API Contracts (new endpoints)

### Auth

```
POST /api/auth/register       body: { email, password }
POST /api/auth/verify-email   body: { token }
POST /api/auth/login          body: { email, password }
POST /api/auth/logout         (requires auth)
POST /api/auth/refresh        (uses httpOnly cookie)
GET  /api/auth/me             (requires auth) → User summary
```

### Billing

```
GET  /api/billing/plans       → available plans + prices (public)
POST /api/billing/credits     body: { bundle: 1|5|10|20 } → PIX payment object
POST /api/billing/subscribe   → Mercado Pago subscription redirect URL
POST /api/billing/cancel      (requires auth) → cancels subscription
POST /api/billing/webhook     (Mercado Pago HMAC-signed) → credit/subscription update
```

### History

```
GET  /api/history             (requires auth, paid plan) → paginated list
GET  /api/history/:id/download (requires auth, owns entry, not expired) → PDF binary
```

### Convert (updated)

```
POST /api/convert             (now requires auth)
                              → deducts credit OR checks subscription
                              → on success: stores PDF if paid
```

---

## Success Criteria *(mandatory)*

- **SC-001**: A new user can register, verify their e-mail, and perform their first conversion in under 3 minutes on a standard connection.
- **SC-002**: A PIX payment is reflected in the user's credit balance within 10 seconds of the Mercado Pago webhook arrival.
- **SC-003**: A re-download from history returns the correct PDF in under 2 seconds (no AI re-invocation).
- **SC-004**: Failed conversions (tested by simulating a Gemini API error) do NOT decrement the credit balance — verified by checking `/api/auth/me` before and after.
- **SC-005**: Webhook replay (sending the same Mercado Pago payment event twice) does NOT add credits twice — verified by checking the `Payment` table for duplicate `providerPaymentId`.
- **SC-006**: An expired history entry (simulated by manually setting `expiresAt` to the past) shows an "Expirado" badge and returns 410 on the download endpoint.
- **SC-007**: All existing conversion acceptance scenarios (from specs 002–005) continue to pass after auth is added — regression suite must show 0 new failures.
- **SC-008**: The login endpoint enforces rate limiting — the 11th request within 60 seconds from the same IP receives 429.

---

## Assumptions

- The application is self-hosted (single-tenant); multi-tenant isolation beyond per-user row filtering is out of scope.
- Mercado Pago is the sole payment provider for v1. Stripe integration is a future option.
- PDF storage is local filesystem for v1; the storage path is configured via `STORAGE_PATH` env var. S3-compatible storage is a future option (abstracted behind a `StorageAdapter` interface from day one).
- E-mail is sent via SMTP configured in `backend/.env` (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`). No managed e-mail provider is prescribed.
- Password reset ("Esqueci minha senha") is out of scope for v1 but the `EmailVerificationToken` model is designed to be reused for that purpose.
- Social login (Google, LinkedIn) is out of scope for v1.
- The Mercado Pago integration requires `MP_ACCESS_TOKEN` and `MP_WEBHOOK_SECRET` in `backend/.env`.
- Database migrations are managed by Prisma Migrate; the schema is authoritative.
- The free quota (3 conversions) is permanent and does not reset monthly — it is a one-time trial.
