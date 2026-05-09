import { useState } from 'react'
import { ConvertForm } from '../components/ConvertForm'
import { ProgressSteps } from '../components/ProgressSteps'
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
    <main className="min-h-screen bg-background px-4 pb-15 pt-9">
      <div className="mx-auto w-full max-w-4xl">
        {stage !== 'success' && (
          <>
            {/* Form card — flat, no shadow, warm border */}
            <div className="border border-border bg-background p-6">
              <ConvertForm
                onConvertStart={() => setStage('pending')}
                onConvertSuccess={(url) => {
                  setBlobUrl(url)
                  setStage('success')
                }}
                onConvertError={() => setStage('error')}
              />
            </div>

            {stage !== 'idle' && (
              <div className="mt-4 border border-border bg-background px-6 py-2">
                <ProgressSteps
                  isActive={stage === 'pending'}
                  hasError={stage === 'error'}
                />
              </div>
            )}
          </>
        )}

        {stage === 'success' && blobUrl && (
          <ResultCard blobUrl={blobUrl} onReset={handleReset} />
        )}
      </div>
    </main>
  )
}
