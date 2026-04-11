import multer, { FileFilterCallback } from 'multer'
import { Request } from 'express'
import { AppError } from './errorHandler'

const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE_BYTES ?? 10_485_760)

function fileFilter(
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void {
  if (file.mimetype !== 'application/pdf') {
    cb(new AppError('INVALID_FILE', 'Only PDF files are accepted. Please upload a .pdf file.'))
    return
  }
  cb(null, true)
}

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
})
