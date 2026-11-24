import type { Request, Response } from "express";
import { CONFIG } from "../../config";
import { COOKIE_PATHS, COOKIES } from "../../constants";
import type { AuthTokens } from "../../services/user/user.types";

export function setAuthCookies(res: Response, tokens: AuthTokens): void {
	res.cookie(COOKIES.ACCESS_TOKEN, tokens.accessToken, {
		httpOnly: true,
		secure: CONFIG.isProduction,
		sameSite: "lax",
		maxAge: CONFIG.tokenAccessTime * 1000,
		path: COOKIE_PATHS.ACCESS_TOKEN,
	});

	res.cookie(COOKIES.REFRESH_TOKEN, tokens.refreshToken, {
		httpOnly: true,
		secure: CONFIG.isProduction,
		sameSite: "lax",
		maxAge: CONFIG.tokenRefreshTime * 1000,
		path: COOKIE_PATHS.REFRESH_TOKEN,
	});
}

export function clearAuthCookies(res: Response): void {
	res.clearCookie(COOKIES.ACCESS_TOKEN, { path: COOKIE_PATHS.ACCESS_TOKEN });
	res.clearCookie(COOKIES.REFRESH_TOKEN, { path: COOKIE_PATHS.REFRESH_TOKEN });
}

export function getAccessToken(req: Request): string | undefined {
	const token = req.cookies[COOKIES.ACCESS_TOKEN];

	if (typeof token !== "string") {
		return undefined;
	}

	return token;
}

export function getRefreshToken(req: Request): string | undefined {
	const token = req.cookies[COOKIES.REFRESH_TOKEN];

	if (typeof token !== "string") {
		return undefined;
	}

	return token;
}
