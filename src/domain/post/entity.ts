import type { Category } from "../category/entity"
import type { PublicUser } from "../user/entity"

export interface Post {
    id: number
    title: string
    content: string
    categoryId: number | null
    authorId: number | null
}


export interface PostWithCategory {
    id: number
    title: string
    content: string
    categoryId: number | null
    authorId: number | null
    category: Category | null
    author: PublicUser | null
}


export interface CreatePostData {
    title: string
    content: string
    categoryId: number
    authorId: number
}