import { type RequestHandler, Router } from "express";
import { POST_ROUTES } from "../../constants";
import type { PostHandlers } from "../handlers/post";
import type { CommentHandlers } from "../handlers/comments";


export function createPostRouter(
	handlers: PostHandlers,
	commentHandlers: CommentHandlers,
	requireAuth: RequestHandler,
) {
	const router = Router();

	router.get(POST_ROUTES.ALL, handlers.getPosts);
	router.get(POST_ROUTES.MY, requireAuth, handlers.getMyPosts);
	router.get(POST_ROUTES.BY_ID, handlers.getPost);
	router.post(POST_ROUTES.ALL, handlers.createPost);

	// роутер постов
	router.get(POST_ROUTES.COMMENTS, commentHandlers.getComments)
	router.post(POST_ROUTES.COMMENTS, requireAuth, commentHandlers.createComment)

	return router;
}
