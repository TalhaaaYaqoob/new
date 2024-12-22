export interface FilterSettings {
  searchKeywords: string[]
  personalDescription: string
  topics: string[]
  platform: 'twitter' | 'linkedin' | 'all'
  carouselPosts: 'all' | 'carousels-only' | 'exclude-carousels'
  hashtagsInPost: 'all' | 'exclude'
  publishDate: string
  excludedAccounts: string[]
}

