import type { Post } from "./entity"

export interface PostRepository {
  getAll(category: string | undefined, take: number | undefined): Post[]
  getById(id: number): Post | undefined
  addPost(data: {
    title: string
    content: string
    author?: string | undefined
    category?: string | undefined
  }): Promise<Post>
}