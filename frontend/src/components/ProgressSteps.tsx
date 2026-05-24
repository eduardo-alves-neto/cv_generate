import { useEffect, useRef, useState } from 'react'
import { CheckCircle2, Circle, Loader2, XCircle } from 'lucide-react'
import { clsx } from 'clsx'

const STEPS = [
  'Lendo seu currículo…',
  'Optimizando para ATS…',
  'Gerando PDF…',
]

type StepState = 'pending' | 'active' | 'completed' | 'error'

type ProgressPhase =
  | { phase: 'hidden' }
  | { phase: 'running'; currentStep: number }
  | { phase: 'success' }
  | { phase: 'error'; atStep: number }

export interface ProgressStepsProps {
  isActive: boolean
  hasError: boolean
}

export function ProgressSteps({ isActive, hasError }: ProgressStepsProps) {
  const [progress, setProgress] = useState<ProgressPhase>({ phase: 'hidden' })
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  // Start / advance steps while active
  useEffect(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []

    if (isActive) {
      setProgress({ phase: 'running', currentStep: 0 })
      const t1 = setTimeout(
        () =>
          setProgress(prev =>
            prev.phase === 'running' ? { phase: 'running', currentStep: 1 } : prev,
          ),
        3000,
      )
      const t2 = setTimeout(
        () =>
          setProgress(prev =>
            prev.phase === 'running' ? { phase: 'running', currentStep: 2 } : prev,
          ),
        8000,
      )
      timersRef.current = [t1, t2]
    }

    return () => {
      timersRef.current.forEach(clearTimeout)
    }
  }, [isActive])

  // Resolve to success or error when isActive goes false
  useEffect(() => {
    if (!isActive) {
      setProgress(prev => {
        if (prev.phase !== 'running') return prev
        return hasError
          ? { phase: 'error', atStep: prev.currentStep }
          : { phase: 'success' }
      })
    }
  }, [isActive, hasError])

  if (progress.phase === 'hidden') return null

  function getStepState(index: number): StepState {
    const p = progress
    if (p.phase === 'success') return 'completed'
    if (p.phase === 'error') {
      if (index < p.atStep) return 'completed'
      if (index === p.atStep) return 'error'
      return 'pending'
    }
    if (p.phase === 'running') {
      if (index < p.currentStep) return 'completed'
      if (index === p.currentStep) return 'active'
      return 'pending'
    }
    return 'pending'
  }

  return (
    <div
      className="flex flex-col gap-3 py-4"
      role="status"
      aria-live="polite"
      aria-label="Progresso da conversão"
    >
      {STEPS.map((label, i) => {
        const state = getStepState(i)
        return (
          <div key={label} className="flex items-center gap-3">
            <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center">
              {state === 'active' && (
                <Loader2 className="h-5 w-5 animate-spin text-primary" aria-hidden="true" />
              )}
              {state === 'completed' && (
                <CheckCircle2 className="h-5 w-5 text-success" aria-hidden="true" />
              )}
              {state === 'error' && (
                <XCircle className="h-5 w-5 text-destructive" aria-hidden="true" />
              )}
              {state === 'pending' && (
                <Circle className="h-5 w-5 text-muted-foreground/30" aria-hidden="true" />
              )}
            </span>
            <span
              className={clsx('ts-body-sm transition-colors duration-300', {
                'font-semibold text-foreground': state === 'active',
                'text-success': state === 'completed',
                'font-medium text-destructive': state === 'error',
                'text-muted-foreground/40': state === 'pending',
              })}
            >
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
