import type { Post } from "../../domain/post/entity"

interface CreatePostInput {
    title: string
    content: string
    categoryId: number
    authorId: number
}

export interface PostService {
    getPosts(category: string | undefined, take: number | undefined): Promise<Post[]>
    getPost(id: number): Promise<Post | null>
    getMyPosts(authorId: number): Promise<Post[]>
    createPost(data: CreatePostInput): Promise<Post | null>
}