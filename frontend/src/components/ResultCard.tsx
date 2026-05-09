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
      className="flex flex-col items-center gap-6 border border-border
        bg-background p-8 text-center"
    >
      <CheckCircle2 className="h-14 w-14 text-success" aria-hidden="true" />

      <div className="flex flex-col gap-2">
        <p className="ts-subhead text-foreground">Currículo ATS pronto!</p>
        <p className="ts-body-sm text-muted-foreground">
          Seu currículo foi optimizado. Baixe e use nas suas candidaturas.
        </p>
      </div>

      <ul className="w-full max-w-sm border border-border bg-accent/20 px-5 py-4 text-left">
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
        className="inline-flex w-full max-w-xs items-center justify-center gap-2
          bg-primary px-6 py-3 ts-body-sm font-semibold text-primary-foreground
          transition-colors hover:bg-[#57534E] active:bg-[#44403C]"
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        Baixar CV ATS
      </a>

      <button
        type="button"
        onClick={onReset}
        className="ts-body-sm text-muted-foreground underline-offset-4 hover:underline"
      >
        Converter outro currículo
      </button>
    </div>
  )
}
