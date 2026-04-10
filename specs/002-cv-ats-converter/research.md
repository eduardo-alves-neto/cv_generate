# Research: CV to ATS Converter

**Branch**: `002-cv-ats-converter` | **Date**: 2026-04-10
**Amended**: 2026-04-10 — Section 4 replaced (Ollama → Gemini API)
**Status**: Complete — all unknowns resolved

---

## 1. PDF Text Extraction (Node.js)

**Decision**: `pdf-parse` (v1.x)

**Rationale**:
- Pure-JS, no native bindings required — installs cleanly on any OS
- Sufficient for text-based PDFs (our only supported input type)
- Well-maintained, MIT license
- Returns text as a string with page metadata

**Edge-case behaviour**: If the PDF has no extractable text layer (image-only scan),
pdf-parse returns an empty string — the backend detects this (`.trim() === ''`) and
returns a 422 UNREADABLE_PDF error without calling the AI API.

---

## 2. PDF Generation (Node.js)

**Decision**: `PDFKit` (v0.15.x)

**Rationale**:
- Lightweight, pure-JS, no Chromium/headless browser dependency
- Programmatic API for structured, ATS-friendly layouts: plain single-column, no tables
- MIT license

---

## 3. Backend Framework

**Decision**: `Express.js` (v4.x) with TypeScript

**Rationale**:
- Constitutionally mandated default
- Broad Multer ecosystem compatibility for file uploads
- Minimal surface area for a two-endpoint API

---

## 4. AI Provider

**Decision**: Google Gemini API — model `gemini-2.5-flash`

**Why Ollama was replaced**:
- Local CPU inference with `llama3.2:1b` exceeded 60 s timeout on commodity hardware
  (no GPU). Even with a 180 s timeout the user experience was unacceptable.
- `llama3.2:3b` was completely unusable on CPU (> 3 min per request).
- Installing and managing Ollama added friction (separate process, model download, etc.)

**Why Gemini Flash**:
- Free tier: 15 requests/min, 1 M tokens/day — more than sufficient for a single-user
  local tool
- `gemini-2.5-flash` averages **3–8 seconds** per CV conversion request
- Official TypeScript SDK (`@google/generative-ai`) with full type safety
- API key obtainable for free at [aistudio.google.com](https://aistudio.google.com)
  with no credit card required
- Generous context window (1 M tokens) — no need to truncate inputs

**Alternatives considered**:
- `OpenAI GPT-4o-mini`: No free tier for new accounts; requires credit card
- `Anthropic Claude Haiku`: No free tier
- `Cohere Command R`: Free tier available but smaller ecosystem and SDK
- `Groq + Llama3`: Free tier available; considered as fallback if Gemini quota is hit

**SDK usage**:
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
const result = await model.generateContent(prompt)
const text = result.response.text()
```

**Prompt strategy**: Same as before — structured plain-text output with section headers
(`## CONTACT`, `## SUMMARY`, etc.) that the backend parses deterministically.

---

## 5. Conversion Flow

**Decision**: Single long-running HTTP POST with frontend timer-based progress spinner

**Rationale**: With Gemini Flash averaging 3–8 s, the single-POST approach is more
than sufficient. No polling or SSE needed.

---

## 6. Shared Types

**Decision**: pnpm workspace with `packages/shared` — Zod schemas exported as types

No change from original design.

---

## 7. Testing Stack

**Decision**: Vitest (unit) + Playwright (E2E)

No change from original design.

---

## Summary of Resolved Decisions

| Topic | Choice | Licence / Cost |
|-------|--------|----------------|
| PDF text extraction | pdf-parse | MIT / free |
| PDF generation | PDFKit | MIT / free |
| Backend framework | Express.js v4 | MIT / free |
| AI provider | Google Gemini API (`gemini-2.5-flash`) | Proprietary / free tier |
| Conversion flow | Single HTTP POST | N/A |
| Shared types | pnpm workspace / packages/shared | N/A |
| Unit testing | Vitest | MIT / free |
| E2E testing | Playwright | Apache 2.0 / free |
