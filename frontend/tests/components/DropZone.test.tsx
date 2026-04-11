import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DropZone } from '../../src/components/DropZone'

function makePdfFile(name = 'cv.pdf', sizeBytes = 500_000): File {
  const file = new File(['%PDF-1.4'], name, { type: 'application/pdf' })
  Object.defineProperty(file, 'size', { value: sizeBytes })
  return file
}

function makeNonPdfFile(): File {
  return new File(['hello'], 'doc.docx', {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  })
}

describe('DropZone', () => {
  const defaultProps = {
    onFileSelect: vi.fn(),
    onFileError: vi.fn(),
    selectedFile: null,
    disabled: false,
  }

  it('renders idle state with upload prompt', () => {
    render(<DropZone {...defaultProps} />)
    expect(screen.getByText(/Drag & drop your PDF resume/i)).toBeInTheDocument()
    expect(screen.getByText(/click to browse/i)).toBeInTheDocument()
  })

  it('shows selected file name and size when selectedFile is provided', () => {
    const file = makePdfFile('my-resume.pdf', 1_048_576)
    render(<DropZone {...defaultProps} selectedFile={file} />)
    expect(screen.getByText('my-resume.pdf')).toBeInTheDocument()
    expect(screen.getByText(/1\.00 MB/)).toBeInTheDocument()
  })

  it('shows drag prompt when file is dragged over', () => {
    const { container } = render(<DropZone {...defaultProps} />)
    const zone = container.firstChild as HTMLElement
    fireEvent.dragEnter(zone, { dataTransfer: { files: [] } })
    expect(screen.getByText(/Drop your file here/i)).toBeInTheDocument()
  })

  it('calls onFileSelect with file when a valid PDF is dropped', () => {
    const onFileSelect = vi.fn()
    const { container } = render(<DropZone {...defaultProps} onFileSelect={onFileSelect} />)
    const zone = container.firstChild as HTMLElement
    const file = makePdfFile()

    fireEvent.drop(zone, { dataTransfer: { files: [file] } })

    expect(onFileSelect).toHaveBeenCalledWith(file)
  })

  it('calls onFileError when a non-PDF file is dropped', () => {
    const onFileError = vi.fn()
    const { container } = render(<DropZone {...defaultProps} onFileError={onFileError} />)
    const zone = container.firstChild as HTMLElement

    fireEvent.drop(zone, { dataTransfer: { files: [makeNonPdfFile()] } })

    expect(onFileError).toHaveBeenCalledWith(expect.stringMatching(/PDF/i))
    expect(screen.getByText(/Only PDF files are accepted/i)).toBeInTheDocument()
  })

  it('calls onFileError when a PDF exceeds 10 MB', () => {
    const onFileError = vi.fn()
    const { container } = render(<DropZone {...defaultProps} onFileError={onFileError} />)
    const zone = container.firstChild as HTMLElement
    const bigFile = makePdfFile('huge.pdf', 11 * 1024 * 1024)

    fireEvent.drop(zone, { dataTransfer: { files: [bigFile] } })

    expect(onFileError).toHaveBeenCalledWith(expect.stringMatching(/10 MB/i))
  })

  it('does not call onFileSelect when disabled and a file is dropped', () => {
    const onFileSelect = vi.fn()
    const { container } = render(
      <DropZone {...defaultProps} onFileSelect={onFileSelect} disabled />,
    )
    const zone = container.firstChild as HTMLElement

    fireEvent.drop(zone, { dataTransfer: { files: [makePdfFile()] } })

    expect(onFileSelect).not.toHaveBeenCalled()
  })

  it('sets aria-disabled when disabled', () => {
    const { container } = render(<DropZone {...defaultProps} disabled />)
    const zone = container.firstChild as HTMLElement
    expect(zone).toHaveAttribute('aria-disabled', 'true')
  })
})
