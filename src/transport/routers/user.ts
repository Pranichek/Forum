import { Router } from "express"
import type { UserHandlers } from "../handlers/user"


export function createUserRouter(handlers: UserHandlers) {
    const router = Router()

    router.post("/register", handlers.register)
    router.post("/login", handlers.login)
    router.post("/refresh", handlers.refresh)

    return router
}