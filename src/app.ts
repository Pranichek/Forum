import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { CONFIG } from "./config";
import { ROUTES } from "./constants";
import { createContainer } from "./container";

export function createApp() {
	const app = express();

	app.use(cors({ origin: CONFIG.corsOrigin, credentials: true }));
	app.use(express.json());
	app.use(cookieParser());

	const container = createContainer();

	app.use(ROUTES.COMMENTS, container.commentRouter);
	app.use(ROUTES.POSTS, container.postRouter);
	app.use(ROUTES.CATEGORIES, container.categoryRouter);
	app.use(ROUTES.AUTH, container.userRouter);

	return app;
}
