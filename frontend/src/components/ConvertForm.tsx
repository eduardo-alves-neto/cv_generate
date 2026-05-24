import { useState, FormEvent } from 'react'
import { AlertCircle } from 'lucide-react'
import { ApiErrorCode } from '@cv-ats/shared'
import { useConvert } from '../hooks/useConvert'
import { useApiKey } from '../hooks/useApiKey'
import { DropZone } from './DropZone'
import { ApiKeySetup } from './ApiKeySetup'

const MAX_JOB_DESC_CHARS = 10_000

const ERROR_MESSAGES: Record<ApiErrorCode, string> = {
  INVALID_FILE: 'Only PDF files are accepted. Please upload a .pdf file.',
  FILE_TOO_LARGE: 'The file exceeds the 10 MB limit. Please upload a smaller PDF.',
  INVALID_JOB_DESCRIPTION: 'Please enter a valid job description (1–10 000 characters).',
  UNREADABLE_PDF:
    'This PDF has no extractable text (it may be an image scan). Please use a text-based PDF.',
  AI_UNAVAILABLE:
    'Chave da API Gemini inválida ou com quota esgotada. Verifique sua chave na seção acima.',
  AI_TIMEOUT: 'The AI service timed out. Please try again.',
  INTERNAL_ERROR: 'An unexpected error occurred. Please try again.',
}

interface ConvertFormProps {
  onConvertStart: () => void
  onConvertSuccess: (blobUrl: string) => void
  onConvertError: () => void
}

export function ConvertForm({
  onConvertStart,
  onConvertSuccess,
  onConvertError,
}: ConvertFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [clientError, setClientError] = useState<string | null>(null)

  const { apiKey, setApiKey, clearApiKey } = useApiKey()
  const { convert, isPending, error: apiError } = useConvert()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setClientError(null)

    if (!selectedFile) {
      setClientError('Please select a PDF file.')
      return
    }
    if (!jobDescription.trim()) {
      setClientError('Please paste a job description.')
      return
    }
    if (!apiKey) {
      setClientError('Configure sua chave da API Gemini antes de converter.')
      return
    }

    onConvertStart()
    convert(
      { file: selectedFile, jobDescription, geminiApiKey: apiKey },
      {
        onSuccess: (url) => onConvertSuccess(url),
        onError: () => onConvertError(),
      },
    )
  }

  const displayError = clientError ?? (apiError ? ERROR_MESSAGES[apiError.code] ?? apiError.error : null)

  if (!apiKey) {
    return <ApiKeySetup onSave={setApiKey} />
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5" noValidate>
      {/* API key status bar */}
      <div className="flex items-center justify-between border border-border bg-muted/40 px-3 py-2">
        <span className="ts-caption text-muted-foreground">Chave da API configurada</span>
        <button
          type="button"
          onClick={clearApiKey}
          className="ts-caption text-destructive hover:underline underline-offset-4"
        >
          Remover chave
        </button>
      </div>

      {/* Two-column grid: job description (left) · PDF upload (right) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 items-start">
        {/* Left column — Job Description */}
        <div className="flex flex-col gap-2">
          <label className="ts-caption font-semibold text-muted-foreground" htmlFor="job-description">
            Job Description <span className="text-destructive">*</span>
          </label>
          <textarea
            id="job-description"
            value={jobDescription}
            onChange={e => setJobDescription(e.target.value)}
            maxLength={MAX_JOB_DESC_CHARS}
            rows={10}
            disabled={isPending}
            placeholder="Paste the full job posting here…"
            className="w-full border border-input bg-background px-4 py-3
              ts-body-sm text-foreground placeholder:text-muted-foreground
              focus:outline-none focus:border-primary focus:ring-2 focus:ring-background focus:ring-offset-2 focus:ring-offset-primary
              disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted
              resize-y min-h-[200px]"
          />
          <p className="ts-caption text-right text-muted-foreground">
            {jobDescription.length} / {MAX_JOB_DESC_CHARS}
          </p>
        </div>

        {/* Right column — PDF Upload */}
        <div className="flex flex-col gap-2">
          <p className="ts-caption font-semibold text-muted-foreground">
            PDF Resume <span className="text-destructive">*</span>
          </p>
          <DropZone
            selectedFile={selectedFile}
            onFileSelect={(file) => {
              setClientError(null)
              setSelectedFile(file)
            }}
            onFileError={() => {
              setSelectedFile(null)
            }}
            disabled={isPending}
          />
        </div>
      </div>

      {/* Error display — full width */}
      {displayError && (
        <div
          role="alert"
          className="flex items-start gap-2 border border-destructive/50
            bg-destructive/10 px-3 py-2 ts-body-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{displayError}</span>
        </div>
      )}

      {/* Submit — full width */}
      <button
        type="submit"
        disabled={isPending || !selectedFile || !jobDescription.trim() || !apiKey}
        className="w-full bg-primary px-6 py-3 ts-body-sm font-semibold
          text-primary-foreground transition-colors
          hover:bg-[#57534E]
          active:bg-[#44403C]
          disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isPending ? 'Converting…' : 'Convert to ATS'}
      </button>

      {/* Privacy disclosure — required by Constitution Principle I */}
      <p className="text-center ts-caption text-muted-foreground">
        Seu currículo e a vaga são processados pelo Google Gemini AI. Nenhum dado é armazenado.
      </p>
    </form>
  )
}
