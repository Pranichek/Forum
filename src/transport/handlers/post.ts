import type { Request, Response } from 'express'
import type { GetPosts, PostParams, CreatePost } from "../dto/post/requests"
import type { PostResponse } from "../dto/post/responses"
import type { ErrorDto } from "../dto/post/errors"
import type { PostService } from '../../services/post/post.types'

export interface PostHandlers {
    getPosts(req: Request<{}, PostResponse[] | ErrorDto, {}, GetPosts>, res: Response<PostResponse[] | ErrorDto>): Promise<void>
    getPost(req: Request<PostParams>, res: Response<PostResponse | ErrorDto>): Promise<void>
    createPost(req: Request<{}, PostResponse | ErrorDto, CreatePost>,res: Response<PostResponse | ErrorDto>): Promise<void>
}

export function createPostHandlers(postService: PostService): PostHandlers {
    return {
        async getPosts(req, res) {
            const { category, take } = req.query

            let takeNumber: number | undefined
            if (take) {
                takeNumber = Number(take)
                if (!Number.isInteger(takeNumber) || takeNumber <= 0) {
                    res.status(422).json({ message: "take повинене бути додатнім числом" })
                    return
                }
            }

            const posts = await postService.getPosts(category, takeNumber)

            res.status(200).json(posts)
        },

        async getPost(req, res) {
            const id : number = Number(req.params.id)

            if (!Number.isInteger(id) || id <= 0) {
                res.status(422).json({ message: "id повино бути додатнім числом" })
                return
            }

            const post = await postService.getPost(id)
            if (!post) {
                res.status(404).json({ message: "пост не знайдено" })
                return
            }

            res.status(200).json(post)
        },

        async createPost(req, res) {
            const { title, content, author, category } = req.body


            if (!title || !content) {
                res.status(422).json({ message: "title та content обов'язкові" })
                return
            }


            try {
                const newPost : PostResponse = await postService.createPost({ title, content, author, category })
                res.status(201).json(newPost)
            } catch (error) {
                console.log(error)
                res.status(500).json({ message: "Internal server error" })
            }
        }
    }
}





