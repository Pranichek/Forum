import { Router } from "express"
import type { createPostHandlers } from "../handlers/post"

export function createPostRouter(handlers: ReturnType<typeof createPostHandlers>) {
    const router = Router()

    router.get("/", handlers.getPosts)
    router.get("/:id", handlers.getPost)
    router.post("/", handlers.createPost)

    return router
}