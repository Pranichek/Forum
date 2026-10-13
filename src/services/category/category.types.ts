import type { Category } from "../../domain/category/entity"

export interface CreateCategoryInput {
    name: string    
}

export interface CategoryService {
    getCategories(): Promise<Category[]>
    getCategory(id: number): Promise<Category | null>
    createCategory(data: CreateCategoryInput): Promise<Category | null>
}