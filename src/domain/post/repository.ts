import type { Post } from "./entity"

export interface PostRepository {
  getAll(category: string | null | undefined, take: number | null | undefined): Promise<Post[]>
  getById(id: number): Promise<Post | null>
  addPost(data: {
    title: string
    content: string
    author?: string | null | undefined
    category?: string | null | undefined
  }): Promise<Post>
}