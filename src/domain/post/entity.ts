import type { Category } from "../category/entity"

export interface Post {
    id: number
    title: string
    content: string
    author: string | null       
    categoryId: number | null   
}


export interface PostWithCategory extends Post {
    category: Category | null
}


export interface CreatePostData {
    title: string
    content: string
    author?: string | undefined   
    categoryId: number
}