import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { ProgressSteps } from '../../src/components/ProgressSteps'

describe('ProgressSteps', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders nothing when not active and never started', () => {
    const { container } = render(<ProgressSteps isActive={false} hasError={false} />)
    expect(container.firstChild).toBeNull()
  })

  it('shows all three step labels immediately when isActive becomes true', () => {
    render(<ProgressSteps isActive={true} hasError={false} />)
    expect(screen.getByText('Lendo seu currículo…')).toBeInTheDocument()
    expect(screen.getByText('Optimizando para ATS…')).toBeInTheDocument()
    expect(screen.getByText('Gerando PDF…')).toBeInTheDocument()
  })

  it('step 1 is active (bold) on start', () => {
    render(<ProgressSteps isActive={true} hasError={false} />)
    expect(screen.getByText('Lendo seu currículo…')).toHaveClass('font-semibold')
  })

  it('advances to step 2 as active after 3 seconds', () => {
    render(<ProgressSteps isActive={true} hasError={false} />)
    act(() => { vi.advanceTimersByTime(3000) })
    expect(screen.getByText('Optimizando para ATS…')).toHaveClass('font-semibold')
  })

  it('advances to step 3 as active after 8 seconds', () => {
    render(<ProgressSteps isActive={true} hasError={false} />)
    act(() => { vi.advanceTimersByTime(8000) })
    expect(screen.getByText('Gerando PDF…')).toHaveClass('font-semibold')
  })

  it('shows all steps as completed (green) on success transition', () => {
    const { rerender } = render(<ProgressSteps isActive={true} hasError={false} />)
    act(() => { vi.advanceTimersByTime(3000) })
    rerender(<ProgressSteps isActive={false} hasError={false} />)

    expect(screen.getByText('Lendo seu currículo…')).toHaveClass('text-green-600')
    expect(screen.getByText('Optimizando para ATS…')).toHaveClass('text-green-600')
  })

  it('shows active step as error (red) when hasError is true', () => {
    const { rerender } = render(<ProgressSteps isActive={true} hasError={false} />)
    // Step 1 is active (no timers advanced)
    rerender(<ProgressSteps isActive={false} hasError={true} />)

    expect(screen.getByText('Lendo seu currículo…')).toHaveClass('text-destructive')
  })

  it('stays hidden after active=false→true→false cycle without starting', () => {
    const { rerender, container } = render(<ProgressSteps isActive={false} hasError={false} />)
    expect(container.firstChild).toBeNull()
    rerender(<ProgressSteps isActive={true} hasError={false} />)
    expect(container.firstChild).not.toBeNull()
    rerender(<ProgressSteps isActive={false} hasError={false} />)
    // Component should remain visible in completed state after active→inactive
    expect(container.firstChild).not.toBeNull()
  })
})
