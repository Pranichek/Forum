import type { Category } from "./entity"

export interface CategoryRepository {
    findAll(): Promise<Category[]>
    findById(id: number): Promise<Category | null>
    findByName(name: string): Promise<Category | null>
    create(data: Omit<Category, "id">): Promise<Category>
}