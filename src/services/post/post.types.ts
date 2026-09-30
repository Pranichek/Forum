import type { Post } from "../../domain/post/entity"

interface CreatePostInput {
    title: string
    content: string
    author?: string | undefined
    category?: string | undefined
}

export interface PostService {
    getPosts(category: string | undefined, take: number | undefined): Post[]
    getPost(id: number): Post | undefined
    createPost(data: CreatePostInput ): Promise<Post>
}