import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useConvert } from '../../src/hooks/useConvert'

vi.mock('../../src/lib/axios', () => ({
  convertCV: vi.fn(),
}))

import { convertCV } from '../../src/lib/axios'

const mockConvertCV = vi.mocked(convertCV)

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

describe('useConvert', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.URL.createObjectURL = vi.fn().mockReturnValue('blob:test-url')
  })

  it('is initially idle', () => {
    const { result } = renderHook(() => useConvert(), { wrapper: makeWrapper() })

    expect(result.current.isPending).toBe(false)
    expect(result.current.blobUrl).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('calls convertCV with correct FormData and exposes blobUrl on success', async () => {
    const fakeBlob = new Blob(['%PDF-1.4'], { type: 'application/pdf' })
    mockConvertCV.mockResolvedValue(fakeBlob)

    const { result } = renderHook(() => useConvert(), { wrapper: makeWrapper() })

    let successUrl: string | undefined
    act(() => {
      result.current.convert(
        { file: new File(['pdf'], 'resume.pdf', { type: 'application/pdf' }), jobDescription: 'Engineer role', geminiApiKey: 'AIzaTestKey123' },
        { onSuccess: (url) => { successUrl = url } },
      )
    })

    await waitFor(() => expect(result.current.isPending).toBe(false))

    expect(mockConvertCV).toHaveBeenCalledOnce()
    expect(result.current.blobUrl).toBe('blob:test-url')
    expect(successUrl).toBe('blob:test-url')
  })

  it('reset clears blobUrl and error', async () => {
    const fakeBlob = new Blob(['%PDF'], { type: 'application/pdf' })
    mockConvertCV.mockResolvedValue(fakeBlob)

    const { result } = renderHook(() => useConvert(), { wrapper: makeWrapper() })

    act(() => {
      result.current.convert({ file: new File(['pdf'], 'r.pdf', { type: 'application/pdf' }), jobDescription: 'job', geminiApiKey: 'AIzaTestKey123' })
    })
    await waitFor(() => expect(result.current.blobUrl).toBe('blob:test-url'))

    act(() => result.current.reset())

    expect(result.current.blobUrl).toBeNull()
  })
})
