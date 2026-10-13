import type { Post, PostWithCategory } from "../../domain/post/entity"

interface CreatePostInput {
    title: string
    content: string
    author?: string | undefined
    categoryId: number
}
export interface PostService {
    getPosts(category: string | undefined, take: number | undefined): Promise<PostWithCategory[]>
    getPost(id: number): Promise<PostWithCategory | null>
    createPost(data: CreatePostInput): Promise<Post | null>
}