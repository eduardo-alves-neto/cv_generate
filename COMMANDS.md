# Comandos do Projeto

## Pré-requisitos

| Ferramenta | Versão | Instalação |
|------------|--------|------------|
| Node.js | 20+ | [nodejs.org](https://nodejs.org) |
| pnpm | 9+ | `npm i -g pnpm` |
| Google Gemini API Key | — | Grátis em [aistudio.google.com](https://aistudio.google.com) |

> **Como obter a API key (gratuito, sem cartão de crédito)**:
> 1. Acesse [aistudio.google.com](https://aistudio.google.com)
> 2. Faça login com uma conta Google
> 3. Clique em **"Get API key"** → **"Create API key"**
> 4. Copie a chave e adicione no `backend/.env`

---

## Setup inicial (apenas uma vez)

```bash
# 1. Instalar dependências de todos os pacotes
pnpm install

# 2. Criar arquivos de ambiente
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 3. Editar backend/.env e adicionar sua API key
# GEMINI_API_KEY=sua_chave_aqui
```

---

## Desenvolvimento

```bash
# Iniciar backend (porta 3001) + frontend (porta 5173) juntos
pnpm dev

# Iniciar apenas o backend
pnpm --filter backend dev

# Iniciar apenas o frontend
pnpm --filter frontend dev
```

Acesse `http://localhost:5173` após rodar `pnpm dev`.

---

## Testes

```bash
# Rodar todos os testes unitários (backend + frontend)
pnpm test

# Testes com watch mode
pnpm test:watch

# Testes E2E com Playwright (requer pnpm dev rodando)
pnpm test:e2e

# Testes com relatório de cobertura
pnpm --filter backend test:coverage
pnpm --filter frontend test:coverage
```

---

## Build de produção

```bash
pnpm build
```

---

## Variáveis de ambiente

### `backend/.env`

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `GEMINI_API_KEY` | *(obrigatório)* | Chave da API do Google Gemini |
| `GEMINI_MODEL` | `gemini-2.5-flash` | Modelo Gemini a usar |
| `GEMINI_TIMEOUT_MS` | `30000` | Timeout da chamada à API (ms) |
| `PORT` | `3001` | Porta do servidor Express |
| `MAX_FILE_SIZE_BYTES` | `10485760` | Tamanho máximo do PDF (10 MB) |

### `frontend/.env`

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `VITE_API_BASE_URL` | `http://localhost:3001/api` | URL base da API |

---

## Verificar saúde da API

```bash
curl http://localhost:3001/api/health
# → {"status":"ok"}
```

---

## Troubleshooting

| Problema | Solução |
|----------|---------|
| "AI service unavailable" | Verificar se `GEMINI_API_KEY` está configurada em `backend/.env` |
| "AI timeout" | Aumentar `GEMINI_TIMEOUT_MS` ou verificar conexão com a internet |
| 429 Too Many Requests | Limite do free tier (15 RPM) atingido — aguardar 1 min e tentar novamente |
| PDF sem texto extraível | Usar PDF com camada de texto — scans de imagem não são suportados |
| Porta já em uso | Mudar `PORT` no `backend/.env` e atualizar `VITE_API_BASE_URL` no `frontend/.env` |
