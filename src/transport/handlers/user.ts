import type { RequestHandler } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { AuthService } from "../../services/user/user.types";
import {
	clearAuthCookies,
	getRefreshToken,
	setAuthCookies,
} from "../cookie/authCookie";
import type { ErrorDto } from "../dto/common/errors";
import type { MessageDto } from "../dto/common/responses";
import type { RegisterBody } from "../dto/user/requests";
import type { UserResponse } from "../dto/user/responses";

export interface UserHandlers {
	register: RequestHandler<
		ParamsDictionary,
		UserResponse | ErrorDto,
		RegisterBody
	>;
	login: RequestHandler<
		ParamsDictionary,
		UserResponse | ErrorDto,
		RegisterBody
	>;
	refresh: RequestHandler<ParamsDictionary, MessageDto>;
	logout: RequestHandler<ParamsDictionary, MessageDto>;
	me: RequestHandler<ParamsDictionary, UserResponse | ErrorDto>;
}

export function createUserHandlers(authService: AuthService): UserHandlers {
	return {
		async register(req, res) {
			if (!req.body) {
				res.status(400).json({ message: "Тіло запиту має бути JSON" });
				return;
			}

			const { email, password } = req.body;

			if (typeof email !== "string" || !email.includes("@")) {
				res.status(422).json({ message: "Неправильний email" });
				return;
			}

			if (typeof password !== "string" || password.length < 6) {
				res
					.status(422)
					.json({ message: "password має бути рядком мінімум з 6 символів" });
				return;
			}

			try {
				const newUser = await authService.register({
					email: email,
					password: password,
				});

				res.status(201).json(newUser);
			} catch (error) {
				if (error instanceof Error) {
					if (error.message === "BUSY_EMAIL") {
						res
							.status(409)
							.json({ message: "Користувач з таким email вже існує" });
						return;
					}
				}

				console.log(error);
				res.status(500).json({ message: "Internal server error" });
			}
		},

		async login(req, res) {
			if (!req.body) {
				res.status(400).json({ message: "Тіло запиту має бути JSON" });
				return;
			}

			const { email, password } = req.body;

			if (typeof email !== "string" || typeof password !== "string") {
				res.status(422).json({ message: "email та password обов'язкові" });
				return;
			}

			try {
				const { user, accessToken, refreshToken } = await authService.login({
					email: email,
					password: password,
				});

				setAuthCookies(res, {
					accessToken: accessToken,
					refreshToken: refreshToken,
				});

				res.status(200).json(user);
			} catch (error) {
				if (error instanceof Error) {
					if (error.message === "INVALID_CREDENTIALS") {
						res.status(401).json({ message: "невірний email або пароль" });
						return;
					}
				}

				console.log(error);
				res.status(500).json({ message: "Internal server error" });
			}
		},

		async refresh(req, res) {
			const refreshToken = getRefreshToken(req);

			if (!refreshToken) {
				res.status(401).json({ message: "Unauthorized" });
				return;
			}

			try {
				const tokens = await authService.refresh(refreshToken);

				setAuthCookies(res, tokens);

				res.status(200).json({ message: "success" });
			} catch (error) {
				if (error instanceof Error) {
					if (error.message === "INVALID REFRESH TOKEN") {
						res.status(401).json({ message: "Unauthorized" });
						return;
					}
				}

				console.log(error);
				res.status(500).json({ message: "Internal server error" });
			}
		},

		async logout(req, res) {
			const refreshToken = getRefreshToken(req);

			try {
				if (refreshToken) {
					await authService.logout(refreshToken);
				}

				clearAuthCookies(res);

				res.status(200).json({ message: "ok" });
			} catch (error) {
				console.log(error);
				res.status(500).json({ message: "Internal server error" });
			}
		},

		async me(_req, res) {
			const userId = res.locals.userId;

			if (userId === undefined) {
				res.status(401).json({ message: "Unauthorized" });
				return;
			}

			try {
				const user = await authService.me(userId);
				res.status(200).json(user);
			} catch (error) {
				if (error instanceof Error) {
					if (error.message === "User not found") {
						res.status(404).json({ message: "Користувача не знайдено" });
						return;
					}
				}

				console.log(error);
				res.status(500).json({ message: "Internal server error" });
			}
		},
	};
}
