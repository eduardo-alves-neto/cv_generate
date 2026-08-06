import { useState, useRef, useEffect, DragEvent, ChangeEvent, KeyboardEvent } from 'react'
import { FileCheck2, UploadCloud, XCircle } from 'lucide-react'
import { clsx } from 'clsx'

const MAX_FILE_BYTES = 10 * 1024 * 1024

export interface DropZoneProps {
  onFileSelect: (file: File) => void
  onFileError: (message: string) => void
  selectedFile: File | null
  disabled?: boolean
}

export function DropZone({
  onFileSelect,
  onFileError,
  selectedFile,
  disabled = false,
}: DropZoneProps) {
  const [dragActive, setDragActive] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const dragCounterRef = useRef(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // When parent clears the file (e.g. on reset), clear our error state too
  useEffect(() => {
    if (!selectedFile) {
      setErrorMsg(null)
      dragCounterRef.current = 0
    }
  }, [selectedFile])

  function validateAndSelect(file: File) {
    if (file.type !== 'application/pdf') {
      const msg = 'Only PDF files are accepted.'
      setErrorMsg(msg)
      onFileError(msg)
      return
    }
    if (file.size > MAX_FILE_BYTES) {
      const msg = 'File exceeds the 10 MB limit.'
      setErrorMsg(msg)
      onFileError(msg)
      return
    }
    setErrorMsg(null)
    onFileSelect(file)
  }

  function handleDragEnter(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    if (disabled) return
    dragCounterRef.current++
    setDragActive(true)
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    if (disabled) return
    dragCounterRef.current--
    if (dragCounterRef.current === 0) setDragActive(false)
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    dragCounterRef.current = 0
    setDragActive(false)
    if (disabled) return
    const file = e.dataTransfer.files[0]
    if (file) validateAndSelect(file)
  }

  function handleClick() {
    if (!disabled) inputRef.current?.click()
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      handleClick()
    }
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) validateAndSelect(file)
    // Reset so the same file can be re-selected after an error
    e.target.value = ''
  }

  const hasError = errorMsg !== null && selectedFile === null
  const isSelected = selectedFile !== null

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-label="Upload PDF resume"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={clsx(
        'flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed',
        'px-6 py-9 text-center transition-colors duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        !disabled && 'cursor-pointer',
        {
          'border-hairline-strong bg-card hover:border-ink hover:bg-accent/20':
            !dragActive && !isSelected && !hasError && !disabled,
          'border-ink bg-muted/20': dragActive,
          'border-success bg-accent/20': isSelected,
          'border-destructive bg-destructive/5': hasError,
          'cursor-not-allowed opacity-40': disabled,
        },
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleInputChange}
        disabled={disabled}
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
      />

      {isSelected ? (
        <>
          <FileCheck2 className="h-10 w-10 text-success" aria-hidden="true" />
          <div>
            <p className="ts-body-sm font-medium text-foreground">{selectedFile.name}</p>
            <p className="mt-1 ts-caption text-muted-foreground">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB &middot; Click to change
            </p>
          </div>
        </>
      ) : hasError ? (
        <>
          <XCircle className="h-10 w-10 text-destructive" aria-hidden="true" />
          <div>
            <p className="ts-body-sm font-medium text-destructive">{errorMsg}</p>
            <p className="mt-1 ts-caption text-muted-foreground">Click or drag to try again</p>
          </div>
        </>
      ) : (
        <>
          <UploadCloud
            className={clsx(
              'h-10 w-10 transition-colors',
              dragActive ? 'text-primary' : 'text-muted-foreground',
            )}
            aria-hidden="true"
          />
          <div>
            <p className="ts-body-sm font-medium text-foreground">
              {dragActive ? 'Drop your file here' : 'Drag & drop your PDF resume'}
            </p>
            <p className="mt-1 ts-caption text-muted-foreground">
              or click to browse &middot; max 10 MB
            </p>
          </div>
        </>
      )}
    </div>
  )
}
