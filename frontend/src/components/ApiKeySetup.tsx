import { useState, FormEvent } from 'react'
import { KeyRound } from 'lucide-react'

interface ApiKeySetupProps {
  onSave: (key: string) => void
}

export function ApiKeySetup({ onSave }: ApiKeySetupProps) {
  const [inputValue, setInputValue] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)
  const [tutorialOpen, setTutorialOpen] = useState(false)

  function handleSave(e: FormEvent) {
    e.preventDefault()
    const trimmed = inputValue.trim()
    if (!trimmed) {
      setValidationError('Informe uma chave antes de salvar.')
      return
    }
    setValidationError(null)
    onSave(trimmed)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 text-foreground">
        <KeyRound className="h-5 w-5 text-ink shrink-0" aria-hidden="true" />
        <h2 className="ts-title text-ink">Configure sua chave da API Gemini</h2>
      </div>

      <p className="ts-body-sm text-muted-foreground">
        Para usar o conversor, você precisa de uma chave gratuita da API Gemini (Google AI Studio).
        Ela é salva apenas no seu navegador e nunca é armazenada no servidor.
      </p>

      <form onSubmit={handleSave} className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <label className="ts-caption font-semibold text-muted-foreground" htmlFor="api-key-input">
            Chave da API Gemini <span className="text-destructive">*</span>
          </label>
          <input
            id="api-key-input"
            type="password"
            value={inputValue}
            onChange={e => {
              setInputValue(e.target.value)
              if (validationError) setValidationError(null)
            }}
            placeholder="AIza..."
            autoComplete="off"
            className="h-11 w-full rounded-md border border-input bg-card px-4 py-3
              ts-body-sm text-foreground placeholder:text-muted-foreground
              focus:outline-none focus:border-2 focus:border-ink focus:px-[15px]"
          />
          {validationError && (
            <p className="ts-caption text-destructive">{validationError}</p>
          )}
        </div>

        <button
          type="submit"
          className="h-11 w-full rounded-pill bg-primary px-6 ts-button
            text-primary-foreground transition-colors
            hover:bg-primary-active
            active:bg-primary-active"
        >
          Salvar chave
        </button>
      </form>

      {/* Tutorial section */}
      <div className="rounded-xl border border-hairline overflow-hidden">
        <button
          type="button"
          onClick={() => setTutorialOpen(open => !open)}
          className="flex w-full items-center justify-between px-4 py-3
            ts-body-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
          aria-expanded={tutorialOpen}
        >
          <span>Como obter minha chave?</span>
          <span aria-hidden="true" className="ts-caption text-muted-foreground">
            {tutorialOpen ? '▲' : '▼'}
          </span>
        </button>

        {tutorialOpen && (
          <div className="px-4 pb-4 border-t border-hairline">
            <ol className="flex flex-col gap-2 ts-body-sm text-foreground list-decimal list-inside mt-4">
              <li>
                Acesse{' '}
                <a
                  href="https://aistudio.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink underline underline-offset-2 hover:text-primary-active"
                >
                  aistudio.google.com
                </a>{' '}
                e faça login com sua conta Google (gratuita).
              </li>
              <li>
                No menu lateral, clique em <strong>&#34;Get API key&#34;</strong>.
              </li>
              <li>
                Clique em <strong>&#34;Create API key&#34;</strong>.
              </li>
              <li>
                Selecione um projeto Google Cloud existente ou crie um novo (gratuito).
              </li>
              <li>
                Copie a chave gerada — ela começa com <code className="ts-code">AIza</code>.
              </li>
              <li>
                Cole a chave no campo acima e clique em <strong>&#34;Salvar chave&#34;</strong>.
              </li>
            </ol>

            <p className="mt-3 ts-caption text-muted-foreground">
              O plano gratuito oferece até 15 requisições por minuto — mais que suficiente para uso
              pessoal. Nenhum cartão de crédito é necessário.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
