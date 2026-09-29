import express from "express"
import { createPostRepository } from "./repositories/post"
import { createPostService } from "./services/post/post"
import { createPostHandlers } from "./transport/handlers/post"
import { createPostRouter } from "./transport/routers/post"

const app = express()
app.use(express.json())

const postRepository = createPostRepository()
const postService = createPostService(postRepository)
const postHandlers = createPostHandlers(postService)
const postRouter = createPostRouter(postHandlers)

app.use("/posts", postRouter)

const HOST = "localhost"
const PORT = 3000

app.listen(PORT, HOST, () => {
    console.log(`Server: http://${HOST}:${PORT}`)
})