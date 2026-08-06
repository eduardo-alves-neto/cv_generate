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
      className="relative flex flex-col items-center gap-6 overflow-hidden rounded-xl
        border border-hairline bg-card p-8 text-center"
    >
      {/* Atmospheric gradient orb — pure decoration, per DESIGN.md */}
      <div
        className="gradient-orb -left-16 -top-16 h-56 w-56 bg-gradient-mint"
        aria-hidden="true"
      />

      <CheckCircle2 className="relative z-10 h-14 w-14 text-success" aria-hidden="true" />

      <div className="relative z-10 flex flex-col gap-2">
        <p className="ts-subhead text-ink">Currículo ATS pronto!</p>
        <p className="ts-body-sm text-muted-foreground">
          Seu currículo foi optimizado. Baixe e use nas suas candidaturas.
        </p>
      </div>

      <ul className="relative z-10 w-full max-w-sm rounded-lg border border-hairline bg-accent/40 px-5 py-4 text-left">
        {IMPROVEMENTS.map(tip => (
          <li key={tip} className="flex items-start gap-2 py-1 ts-body-sm text-foreground">
            <span className="mt-0.5 text-success" aria-hidden="true">✓</span>
            {tip}
          </li>
        ))}
      </ul>

      <a
        href={blobUrl}
        download="ats-cv.pdf"
        className="relative z-10 inline-flex h-11 w-full max-w-xs items-center justify-center gap-2
          rounded-pill bg-primary px-6 ts-button text-primary-foreground
          transition-colors hover:bg-primary-active active:bg-primary-active"
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        Baixar CV ATS
      </a>

      <button
        type="button"
        onClick={onReset}
        className="relative z-10 ts-body-sm text-muted-foreground underline-offset-4 hover:underline"
      >
        Converter outro currículo
      </button>
    </div>
  )
}
