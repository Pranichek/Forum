import { Router } from "express"
import type { PostHandlers } from "../handlers/post"

export function createPostRouter(handlers: PostHandlers) {
    const router = Router()

    router.get("/", handlers.getPosts)
    router.get("/:id", handlers.getPost)
    router.post("/", handlers.createPost)

    return router
}