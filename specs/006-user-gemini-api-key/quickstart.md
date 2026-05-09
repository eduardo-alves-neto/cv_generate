# Quickstart: User-Provided Gemini API Key

**Feature**: 006-user-gemini-api-key

---

## O que muda para quem executa o projeto

A partir desta feature, **não é mais necessário** configurar `GEMINI_API_KEY` em `backend/.env`.  
Cada usuário fornece sua própria chave diretamente na interface do sistema.

---

## Setup (desenvolvimento)

```bash
# 1. Clone e instale dependências (sem mudança)
pnpm install

# 2. Configure o backend/.env — GEMINI_API_KEY não é mais obrigatória
cp backend/.env.example backend/.env
# Edite PORT, GEMINI_MODEL, etc. se quiser; GEMINI_API_KEY pode ser omitida.

# 3. Inicie frontend + backend
pnpm dev
# Frontend: http://localhost:5173
# Backend:  http://localhost:3001
```

---

## Como obter uma chave Gemini gratuita (para usar no sistema)

1. Acesse **https://aistudio.google.com** e faça login com uma conta Google.
2. No menu lateral, clique em **"Get API key"** → **"Create API key"**.
3. Selecione um projeto Google Cloud existente ou crie um novo (gratuito).
4. Copie a chave gerada — ela começa com `AIza...`.
5. Abra o sistema em `http://localhost:5173`, cole a chave no campo exibido e clique em **"Salvar chave"**.

A chave fica salva no navegador. Em visitas seguintes, o formulário de conversão abre diretamente.

---

## Limites do plano gratuito do Gemini

| Modelo | Requests por minuto | Tokens/dia |
|--------|--------------------|-----------:|
| gemini-2.5-flash (padrão) | 15 RPM | ~1 000 000 |

Se o limite for atingido, o sistema exibe uma mensagem explicando o motivo e orienta o usuário a aguardar.

---

## Variáveis de ambiente do backend (referência atualizada)

| Variável | Obrigatória | Padrão | Descrição |
|----------|-------------|--------|-----------|
| `PORT` | Não | `3001` | Porta do servidor Express |
| `GEMINI_MODEL` | Não | `gemini-2.5-flash` | Modelo Gemini a usar |
| `GEMINI_TIMEOUT_MS` | Não | `30000` | Timeout por requisição (ms) |
| `MAX_FILE_SIZE_BYTES` | Não | `10485760` | Tamanho máximo do PDF (10 MB) |
| `GEMINI_API_KEY` | **Não** *(removida)* | — | Não mais necessária; a chave vem do usuário |

---

## Testes

```bash
# Testes unitários
pnpm test

# Testes E2E (requer pnpm dev rodando em outro terminal)
pnpm test:e2e
```

Os testes de integração para o endpoint `/api/convert` usarão uma chave de teste configurada via variável de ambiente `TEST_GEMINI_API_KEY` (definida apenas no ambiente de CI).
