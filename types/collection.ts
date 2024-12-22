export interface SavedPost {
  id: string
  content: string
  date: string
  avatar: string
  likes: number
  views: number
  name: string
}

export interface Collection {
  id: string
  name: string
  posts: SavedPost[]
  icon?: string
}

