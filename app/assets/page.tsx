'use client'

import { useState, useCallback } from 'react'
import { Upload, AlertTriangle, Trash2 } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { SidebarNav } from '@/components/sidebar-nav'
import { useSidebar } from '@/contexts/sidebar-context'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface FileWithPreview extends File {
  preview?: string;
}

export default function AssetsPage() {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [fileToDelete, setFileToDelete] = useState<FileWithPreview | null>(null)
  const { isCollapsed } = useSidebar()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prevFiles => [
      ...prevFiles,
      ...acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      }))
    ])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
      'video/*': []
    }
  })

  const handleDelete = (file: FileWithPreview) => {
    setFileToDelete(file)
  }

  const confirmDelete = () => {
    if (fileToDelete) {
      setFiles(files.filter(f => f !== fileToDelete))
      URL.revokeObjectURL(fileToDelete.preview!)
      setFileToDelete(null)
    }
  }

  return (
    <div className={`min-h-screen bg-gray-50 transition-all duration-300 ${isCollapsed ? 'pl-20' : 'pl-64'}`}>
      <main className="p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">My assets</h1>
          
          <section className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Upload a new file to your library
            </h2>
            
            <div 
              {...getRootProps()} 
              className="bg-gray-100 border-2 border-dashed border-gray-200 rounded-lg p-12 text-center cursor-pointer transition-colors hover:border-gray-300"
            >
              <input {...getInputProps()} />
              <Upload className="h-6 w-6 mx-auto mb-4 text-gray-400" />
              <p className="text-sm text-gray-500">
                {isDragActive
                  ? "Drop the files here"
                  : "Click to Upload or drag & drop"
                }
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Your assets
            </h2>

            {files.length === 0 ? (
              <div className="bg-gray-100 rounded-lg p-12 text-center">
                <AlertTriangle className="h-6 w-6 mx-auto mb-4 text-gray-400" />
                <p className="text-sm text-gray-500">
                  You haven&apos;t saved any asset (image, video) yet. Add some above.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {files.map((file) => (
                  <div 
                    key={file.name}
                    className="aspect-square rounded-lg overflow-hidden bg-gray-200 relative group"
                  >
                    {file.type.startsWith('image/') ? (
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="w-full h-full object-cover"
                        onLoad={() => {
                          URL.revokeObjectURL(file.preview!)
                        }}
                      />
                    ) : (
                      <video
                        src={file.preview}
                        className="w-full h-full object-cover"
                        onLoadedData={() => {
                          URL.revokeObjectURL(file.preview!)
                        }}
                      />
                    )}
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDelete(file)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <AlertDialog open={!!fileToDelete} onOpenChange={() => setFileToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this asset?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the asset from your library.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 text-white hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

