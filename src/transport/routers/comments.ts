import { Router } from "express";
import type { RequestHandler } from "express";
import type { CommentHandlers } from "../handlers/comments"
import { COMMENT_ROUTERS } from "../../constants";

export function createCommentRouter( handlers: CommentHandlers, requireAuth: RequestHandler ){
    const router = Router()

    router.delete(COMMENT_ROUTERS.BY_ID, requireAuth, handlers.deleteComment)

    return router
}
