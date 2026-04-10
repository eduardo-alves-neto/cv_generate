import { Request, Response, NextFunction } from 'express'
import { ApiErrorCode } from '@cv-ats/shared'

const statusMap: Record<ApiErrorCode, number> = {
  INVALID_FILE: 415,
  FILE_TOO_LARGE: 413,
  INVALID_JOB_DESCRIPTION: 400,
  UNREADABLE_PDF: 422,
  AI_UNAVAILABLE: 503,
  AI_TIMEOUT: 504,
  INTERNAL_ERROR: 500,
}

export class AppError extends Error {
  constructor(
    public readonly code: ApiErrorCode,
    message: string,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    const status = statusMap[err.code] ?? 500
    res.status(status).json({ error: err.message, code: err.code })
    return
  }

  // Multer file size error
  if (
    err instanceof Error &&
    (err as NodeJS.ErrnoException).code === 'LIMIT_FILE_SIZE'
  ) {
    res.status(413).json({
      error: 'File exceeds the maximum allowed size of 10 MB.',
      code: 'FILE_TOO_LARGE',
    })
    return
  }

  console.error('Unhandled error:', err)
  res.status(500).json({
    error: 'An unexpected error occurred.',
    code: 'INTERNAL_ERROR',
  })
}
