import express from "express"
import { createPostRepository } from "./repositories/post"
import { createPostService } from "./services/post/post"
import { createPostHandlers } from "./transport/handlers/post"
import { createPostRouter } from "./transport/routers/post"
import { createCategoryRepository } from "./repositories/category"
import { createCategoryService } from "./services/category/category"
import { createCategoryHandlers } from "./transport/handlers/category"
import { createCategoryRouter } from "./transport/routers/category"
import { db } from "./prisma/db"


const app = express()
app.use(express.json())

const postRepository = createPostRepository(db)
const categoryRepository = createCategoryRepository(db)

const postService = createPostService(postRepository, categoryRepository)
const postHandlers = createPostHandlers(postService)
const postRouter = createPostRouter(postHandlers)

const categoryService = createCategoryService(categoryRepository)
const categoryHandlers = createCategoryHandlers(categoryService)
const categoryRouter = createCategoryRouter(categoryHandlers)

app.use("/posts", postRouter)
app.use("/categories", categoryRouter)

const HOST = "localhost"
const PORT = 3000

app.listen(PORT, HOST, () => {
    console.log(`Server: http://${HOST}:${PORT}`)
})