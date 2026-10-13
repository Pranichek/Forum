import type { CategoryResponse } from "../category/responses"

export interface PostResponse {
    id: number
    title: string
    content: string
    author: string | null
    categoryId: number | null     
    category?: CategoryResponse | null
}