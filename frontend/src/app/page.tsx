'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import FileUpload from '@/components/FileUpload'
import FileList from '@/components/FileList'

interface FileMetadata {
  id: number
  fileName: string
  originalFileName: string
  fileType: string
  fileSize: number
  filePath: string
  uploadTime: string
}

const API_BASE_URL = 'http://localhost:8080/api/files'

export default function Home() {
  const [files, setFiles] = useState<FileMetadata[]>([])
  const [loading, setLoading] = useState(true)

  const fetchFiles = async () => {
    try {
      const response = await axios.get(API_BASE_URL)
      setFiles(response.data)
    } catch (error) {
      console.error('Error fetching files:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  const handleFileUpload = () => {
    fetchFiles() // Refresh the file list after upload
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Files</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all files in your account including their name, type, size and upload date.
          </p>
        </div>
      </div>
      
      <div className="mt-8">
        <FileUpload onUploadSuccess={handleFileUpload} />
      </div>

      <div className="mt-8">
        <FileList files={files} />
      </div>
    </div>
  )
}