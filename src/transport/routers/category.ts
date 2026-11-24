import { Router } from "express";
import { CATEGORY_ROUTES } from "../../constants";
import type { CategoryHandlers } from "../handlers/category";

export function createCategoryRouter(handlers: CategoryHandlers) {
	const router = Router();

	router.get(CATEGORY_ROUTES.ALL, handlers.getCategories);
	router.get(CATEGORY_ROUTES.BY_ID, handlers.getCategory);
	router.post(CATEGORY_ROUTES.ALL, handlers.createCategory);

	return router;
}
