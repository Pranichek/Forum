import type { CategoryResponse } from "../category/responses"
import type { UserResponse } from "../user/responses"

export interface PostResponse {
    id: number
    title: string
    content: string
    categoryId: number | null
    authorId: number | null
    category?: CategoryResponse | null
    author?: UserResponse | null
}