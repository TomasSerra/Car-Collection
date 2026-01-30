import { useState, useCallback } from 'react'
import { compressImage, formatFileSize } from '@/lib/compression'

interface UseImageUploadResult {
  file: File | null
  preview: string | null
  error: string | null
  isCompressing: boolean
  originalSize: string | null
  compressedSize: string | null
  handleFileSelect: (file: File) => Promise<void>
  clearFile: () => void
}

export function useImageUpload(): UseImageUploadResult {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isCompressing, setIsCompressing] = useState(false)
  const [originalSize, setOriginalSize] = useState<string | null>(null)
  const [compressedSize, setCompressedSize] = useState<string | null>(null)

  const handleFileSelect = useCallback(async (selectedFile: File) => {
    setError(null)

    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    setOriginalSize(formatFileSize(selectedFile.size))
    setIsCompressing(true)

    try {
      const compressed = await compressImage(selectedFile)
      setFile(compressed)
      setCompressedSize(formatFileSize(compressed.size))

      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(compressed)
    } catch {
      setError('Failed to process image')
    } finally {
      setIsCompressing(false)
    }
  }, [])

  const clearFile = useCallback(() => {
    setFile(null)
    setPreview(null)
    setError(null)
    setOriginalSize(null)
    setCompressedSize(null)
  }, [])

  return {
    file,
    preview,
    error,
    isCompressing,
    originalSize,
    compressedSize,
    handleFileSelect,
    clearFile,
  }
}
