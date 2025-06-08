'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'

interface FileMetadata {
  id: number
  fileName: string
  originalFileName: string
  fileType: string
  fileSize: number
  filePath: string
  uploadTime: string
}

interface FileContentResponse {
  content: string
  metadata: FileMetadata
}

const API_BASE_URL = 'http://localhost:8080/api/files'

export default function FileViewer() {
  const params = useParams()
  const router = useRouter()
  const fileName = params.fileName as string
  
  const [fileData, setFileData] = useState<FileContentResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchFileContent = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/content/${fileName}`)
        setFileData(response.data)
      } catch (error: any) {
        setError(error.response?.data || 'Failed to load file content')
      } finally {
        setLoading(false)
      }
    }

    if (fileName) {
      fetchFileContent()
    }
  }, [fileName])

  const handleDownload = () => {
    if (fileData) {
      const downloadUrl = `${API_BASE_URL}/download/${fileName}`
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = fileData.metadata.originalFileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={() => router.back()}
                className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!fileData) {
    return (
      <div className="text-center">
        <p className="text-gray-500">File not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {fileData.metadata.originalFileName}
              </h1>
              <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                <span>Type: {fileData.metadata.fileType.toUpperCase()}</span>
                <span>Size: {formatFileSize(fileData.metadata.fileSize)}</span>
                <span>Uploaded: {formatDate(fileData.metadata.uploadTime)}</span>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleDownload}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Download
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <pre className="whitespace-pre-wrap text-sm text-gray-900 font-mono overflow-x-auto">
              {fileData.content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}