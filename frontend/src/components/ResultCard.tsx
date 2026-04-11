import { CheckCircle2, Download } from 'lucide-react'

const IMPROVEMENTS = [
  'Palavras-chave alinhadas com os requisitos da vaga',
  'Formatação compatível com scanners ATS',
  'Seções padronizadas para facilitar a triagem',
]

interface ResultCardProps {
  blobUrl: string
  onReset: () => void
}

export function ResultCard({ blobUrl, onReset }: ResultCardProps) {
  return (
    <div
      className="flex flex-col items-center gap-6 rounded-xl border border-border
        bg-card p-8 text-center shadow-sm"
    >
      <CheckCircle2 className="h-14 w-14 text-green-500" aria-hidden="true" />

      <div className="flex flex-col gap-1">
        <p className="text-xl font-bold text-foreground">Currículo ATS pronto!</p>
        <p className="text-sm text-muted-foreground">
          Seu currículo foi optimizado. Baixe e use nas suas candidaturas.
        </p>
      </div>

      <ul className="w-full max-w-sm rounded-lg border border-border bg-accent/20 px-5 py-4 text-left">
        {IMPROVEMENTS.map(tip => (
          <li key={tip} className="flex items-start gap-2 py-1 text-sm text-foreground">
            <span className="mt-0.5 text-green-500" aria-hidden="true">✓</span>
            {tip}
          </li>
        ))}
      </ul>

      <a
        href={blobUrl}
        download="ats-cv.pdf"
        className="inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-md
          bg-primary px-6 py-3 text-sm font-medium text-primary-foreground
          transition-colors hover:bg-primary/90"
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        Baixar CV ATS
      </a>

      <button
        type="button"
        onClick={onReset}
        className="text-sm text-muted-foreground underline-offset-4 hover:underline"
      >
        Converter outro currículo
      </button>
    </div>
  )
}
