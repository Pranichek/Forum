import type { Post } from "../domain/post/entity"
import type { PostRepository } from "../domain/post/repository"
import { db } from "../prisma/db"

export function createPostRepository(): PostRepository{
    return {
        async getAll(category, take) {
            let query = db.orm.public.Post
            if (category) {
                query = query.where({ category })
            }

            if (take) {
                query = query.limit(take)
            }

            return await query.all()
        },


        async getById(id) {
            return await db.orm.public.Post.where({ id }).first()
        },

        async addPost(data) {
            return await db.orm.public.Post.create({
                title: data.title,                 
                content: data.content,            
                author: data.author ?? null,       
                category: data.category ?? null,  
            })
        }
    }
}





