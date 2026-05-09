import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { convertCV } from '../lib/axios'
import { ApiError } from '@cv-ats/shared'
import { AxiosError } from 'axios'

export interface ConvertInput {
  file: File
  jobDescription: string
  geminiApiKey: string
}

export interface ConvertResult {
  blob: Blob
  blobUrl: string
}

function extractApiError(err: unknown): ApiError | null {
  if (err instanceof AxiosError && err.response?.data) {
    const data = err.response.data as ApiError
    if (typeof data.error === 'string' && typeof data.code === 'string') {
      return data
    }
  }
  return null
}

export function useConvert() {
  // Retained across renders for re-download (US3 — never revoke)
  const [blobUrl, setBlobUrl] = useState<string | null>(null)

  const mutation = useMutation<ConvertResult, Error, ConvertInput>({
    mutationFn: async ({ file, jobDescription, geminiApiKey }: ConvertInput) => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('jobDescription', jobDescription)
      formData.append('geminiApiKey', geminiApiKey)
      const blob = await convertCV(formData)
      const url = URL.createObjectURL(blob)
      return { blob, blobUrl: url }
    },
    onSuccess: ({ blobUrl: url }) => {
      setBlobUrl(url)
    },
  })

  const apiError = mutation.error ? extractApiError(mutation.error) : null

  return {
    convert: (input: ConvertInput, callbacks?: { onSuccess?: (url: string) => void; onError?: () => void }) => {
      mutation.mutate(input, {
        onSuccess: ({ blobUrl: url }) => callbacks?.onSuccess?.(url),
        onError: () => callbacks?.onError?.(),
      })
    },
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    blobUrl,
    error: apiError,
    reset: () => {
      mutation.reset()
      setBlobUrl(null)
    },
  }
}
