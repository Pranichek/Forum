import { CONFIG } from "./config";
import { createPasswordHasher } from "./lib/password";
import { createTokenService } from "./lib/token";
import { createRequireAuth } from "./middlewares/requireAuth";
import { createDb } from "./prisma/db";
import { createCategoryRepository } from "./repositories/category";
import { createPostRepository } from "./repositories/post";
import { createRefreshSessionRepository } from "./repositories/refreshSession";
import { createUserRepository } from "./repositories/user";
import { createCategoryService } from "./services/category/category";
import { createPostService } from "./services/post/post";
import { createAuthService } from "./services/user/user";
import { createCategoryHandlers } from "./transport/handlers/category";
import { createPostHandlers } from "./transport/handlers/post";
import { createUserHandlers } from "./transport/handlers/user";
import { createCategoryRouter } from "./transport/routers/category";
import { createPostRouter } from "./transport/routers/post";
import { createUserRouter } from "./transport/routers/user";

export function createContainer() {
	const db = createDb(CONFIG.databaseUrl);
	const passwordHasher = createPasswordHasher(CONFIG.passwordPepper);
	const tokenService = createTokenService({
		accessSecret: CONFIG.jwtAccessSecret,
		refreshSecret: CONFIG.jwtRefreshSecret,
		accessTime: CONFIG.tokenAccessTime,
		refreshTime: CONFIG.tokenRefreshTime,
	});
	const requireAuth = createRequireAuth(tokenService);

	const postRepository = createPostRepository(db);
	const categoryRepository = createCategoryRepository(db);
	const userRepository = createUserRepository(db);
	const refreshSessionRepository = createRefreshSessionRepository(db);

	const postService = createPostService(postRepository, categoryRepository);
	const postHandlers = createPostHandlers(postService);
	const postRouter = createPostRouter(postHandlers, requireAuth);

	const categoryService = createCategoryService(categoryRepository);
	const categoryHandlers = createCategoryHandlers(categoryService);
	const categoryRouter = createCategoryRouter(categoryHandlers);

	const authService = createAuthService({
		userRepository: userRepository,
		refreshSessionRepository: refreshSessionRepository,
		passwordHasher: passwordHasher,
		tokenService: tokenService,
		refreshTokenTime: CONFIG.tokenRefreshTime,
	});
	const userHandlers = createUserHandlers(authService);
	const userRouter = createUserRouter(userHandlers, requireAuth);

	return {
		postRouter: postRouter,
		categoryRouter: categoryRouter,
		userRouter: userRouter,
	};
}
