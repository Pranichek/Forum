import type { Post } from "../../domain/post/entity"

export interface PostService {
    getPosts(category: string | undefined, take: number | undefined): Post[]
    
    getPost(id: number): Post | undefined

    createPost(data: {
        title: string
        content: string
        author?: string | undefined
        category?: string | undefined
    }): Promise<Post>
}