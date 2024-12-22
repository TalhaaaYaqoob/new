'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Collection, SavedPost } from '@/types/collection'

interface CollectionsContextType {
  collections: Collection[]
  addCollection: (name: string) => void
  addPostToCollection: (collectionId: string, post: SavedPost) => void
  removePostFromCollection: (collectionId: string, postId: string) => void
  deleteCollection: (collectionId: string) => void
}

const CollectionsContext = createContext<CollectionsContextType | undefined>(undefined)

export function CollectionsProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClientComponentClient()
  const [collections, setCollections] = useState<Collection[]>([
    { id: 'all', name: 'All my saved posts', posts: [], icon: '📑' },
    { id: 'first', name: 'My First Collection', posts: [] }
  ])

  useEffect(() => {
    loadSavedPosts()
  }, [])

  const loadSavedPosts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: savedPosts, error } = await supabase
        .from('saved_posts')
        .select('post_data, collection_id')
        .eq('user_id', user.id)

      if (error) throw error

      if (savedPosts) {
        const postsByCollection = savedPosts.reduce((acc, { post_data, collection_id }) => {
          if (!acc[collection_id]) {
            acc[collection_id] = []
          }
          acc[collection_id].push(post_data as SavedPost)
          return acc
        }, {} as Record<string, SavedPost[]>)

        setCollections(prev => prev.map(collection => ({
          ...collection,
          posts: postsByCollection[collection.id] || []
        })))
      }
    } catch (error) {
      console.error('Error loading saved posts:', error)
    }
  }

  const addCollection = (name: string) => {
    const newCollection: Collection = {
      id: `collection-${Date.now()}`,
      name,
      posts: [],
      icon: '📁'
    }
    setCollections(prev => [...prev, newCollection])
  }

  const addPostToCollection = async (collectionId: string, post: SavedPost) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Always try to insert
      const { error } = await supabase
        .from('saved_posts')
        .insert({
          user_id: user.id,
          collection_id: collectionId,
          post_data: post
        })

      // Only throw if it's not a duplicate error
      if (error && !error.message.includes('duplicate key value')) {
        throw error
      }

      // Update local state regardless of duplicate error
      setCollections(prev => prev.map(collection => {
        if (collection.id === collectionId) {
          // Check if post already exists in this collection
          const postExists = collection.posts.some(p => p.id === post.id)
          if (!postExists) {
            return {
              ...collection,
              posts: [...collection.posts, post]
            }
          }
        }
        return collection
      }))
    } catch (error) {
      console.error('Error saving post:', error)
    }
  }

  const removePostFromCollection = async (collectionId: string, postId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('saved_posts')
        .delete()
        .match({ 
          user_id: user.id, 
          collection_id: collectionId 
        })
        .filter('post_data->id', 'eq', postId)

      if (error) throw error

      setCollections(prev => prev.map(collection => {
        if (collection.id === collectionId) {
          return {
            ...collection,
            posts: collection.posts.filter(post => post.id !== postId)
          }
        }
        return collection
      }))
    } catch (error) {
      console.error('Error removing post:', error)
    }
  }

  const deleteCollection = (collectionId: string) => {
    setCollections(prev => prev.filter(collection => collection.id !== collectionId))
  }

  return (
    <CollectionsContext.Provider value={{
      collections,
      addCollection,
      addPostToCollection,
      removePostFromCollection,
      deleteCollection
    }}>
      {children}
    </CollectionsContext.Provider>
  )
}

export function useCollections() {
  const context = useContext(CollectionsContext)
  if (context === undefined) {
    throw new Error('useCollections must be used within a CollectionsProvider')
  }
  return context
}

