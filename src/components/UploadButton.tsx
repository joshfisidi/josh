'use client'

import { useState } from 'react'
import { upload } from '@vercel/blob/client'

interface UploadButtonProps {
  onUploadSuccess?: (url: string, id: string) => void;
}

const UploadButton = ({ onUploadSuccess }: UploadButtonProps) => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      setUploadSuccess(null)
      setUploadError(null)

      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      })

      setUploadSuccess(blob.url)
      if (blob.imageId) {
        onUploadSuccess?.(blob.url, blob.imageId)
      } else {
        onUploadSuccess?.(blob.url, blob.url)
      }
    } catch (error: any) {
      console.error('Error uploading file:', error)
      setUploadError(error.message || 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div>
      <label
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg 
          ${isUploading 
            ? 'bg-gray-300 cursor-not-allowed' 
            : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'
          } text-white transition-colors`}
      >
        <input
          type="file"
          className="hidden"
          onChange={handleUpload}
          disabled={isUploading}
          accept="image/*"
        />
        {isUploading ? 'Uploading...' : 'Upload Image'}
      </label>

      {uploadSuccess && (
        <div className="mt-2 text-green-500">
          Upload successful! <a href={uploadSuccess} target="_blank" rel="noopener noreferrer">View Image</a>
        </div>
      )}

      {uploadError && (
        <div className="mt-2 text-red-500">
          Error: {uploadError}
        </div>
      )}
    </div>
  )
}

export default UploadButton
