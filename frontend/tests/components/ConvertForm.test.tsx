import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { ConvertForm } from '../../src/components/ConvertForm'
import type { ApiError } from '@cv-ats/shared'

vi.mock('../../src/hooks/useConvert', () => ({
  useConvert: vi.fn(),
}))

vi.mock('../../src/hooks/useApiKey', () => ({
  useApiKey: vi.fn(),
}))

import { useConvert } from '../../src/hooks/useConvert'
import { useApiKey } from '../../src/hooks/useApiKey'

const mockUseConvert = vi.mocked(useConvert)
const mockUseApiKey = vi.mocked(useApiKey)

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

const defaultApiKeyReturn = {
  apiKey: 'AIzaTestKey123',
  setApiKey: vi.fn(),
  clearApiKey: vi.fn(),
}

describe('ConvertForm error display', () => {
  beforeEach(() => {
    mockUseConvert.mockReturnValue(defaultHookReturn)
    mockUseApiKey.mockReturnValue(defaultApiKeyReturn)
  })

  it('renders submit button by default', () => {
    render(
      createElement(ConvertForm, { onConvertStart: vi.fn(), onConvertSuccess: vi.fn(), onConvertError: vi.fn() }),
      { wrapper: makeWrapper() },
    )
    expect(screen.getByRole('button', { name: /convert to ats/i })).toBeInTheDocument()
    expect(screen.queryByText(/configure sua chave/i)).not.toBeInTheDocument()
  })

  const errorCases: Array<[ApiError['code'], RegExp]> = [
    ['INVALID_FILE', /only pdf files/i],
    ['FILE_TOO_LARGE', /10 mb limit/i],
    ['INVALID_JOB_DESCRIPTION', /valid job description/i],
    ['UNREADABLE_PDF', /no extractable text/i],
    ['AI_UNAVAILABLE', /chave da api gemini/i],
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
