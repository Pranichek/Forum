import type { PostgresClient } from "@prisma/orm-postgres/runtime"
import type { Contract } from "../prisma/contract.d"
import type { Category } from "../domain/category/entity"
import type { CategoryRepository } from "../domain/category/repository"


export function createCategoryRepository(db: PostgresClient<Contract>): CategoryRepository {
    return {
        async findAll() {
            const categories: Category[] = await db.orm.public.Category.all()
            return categories
        },

        async findById(id) {
            const category: Category |null = await db.orm.public.Category.where({ id: id }).first()
            return category
        },

        async findByName(name) {
            const category: Category | null = await db.orm.public.Category.where({ name: name }).first()
            return category
        },

        async create(data) {
            const newCategory: Category = await db.orm.public.Category.create({ name: data.name })
            return newCategory
        },
    }
}