import type { RequestHandler } from "express";
import type { TokenService } from "../services/user/user.types";
import { getAccessToken } from "../transport/cookie/authCookie";

export function createRequireAuth(tokenService: TokenService): RequestHandler {
	return (req, res, next) => {
		const accessToken = getAccessToken(req);

		if (!accessToken) {
			res.status(401).json({ message: "Unauthorized" });
			return;
		}

		try {
			const userId = tokenService.verifyAccessToken(accessToken);
			res.locals.userId = userId;

			next();
		} catch {
			res.status(401).json({ message: "Unauthorized" });
		}
	};
}
