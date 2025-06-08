'use client'

import { useState } from 'react'
import Link from 'next/link'

interface FileMetadata {
  id: number
  fileName: string
  originalFileName: string
  fileType: string
  fileSize: number
  filePath: string
  uploadTime: string
}

interface FileListProps {
  files: FileMetadata[]
}

const API_BASE_URL = 'http://localhost:8080/api/files'

export default function FileList({ files }: FileListProps) {
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

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'txt':
        return '📄'
      case 'json':
        return '📋'
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return '🖼️'
      case 'pdf':
        return '📕'
      case 'doc':
      case 'docx':
        return '📘'
      default:
        return '📁'
    }
  }

  const handleDownload = (fileName: string, originalFileName: string) => {
    const downloadUrl = `${API_BASE_URL}/download/${fileName}`
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = originalFileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const isTextFile = (fileType: string) => {
    return ['txt', 'json'].includes(fileType.toLowerCase())
  }

  if (files.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📁</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No files uploaded</h3>
          <p className="text-gray-500">Upload your first file to get started.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Your Files</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                File
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Upload Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {files.map((file) => (
              <tr key={file.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{getFileIcon(file.fileType)}</span>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {file.originalFileName}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                    {file.fileType.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatFileSize(file.fileSize)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(file.uploadTime)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {isTextFile(file.fileType) && (
                    <Link
                      href={`/file/${file.fileName}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </Link>
                  )}
                  <button
                    onClick={() => handleDownload(file.fileName, file.originalFileName)}
                    className="text-green-600 hover:text-green-900"
                  >
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}