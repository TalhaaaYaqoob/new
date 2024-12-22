'use client'

import { format } from 'date-fns'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
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
import type { Draft } from '@/types/editor'
import { useState } from 'react'

interface DraftsSidebarProps {
  drafts: Draft[]
  selectedDraftId: string | null
  onDraftSelect: (draft: Draft) => void
  onDraftDelete?: (draftId: string) => void
}

export function DraftsSidebar({ 
  drafts, 
  selectedDraftId, 
  onDraftSelect,
  onDraftDelete 
}: DraftsSidebarProps) {
  const [draftToDelete, setDraftToDelete] = useState<string | null>(null)

  const handleDeleteClick = (draftId: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent draft selection when clicking delete
    setDraftToDelete(draftId)
  }

  const handleConfirmDelete = () => {
    if (draftToDelete && onDraftDelete) {
      onDraftDelete(draftToDelete)
    }
    setDraftToDelete(null)
  }

  return (
    <>
      <div className="w-64 border-l border-gray-200 bg-white h-screen overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Drafts</h2>
          <div className="space-y-4">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className={cn(
                  "p-3 rounded-lg hover:bg-gray-50 cursor-pointer group",
                  selectedDraftId === draft.id && "bg-gray-50"
                )}
                onClick={() => onDraftSelect(draft)}
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-sm">{draft.title}</h3>
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600"
                      onClick={(e) => handleDeleteClick(draft.id, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {draft.content}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {format(draft.lastEdited, 'MMM d, yyyy')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AlertDialog open={!!draftToDelete} onOpenChange={() => setDraftToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This draft will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

