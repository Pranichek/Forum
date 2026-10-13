import type { PostgresClient } from "@prisma/orm-postgres/runtime"
import type { Contract } from "../prisma/contract.d"
import type { PostRepository } from "../domain/post/repository"


export function createPostRepository(db: PostgresClient<Contract>): PostRepository {
    return {
        async getAll(category, take) {
            let query = db.orm.public.Post.include("category")


            if (category) {
                query = query.where((post) => post.category.some({ name: category }))
            }

            if (take) {
                query = query.limit(take)
            }

            return await query.all()
        },

        async getById(id) {
            return await db.orm.public.Post.include("category").where({ id: id }).first()
        },

        async addPost(data) {
            const categoryId = data.categoryId

            return await db.orm.public.Post.create({
                title: data.title,
                content: data.content,
                author: data.author ?? null,  
                category: (category) => category.connect({ id: categoryId }),
            })
        },
    }
}