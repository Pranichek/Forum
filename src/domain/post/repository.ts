import type { Post, PostWithCategory, CreatePostData } from "./entity"

export interface PostRepository {
    getAll(category: string | undefined, take: number | undefined): Promise<PostWithCategory[]>
    getById(id: number): Promise<PostWithCategory | null>
    addPost(data: CreatePostData): Promise<Post>
}