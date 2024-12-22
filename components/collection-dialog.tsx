'use client'

import * as React from 'react'
import { Plus, FolderPlus } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useCollections } from '@/contexts/collections-context'
import type { SavedPost } from '@/types/collection'

interface CollectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  post: SavedPost
}

export function CollectionDialog({
  open,
  onOpenChange,
  post
}: CollectionDialogProps) {
  const { collections, addCollection, addPostToCollection } = useCollections()
  const [selectedCollection, setSelectedCollection] = React.useState<string>('')
  const [isCreating, setIsCreating] = React.useState(false)
  const [newCollectionName, setNewCollectionName] = React.useState('')

  // Reset state when dialog opens
  React.useEffect(() => {
    if (open) {
      setSelectedCollection('')
      setIsCreating(false)
      setNewCollectionName('')
    }
  }, [open])

  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      const newCollectionId = `collection-${Date.now()}`
      addCollection(newCollectionName.trim())
      setNewCollectionName('')
      setIsCreating(false)
      setSelectedCollection(newCollectionId)
    }
  }

  const handleSave = () => {
    if (selectedCollection) {
      addPostToCollection(selectedCollection, post)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Add to Collection</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {!isCreating ? (
            <div className="space-y-4">
              <RadioGroup value={selectedCollection} onValueChange={setSelectedCollection}>
                {collections.map((collection) => (
                  <div key={collection.id} className="flex items-center space-x-3 rounded-lg border p-4">
                    <RadioGroupItem value={collection.id} id={collection.id} />
                    <Label htmlFor={collection.id} className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        {collection.icon && <span>{collection.icon}</span>}
                        <span className="font-medium">{collection.name}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {collection.posts.length} posts
                      </p>
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <Button
                variant="outline"
                className="w-full border-dashed"
                onClick={() => setIsCreating(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Collection
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="collection-name">Collection Name</Label>
                <div className="relative">
                  <FolderPlus className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="collection-name"
                    placeholder="Enter collection name"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsCreating(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleCreateCollection}
                  disabled={!newCollectionName.trim()}
                >
                  Create
                </Button>
              </div>
            </div>
          )}
        </div>

        {!isCreating && (
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!selectedCollection}>
              Save
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

