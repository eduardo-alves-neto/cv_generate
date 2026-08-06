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
    <main className="min-h-screen bg-canvas px-4 pb-24 pt-12">
      <div className="mx-auto w-full max-w-4xl">
        {stage !== 'success' && (
          <>
            {/* Form card — editorial card: white surface, hairline border, soft-drop on hover */}
            <div className="rounded-xl border border-hairline bg-card p-6 transition-shadow duration-200 hover:shadow-soft-drop">
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
              <div className="mt-4 rounded-xl border border-hairline bg-card px-6 py-2">
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
