export interface Book {
  id: string
  title: string
  author: string
  description: string | null
  publication_year: number | null
  genre: string | null
  created_at: string
  updated_at: string
}

export type BookFormData = Omit<Book, 'id' | 'created_at' | 'updated_at'>
