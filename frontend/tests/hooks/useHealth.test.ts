import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useHealth } from '../../src/hooks/useHealth'

vi.mock('../../src/lib/axios', () => ({
  fetchHealth: vi.fn(),
}))

import { fetchHealth } from '../../src/lib/axios'

const mockFetchHealth = vi.mocked(fetchHealth)

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

describe('useHealth', () => {
  it('returns isHealthy true when fetchHealth resolves', async () => {
    mockFetchHealth.mockResolvedValue({ status: 'ok' })

    const { result } = renderHook(() => useHealth(), { wrapper: makeWrapper() })

    await waitFor(() => expect(result.current.isHealthy).toBe(true))
    expect(result.current.isLoading).toBe(false)
  })

  it('returns isHealthy false when fetchHealth rejects', async () => {
    mockFetchHealth.mockRejectedValue(new Error('network error'))

    const { result } = renderHook(() => useHealth(), { wrapper: makeWrapper() })

    // hook has retry: 1 — wait long enough for both attempts to fail
    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 5_000 })
    expect(result.current.isHealthy).toBe(false)
  })
})
