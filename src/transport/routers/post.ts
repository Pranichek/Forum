import { Router, type RequestHandler } from "express"
import type { PostHandlers } from "../handlers/post"

export function createPostRouter(handlers: PostHandlers, requireAuth: RequestHandler) {
    const router = Router()

    router.get("/", handlers.getPosts)
    router.get("/my", requireAuth, handlers.getMyPosts)
    router.get("/:id", handlers.getPost)
    router.post("/", handlers.createPost)


    return router
}