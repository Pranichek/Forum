import type { Post } from "./entity"

export interface CreatePostData {
    title: string
    content: string
    categoryId: number
    authorId: number
}

export interface PostRepository {
    getAll(category: string | undefined, take: number | undefined): Promise<Post[]>
    getById(id: number): Promise<Post | null>
    addPost(data: CreatePostData): Promise<Post>
    getByAuthorId(authorId: number): Promise<Post[]>
}