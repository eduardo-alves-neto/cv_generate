import { z } from 'zod'

export const ConvertRequestBodySchema = z.object({
  jobDescription: z.string().min(1, 'Job description is required').max(10_000, 'Job description must be at most 10 000 characters'),
})

export const ApiErrorCodeSchema = z.enum([
  'INVALID_FILE',
  'FILE_TOO_LARGE',
  'INVALID_JOB_DESCRIPTION',
  'UNREADABLE_PDF',
  'AI_UNAVAILABLE',
  'AI_TIMEOUT',
  'INTERNAL_ERROR',
])

export const ApiErrorSchema = z.object({
  error: z.string(),
  code: ApiErrorCodeSchema,
})

export type ApiErrorCode = z.infer<typeof ApiErrorCodeSchema>
export type ApiError = z.infer<typeof ApiErrorSchema>
export type ConvertRequestBody = z.infer<typeof ConvertRequestBodySchema>
