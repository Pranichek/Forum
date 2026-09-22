import { Router } from "express"
import postHandler from "../handlers/post.js"

const router = Router()

router.get("/", postHandler.getPosts)    
router.get("/:id", postHandler.getPost)  
router.post("/", postHandler.createPost) 


export default router