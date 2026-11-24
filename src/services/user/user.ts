import type { AuthService, AuthServiceDeps } from "./user.types";

export function createAuthService(deps: AuthServiceDeps): AuthService {
	const {
		userRepository: repository,
		passwordHasher,
		tokenService,
		refreshSessionRepository,
		refreshTokenTime,
	} = deps;

	return {
		async register(input) {
			const email = input.email.trim().toLowerCase();
			const passwordHash = await passwordHasher.hash(input.password);
			const user = await repository.createUser({
				email,
				hashPassword: passwordHash,
			});

			return { id: user.id, email: user.email };
		},

		async login(input) {
			const email = input.email.trim().toLowerCase();
			const user = await repository.getUserByEmail(email);

			if (
				!user ||
				!(await passwordHasher.verify(user.hashPassword, input.password))
			) {
				throw new Error("INVALID_CREDENTIALS");
			}

			const accessToken = tokenService.signAccessToken(user.id);
			const refreshToken = tokenService.signRefreshToken(user.id);

			const timeLimit = Temporal.Now.instant().add({
				seconds: refreshTokenTime,
			});

			await refreshSessionRepository.create({
				tokenHash: tokenService.hashRefreshToken(refreshToken),
				userId: user.id,
				time_limit: timeLimit,
			});

			return {
				user: { id: user.id, email: user.email },
				accessToken: accessToken,
				refreshToken: refreshToken,
			};
		},

		async refresh(refreshToken) {
			const userId = tokenService.verifyRefreshToken(refreshToken);

			const oldTokenHash = tokenService.hashRefreshToken(refreshToken);
			const session = await refreshSessionRepository.getByHash(oldTokenHash);

			if (!session || session.userId !== userId) {
				throw new Error("INVALID REFRESH TOKEN");
			}

			const newAccessToken = tokenService.signAccessToken(userId);
			const newRefreshToken = tokenService.signRefreshToken(userId);
			const newTokenHash = tokenService.hashRefreshToken(newRefreshToken);

			const timeLimit = Temporal.Now.instant().add({
				seconds: refreshTokenTime,
			});
			const updatedSession = await refreshSessionRepository.rotation({
				oldTokenHash,
				newTokenHash,
				timeLimit,
			});

			if (!updatedSession) {
				throw new Error("INVALID REFRESH TOKEN");
			}

			return {
				accessToken: newAccessToken,
				refreshToken: newRefreshToken,
			};
		},
		async logout(refreshToken) {
			await refreshSessionRepository.delete(
				tokenService.hashRefreshToken(refreshToken),
			);
		},
		async me(id) {
			const user = await repository.getUserById(id);

			if (!user) {
				throw new Error("User not found");
			}

			const { hashPassword, ...publicUser } = user;
			return publicUser;
		},
	};
}
