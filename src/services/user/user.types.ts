import type { PublicUser } from "../../domain/user/entity"

export interface AuthInput {
    email: string
    password: string
}

export interface PasswordHasher {
    hash(password: string): Promise<string>
    verify(hash: string, password: string): Promise<boolean>
}

export interface TokenService {
    signAccessToken(userId: number): string
    signRefreshToken(userId: number): string
    verifyRefreshToken(token: string): number
}

export interface AuthService {
    register(input: AuthInput): Promise<PublicUser>
    login(input: AuthInput): Promise<{
        user: PublicUser
        accessToken: string
        refreshToken: string
    }>
    refresh(refreshToken: string): Promise<{
        accessToken: string
        refreshToken: string
    }>
}