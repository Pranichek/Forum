import type { CategoryRepository } from "../../domain/category/repository"
import type { CategoryService } from "./category.types"


export function createCategoryService(categoryRepository: CategoryRepository): CategoryService {
    return {
        getCategories() {
            return categoryRepository.findAll()
        },

        getCategory(id) {
            return categoryRepository.findById(id)
        },
        async createCategory(data) {
            const existingCategory = await categoryRepository.findByName(data.name)

            if (existingCategory) return null

            const newCategory = await categoryRepository.create({ 
                name: data.name 
            })
            return newCategory
        },
    }
}