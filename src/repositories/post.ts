import type { Post } from "../domain/post/entity"
import type { PostRepository } from "../domain/post/repository"

export function createPostRepository(): PostRepository{
    const posts: Post[] = [
        { 
            id: 1, title: "Перший пост", 
            content: "Привіт", 
            author: "Вова", 
            category: "general" 
        },
        { 
            id: 2, 
            title: "Вивчаю Node.js", 
            content: "Нова архітектура", 
            author: "ВОва2", 
            category: "programming" 
        },
        { 
            id: 3, 
            title: "Python the best", 
            content: "Треба вивчате нове", 
            author: "Миша", 
            category: "programming" 
        },
    ]


    return {
        getAll(category, take) {
            let result = [...posts]

            if (category) {
                result = result.filter((post) => post.category == category)
            }

            if (take) {
                result = result.slice(0, take)
            }

            return result
        },


        getById(id) {
            return posts.find((post) => post.id === id)
        },

        addPost(data) {
            return new Promise((resolve) => {
                const lastPost = posts[posts.length - 1]

                let newId
                if (lastPost) {
                    newId = lastPost.id + 1
                } else {
                    newId = 1
                }

                const newPost = {
                    id: newId,
                    title: data.title,
                    content: data.content,
                    author: data.author,
                    category: data.category,
                }

                posts.push(newPost)
                resolve(newPost)
            })
        }
    }
}





