import { useState } from 'react'

const STORAGE_KEY = 'cv_ats_gemini_api_key'

export function useApiKey() {
  const [apiKey, setApiKeyState] = useState<string | null>(
    () => localStorage.getItem(STORAGE_KEY) ?? null,
  )

  function setApiKey(key: string) {
    localStorage.setItem(STORAGE_KEY, key)
    setApiKeyState(key)
  }

  function clearApiKey() {
    localStorage.removeItem(STORAGE_KEY)
    setApiKeyState(null)
  }

  return { apiKey, setApiKey, clearApiKey }
}
