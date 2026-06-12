export interface FontInfo {
  name: string
  family: string
  filePath: string
  format: string
  size: number
  installed: boolean
  installedDate?: Date
}

export type FilterType = 'all' | 'installed' | 'recent'

export interface FontStore {
  fonts: FontInfo[]
  loading: boolean
  error: string | null
  searchQuery: string
  filter: FilterType
  selectedFont: FontInfo | null
  previewText: string
}
