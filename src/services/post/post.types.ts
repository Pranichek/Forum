import type { Post } from "../../domain/post/entity"

interface CreatePostInput {
    title: string
    content: string
    author?: string | undefined
    category?: string | undefined
}

export interface PostService {
    getPosts(category: string | undefined, take: number | undefined): Promise<Post[]>
    getPost(id: number): Promise<Post | null>
    createPost(data: CreatePostInput ): Promise<Post>
}