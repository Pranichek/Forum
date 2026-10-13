import { Router } from "express"
import type { CategoryHandlers } from "../handlers/category"

export function createCategoryRouter(handlers: CategoryHandlers) {
    const router = Router()


    router.get("/", handlers.getCategories)
    router.get("/:id", handlers.getCategory)
    router.post("/", handlers.createCategory)

    return router
}