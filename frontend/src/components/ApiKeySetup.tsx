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
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2 text-foreground">
        <KeyRound className="h-5 w-5 text-primary shrink-0" aria-hidden="true" />
        <h2 className="text-base font-semibold">Configure sua chave da API Gemini</h2>
      </div>

      <p className="text-sm text-muted-foreground">
        Para usar o conversor, você precisa de uma chave gratuita da API Gemini (Google AI Studio).
        Ela é salva apenas no seu navegador e nunca é armazenada no servidor.
      </p>

      <form onSubmit={handleSave} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground" htmlFor="api-key-input">
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
            className="w-full rounded-md border border-input bg-background px-3 py-2
              text-sm text-foreground placeholder:text-muted-foreground
              focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {validationError && (
            <p className="text-xs text-destructive">{validationError}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium
            text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Salvar chave
        </button>
      </form>

      {/* Tutorial section */}
      <div className="rounded-md border border-border">
        <button
          type="button"
          onClick={() => setTutorialOpen(open => !open)}
          className="flex w-full items-center justify-between px-4 py-3 text-sm
            font-medium text-foreground hover:bg-muted/50 transition-colors rounded-md"
          aria-expanded={tutorialOpen}
        >
          <span>Como obter minha chave?</span>
          <span aria-hidden="true" className="text-muted-foreground">
            {tutorialOpen ? '▲' : '▼'}
          </span>
        </button>

        {tutorialOpen && (
          <div className="px-4 pb-4">
            <ol className="flex flex-col gap-2 text-sm text-foreground list-decimal list-inside">
              <li>
                Acesse{' '}
                <a
                  href="https://aistudio.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-2 hover:text-primary/80"
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
                Copie a chave gerada — ela começa com <code className="font-mono">AIza</code>.
              </li>
              <li>
                Cole a chave no campo acima e clique em <strong>&#34;Salvar chave&#34;</strong>.
              </li>
            </ol>

            <p className="mt-3 text-xs text-muted-foreground">
              O plano gratuito oferece até 15 requisições por minuto — mais que suficiente para uso
              pessoal. Nenhum cartão de crédito é necessário.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
