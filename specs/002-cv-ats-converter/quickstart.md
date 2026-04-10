# Quickstart: CV to ATS Converter

**Branch**: `002-cv-ats-converter` | **Date**: 2026-04-10
**Amended**: 2026-04-10 — Ollama replaced by Google Gemini API

---

## Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| Node.js | 20+ | [nodejs.org](https://nodejs.org) |
| pnpm | 9+ | `npm i -g pnpm` |
| Google Gemini API Key | — | Free at [aistudio.google.com](https://aistudio.google.com) |

> **Getting an API key (free, no credit card)**:
> 1. Go to [aistudio.google.com](https://aistudio.google.com)
> 2. Sign in with a Google account
> 3. Click **"Get API key"** → **"Create API key"**
> 4. Copy the key — you'll add it to `backend/.env` below

---

## 1. Clone and install dependencies

```bash
git clone <repo-url>
cd cv_generate
pnpm install
```

---

## 2. Configure environment variables

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Edit `backend/.env` and set your Gemini API key:

```env
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-2.5-flash
GEMINI_TIMEOUT_MS=30000
PORT=3001
MAX_FILE_SIZE_BYTES=10485760
```

The `frontend/.env` default requires no changes:

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

---

## 3. Start the development environment

```bash
pnpm dev
```

This starts:
- **Backend** on `http://localhost:3001` (via `tsx watch`)
- **Frontend** on `http://localhost:5173` (via Vite)

No separate AI process needed — Gemini runs in the cloud.

---

## 4. Open the app

Navigate to `http://localhost:5173` in your browser.

1. Upload your PDF resume using the file picker.
2. Paste the job description into the text area.
3. Click **"Convert to ATS"**.
4. Wait ~5–15 seconds while the spinner shows elapsed time.
5. Click **"Download ATS CV"** when the button appears.

---

## Environment Variables

### `backend/.env`

| Variable | Default | Description |
|----------|---------|-------------|
| `GEMINI_API_KEY` | *(required)* | Google Gemini API key |
| `GEMINI_MODEL` | `gemini-2.5-flash` | Gemini model name |
| `GEMINI_TIMEOUT_MS` | `30000` | Request timeout in ms |
| `PORT` | `3001` | Backend server port |
| `MAX_FILE_SIZE_BYTES` | `10485760` | Max PDF size (10 MB) |

### `frontend/.env`

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:3001/api` | Backend API base URL |

---

## Running tests

```bash
# Unit tests (Vitest — frontend + backend)
pnpm test

# Unit tests in watch mode
pnpm test:watch

# E2E tests (Playwright — requires pnpm dev running)
pnpm test:e2e
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "AI service unavailable" | Check that `GEMINI_API_KEY` is set correctly in `backend/.env` |
| "AI timeout" | Increase `GEMINI_TIMEOUT_MS` or check internet connectivity |
| PDF has no text | Use a text-based PDF; image scans are not supported |
| Port already in use | Change `PORT` in `backend/.env` and update `VITE_API_BASE_URL` in `frontend/.env` |
| 429 Too Many Requests | Gemini free tier limit reached (15 RPM) — wait 1 minute and retry |
