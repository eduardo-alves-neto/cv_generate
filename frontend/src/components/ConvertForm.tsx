import { useState, useRef, FormEvent, ChangeEvent } from 'react'
import { AlertCircle } from 'lucide-react'
import { ApiErrorCode } from '@cv-ats/shared'
import { useConvert } from '../hooks/useConvert'

const MAX_FILE_BYTES = 10 * 1024 * 1024
const MAX_JOB_DESC_CHARS = 10_000

const ERROR_MESSAGES: Record<ApiErrorCode, string> = {
  INVALID_FILE: 'Only PDF files are accepted. Please upload a .pdf file.',
  FILE_TOO_LARGE: 'The file exceeds the 10 MB limit. Please upload a smaller PDF.',
  INVALID_JOB_DESCRIPTION: 'Please enter a valid job description (1–10 000 characters).',
  UNREADABLE_PDF:
    'This PDF has no extractable text (it may be an image scan). Please use a text-based PDF.',
  AI_UNAVAILABLE:
    'The local AI service is not running. Start it with: ollama serve',
  AI_TIMEOUT:
    'The AI service timed out. Please try again or use a faster model (e.g. llama3.2:1b).',
  INTERNAL_ERROR: 'An unexpected error occurred. Please try again.',
}

interface ConvertFormProps {
  onConvertStart: () => void
  onConvertSuccess: (blobUrl: string) => void
  onConvertError: () => void
}

export function ConvertForm({ onConvertStart, onConvertSuccess, onConvertError }: ConvertFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [clientError, setClientError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { convert, isPending, error: apiError } = useConvert()

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setClientError(null)

    if (file) {
      if (file.type !== 'application/pdf') {
        setClientError('Only PDF files are accepted.')
        setSelectedFile(null)
        return
      }
      if (file.size > MAX_FILE_BYTES) {
        setClientError('File exceeds the 10 MB limit.')
        setSelectedFile(null)
        return
      }
    }

    setSelectedFile(file)
  }

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

    onConvertStart()
    convert(
      { file: selectedFile, jobDescription },
      {
        onSuccess: (url) => onConvertSuccess(url),
        onError: () => onConvertError(),
      },
    )
  }

  const displayError = clientError ?? (apiError ? ERROR_MESSAGES[apiError.code] ?? apiError.error : null)

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full" noValidate>
      {/* File upload */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground" htmlFor="cv-file">
          PDF Resume <span className="text-destructive">*</span>
        </label>
        <input
          id="cv-file"
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          disabled={isPending}
          className="block w-full text-sm text-muted-foreground
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-medium
            file:bg-primary file:text-primary-foreground
            hover:file:bg-primary/90
            disabled:opacity-50 disabled:cursor-not-allowed
            cursor-pointer"
          aria-describedby="file-hint"
        />
        <p id="file-hint" className="text-xs text-muted-foreground">
          Text-based PDF only · max 10 MB
        </p>
        {selectedFile && (
          <p className="text-xs text-muted-foreground">
            Selected: {selectedFile.name}
          </p>
        )}
      </div>

      {/* Job description */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground" htmlFor="job-description">
          Job Description <span className="text-destructive">*</span>
        </label>
        <textarea
          id="job-description"
          value={jobDescription}
          onChange={e => setJobDescription(e.target.value)}
          maxLength={MAX_JOB_DESC_CHARS}
          rows={8}
          disabled={isPending}
          placeholder="Paste the full job posting here…"
          className="w-full rounded-md border border-input bg-background px-3 py-2
            text-sm text-foreground placeholder:text-muted-foreground
            focus:outline-none focus:ring-2 focus:ring-ring
            disabled:opacity-50 disabled:cursor-not-allowed
            resize-y min-h-[160px]"
        />
        <p className="text-xs text-muted-foreground text-right">
          {jobDescription.length} / {MAX_JOB_DESC_CHARS}
        </p>
      </div>

      {/* Error display */}
      {displayError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-md border border-destructive/50
            bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{displayError}</span>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending || !selectedFile || !jobDescription.trim()}
        className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium
          text-primary-foreground transition-colors
          hover:bg-primary/90
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? 'Converting…' : 'Convert to ATS'}
      </button>
    </form>
  )
}
