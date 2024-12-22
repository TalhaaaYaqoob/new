'use client'

import { useState, useRef } from 'react'
import { Plus, Save, ChevronDown, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SidebarNav } from '@/components/sidebar-nav'
import { useCollections } from '@/contexts/collections-context'
import { CollectionCard } from '@/components/collection-card'
import { useSidebar } from '@/contexts/sidebar-context'
import { CreateCollectionDialog } from '@/components/create-collection-dialog'
import { DeleteCollectionDialog } from '@/components/delete-collection-dialog'

export default function CollectionsPage() {
  const { isCollapsed } = useSidebar()
  const { collections, deleteCollection } = useCollections()
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [collectionToDelete, setCollectionToDelete] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Here you would typically call a function to process the file
      console.log('File selected:', selectedFile.name);
    }
  };

  const handleDeleteCollection = (collectionId: string) => {
    setCollectionToDelete(collectionId)
  }

  const confirmDeleteCollection = () => {
    if (collectionToDelete) {
      deleteCollection(collectionToDelete)
      setCollectionToDelete(null)
      setSelectedCollection(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SidebarNav />
      <main className={`flex-1 p-8 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Collections</h1>
          
          <Tabs defaultValue="my-collections" className="space-y-6">
            <TabsList>
              <TabsTrigger value="staff-picks" className="text-sm">Staff Picks</TabsTrigger>
              <TabsTrigger value="my-collections" className="text-sm">My Collections</TabsTrigger>
            </TabsList>

            <TabsContent value="my-collections" className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Select value={selectedCollection || ''} onValueChange={setSelectedCollection}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="All my saved posts" />
                    </SelectTrigger>
                    <SelectContent>
                      {collections.map((collection) => (
                        <SelectItem key={collection.id} value={collection.id}>
                          <span className="flex items-center gap-2">
                            {collection.icon}
                            {collection.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button variant="outline" size="icon" onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4" />
                  </Button>

                  {selectedCollection && selectedCollection !== 'all' && (
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleDeleteCollection(selectedCollection)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <>
                    <input
                      type="file"
                      accept=".csv,.xls,.xlsx"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                      ref={fileInputRef}
                    />
                    <Button 
                      variant="outline" 
                      className="text-sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Import Posts
                    </Button>
                  </>
                  <Button variant="outline" className="text-sm text-blue-600">
                    Share Public Url
                  </Button>
                </div>
              </div>

              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {collections.map((collection) => (
                  <CollectionCard key={collection.id} collection={collection} />
                ))}
              </div>

              {collections.length === 0 && (
                <div className="text-center py-12">
                  <Save className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    You haven't saved any posts yet
                  </h3>
                  <p className="text-sm text-gray-500">
                    Save posts from your searches on Scrybe and they will appear here.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="staff-picks">
              <div className="min-h-[400px] flex items-center justify-center text-center p-8">
                <p className="text-gray-500">Staff picks coming soon...</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <CreateCollectionDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />

      <DeleteCollectionDialog
        open={!!collectionToDelete}
        onOpenChange={() => setCollectionToDelete(null)}
        onConfirm={confirmDeleteCollection}
      />
    </div>
  )
}

