import postService from "../../services/post"
import type { Request, Response } from 'express'
import type { GetPosts, PostParams, CreatePost } from "../dto/post/requests"
import type { PostResponse } from "../dto/post/responses"
import type { ErrorDto } from "../dto/post/errors"

function getPosts(req: Request<{}, PostResponse[] | ErrorDto, {}, GetPosts>, res: Response<PostResponse[] | ErrorDto>) {
    const { category, take } = req.query

    let takeNumber: number | undefined
    if (take) {
        takeNumber = Number(take)
        if (!Number.isInteger(take) || takeNumber <= 0) {
            return res.status(422).json({ message: "take повинене бути додатнім числом" })
        }
    }

    const posts = postService.getPosts(category, takeNumber)

    res.status(200).json(posts)
}

function getPost(req: Request<PostParams>, res: Response<PostResponse | ErrorDto>) {
    const id : number = Number(req.params.id)

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(422).json({ message: "id повино бути додатнім числом" })
    }

    const post = postService.getPost(id)
    if (!post) {
        return res.status(404).json(
            { message: "пост не знайдено" }
        )
    }

    res.status(200).json(post)
}

async function createPost(req: Request<{}, PostResponse | ErrorDto, CreatePost>, res: Response<PostResponse | ErrorDto>) {
    const { title, content, author, category } = req.body


    if (!title || !content) {
        return res.status(422).json({ message: "title та content обов'язкові" })
    }


    try {
        const newPost : PostResponse = await postService.createPost({ title, content, author, category })
        res.status(201).json(newPost)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}

export default { getPosts, getPost, createPost }