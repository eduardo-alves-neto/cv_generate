import { useState } from 'react'
import { ConvertForm } from '../components/ConvertForm'
import { ProgressSpinner } from '../components/ProgressSpinner'
import { ResultCard } from '../components/ResultCard'

type Stage = 'idle' | 'pending' | 'success' | 'error'

export function HomePage() {
  const [stage, setStage] = useState<Stage>('idle')
  const [blobUrl, setBlobUrl] = useState<string | null>(null)

  function handleReset() {
    setBlobUrl(null)
    setStage('idle')
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            CV to ATS Converter
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Upload your PDF resume and a job description — get an ATS-optimised CV
            in seconds, powered by local AI.
          </p>
        </header>

        {stage !== 'success' && (
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <ConvertForm
              onConvertStart={() => setStage('pending')}
              onConvertSuccess={(url) => {
                setBlobUrl(url)
                setStage('success')
              }}
              onConvertError={() => setStage('error')}
            />
            <ProgressSpinner isPending={stage === 'pending'} />
          </div>
        )}

        {stage === 'success' && blobUrl && (
          <ResultCard blobUrl={blobUrl} onReset={handleReset} />
        )}
      </div>
    </main>
  )
}
