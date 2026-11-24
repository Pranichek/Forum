import { type RequestHandler, Router } from "express";
import { POST_ROUTES } from "../../constants";
import type { PostHandlers } from "../handlers/post";

export function createPostRouter(
	handlers: PostHandlers,
	requireAuth: RequestHandler,
) {
	const router = Router();

	router.get(POST_ROUTES.ALL, handlers.getPosts);
	router.get(POST_ROUTES.MY, requireAuth, handlers.getMyPosts);
	router.get(POST_ROUTES.BY_ID, handlers.getPost);
	router.post(POST_ROUTES.ALL, handlers.createPost);

	return router;
}
