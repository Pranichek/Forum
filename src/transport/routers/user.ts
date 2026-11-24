import { type RequestHandler, Router } from "express";
import { AUTH_ROUTES } from "../../constants";
import type { UserHandlers } from "../handlers/user";

export function createUserRouter(
	handlers: UserHandlers,
	requireAuth: RequestHandler,
) {
	const router = Router();

	router.post(AUTH_ROUTES.REGISTER, handlers.register);
	router.post(AUTH_ROUTES.LOGIN, handlers.login);
	router.post(AUTH_ROUTES.REFRESH, handlers.refresh);
	router.post(AUTH_ROUTES.LOGOUT, handlers.logout);
	router.get(AUTH_ROUTES.ME, requireAuth, handlers.me);

	return router;
}
