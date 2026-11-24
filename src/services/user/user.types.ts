import type { RefreshSessionRepository } from "../../domain/refreshSession/repository";
import type { PublicUser } from "../../domain/user/entity";
import type { UserRepository } from "../../domain/user/repository";

export interface AuthInput {
	email: string;
	password: string;
}

export interface AuthTokens {
	accessToken: string;
	refreshToken: string;
}

export interface LoginResult extends AuthTokens {
	user: PublicUser;
}

export interface PasswordHasher {
	hash(password: string): Promise<string>;
	verify(hash: string, password: string): Promise<boolean>;
}

export interface TokenService {
	signAccessToken(userId: number): string;
	signRefreshToken(userId: number): string;
	verifyAccessToken(token: string): number;
	verifyRefreshToken(token: string): number;
	hashRefreshToken(token: string): string;
}

export interface AuthServiceDeps {
	userRepository: UserRepository;
	refreshSessionRepository: RefreshSessionRepository;
	passwordHasher: PasswordHasher;
	tokenService: TokenService;
	refreshTokenTime: number;
}

export interface AuthService {
	register(input: AuthInput): Promise<PublicUser>;
	login(input: AuthInput): Promise<{
		user: PublicUser;
		accessToken: string;
		refreshToken: string;
	}>;
	me(userId: number): Promise<PublicUser>;
	refresh(refreshToken: string): Promise<{
		accessToken: string;
		refreshToken: string;
	}>;
	logout(refreshToken: string): Promise<void>;
}
