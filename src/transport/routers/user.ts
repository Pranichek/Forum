import { Router, type RequestHandler } from "express"
import type { UserHandlers } from "../handlers/user"


export function createUserRouter(handlers: UserHandlers, requireAuth: RequestHandler) {
    const router = Router()

    router.post("/register", handlers.register)
    router.post("/login", handlers.login)
    router.post("/refresh", handlers.refresh)
    router.get("/me", requireAuth, handlers.me)

    return router
}