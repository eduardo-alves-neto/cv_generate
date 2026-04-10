import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { ConvertForm } from '../../src/components/ConvertForm'
import type { ApiError } from '@cv-ats/shared'

vi.mock('../../src/hooks/useConvert', () => ({
  useConvert: vi.fn(),
}))

import { useConvert } from '../../src/hooks/useConvert'

const mockUseConvert = vi.mocked(useConvert)

function makeWrapper() {
  const queryClient = new QueryClient()
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

const defaultHookReturn = {
  convert: vi.fn(),
  isPending: false,
  isSuccess: false,
  blobUrl: null,
  error: null,
  reset: vi.fn(),
}

describe('ConvertForm error display', () => {
  beforeEach(() => {
    mockUseConvert.mockReturnValue(defaultHookReturn)
  })

  it('renders submit button by default', () => {
    render(
      createElement(ConvertForm, { onConvertStart: vi.fn(), onConvertSuccess: vi.fn(), onConvertError: vi.fn() }),
      { wrapper: makeWrapper() },
    )
    expect(screen.getByRole('button', { name: /convert to ats/i })).toBeInTheDocument()
  })

  const errorCases: Array<[ApiError['code'], RegExp]> = [
    ['INVALID_FILE', /only pdf files/i],
    ['FILE_TOO_LARGE', /10 mb limit/i],
    ['INVALID_JOB_DESCRIPTION', /valid job description/i],
    ['UNREADABLE_PDF', /no extractable text/i],
    ['AI_UNAVAILABLE', /ollama serve/i],
    ['AI_TIMEOUT', /timed out/i],
    ['INTERNAL_ERROR', /unexpected error/i],
  ]

  for (const [code, pattern] of errorCases) {
    it(`shows human-readable message for ${code}`, () => {
      const apiError: ApiError = { error: 'raw error', code }
      mockUseConvert.mockReturnValue({ ...defaultHookReturn, error: apiError })

      render(
        createElement(ConvertForm, { onConvertStart: vi.fn(), onConvertSuccess: vi.fn(), onConvertError: vi.fn() }),
        { wrapper: makeWrapper() },
      )

      expect(screen.getByRole('alert')).toHaveTextContent(pattern)
    })
  }
})
