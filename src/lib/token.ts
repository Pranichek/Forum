import jwt from "jsonwebtoken";
import { createHash, randomUUID } from "node:crypto";
import type { TokenService } from "../services/user/user.types";

export interface TokenOptions {
	accessSecret: string;
	refreshSecret: string;
	accessTime: number;
	refreshTime: number;
}

export function createTokenService(options: TokenOptions): TokenService {
	return {
		signAccessToken(userId) {
			const token = jwt.sign({}, options.accessSecret, {
				algorithm: "HS256",
				subject: String(userId),
				expiresIn: options.accessTime,
			});

			return token;
		},

		signRefreshToken(userId) {
			const token = jwt.sign({ type: "refresh" }, options.refreshSecret, {
				algorithm: "HS256",
				subject: String(userId),
				expiresIn: options.refreshTime,
				jwtid: randomUUID(),
			});
			return token;
		},

		verifyRefreshToken(token) {
			try {
				const payload = jwt.verify(token, options.refreshSecret, {
					algorithms: ["HS256"],
				});

				if (
					typeof payload === "string" ||
					payload.type !== "refresh" ||
					typeof payload.sub !== "string"
				) {
					throw new Error();
				}

				const userId = Number(payload.sub);
				if (!Number.isSafeInteger(userId) || userId <= 0) {
					throw new Error();
				}

				return userId;
			} catch {
				throw new Error("INVALID REFRESH TOKEN");
			}
		},

		verifyAccessToken(token) {
			try {
				const payload = jwt.verify(token, options.accessSecret, {
					algorithms: ["HS256"],
				});

				if (typeof payload === "string" || typeof payload.sub !== "string") {
					throw new Error();
				}

				const userId = Number(payload.sub);
				if (!Number.isSafeInteger(userId) || userId <= 0) {
					throw new Error();
				}

				return userId;
			} catch {
				throw new Error("INVALID ACCESS TOKEN");
			}
		},

		hashRefreshToken(token) {
			const hash = createHash("sha256").update(token).digest("hex");
			return hash;
		},
	};
}
