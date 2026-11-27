export const ROUTES = {
	POSTS: "/posts",
	CATEGORIES: "/categories",
	AUTH: "/auth",
	COMMENTS: "/comments"
};

export const AUTH_ROUTES = {
	REGISTER: "/register",
	LOGIN: "/login",
	REFRESH: "/refresh",
	LOGOUT: "/logout",
	ME: "/me",
};

export const POST_ROUTES = {
	ALL: "/",
	MY: "/my",
	BY_ID: "/:id",
	COMMENTS: "/:postId/comments"
};

export const COMMENT_ROUTERS = {
	BY_ID: "/:commentId"
}

export const CATEGORY_ROUTES = {
	ALL: "/",
	BY_ID: "/:id",
};

export const COOKIES = {
	ACCESS_TOKEN: "accessToken",
	REFRESH_TOKEN: "refreshToken",
};

export const COOKIE_PATHS = {
	ACCESS_TOKEN: "/",
	REFRESH_TOKEN: ROUTES.AUTH,
};
