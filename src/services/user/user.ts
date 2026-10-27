import type { UserRepository } from "../../domain/user/repository"
import type { AuthService, PasswordHasher, TokenService } from "./user.types"


export function createAuthService(
    repository: UserRepository,
    passwordHasher: PasswordHasher,
    tokenService: TokenService
): AuthService {
    return {
        async register(input) {
            const email = input.email.trim().toLowerCase()
            const passwordHash = await passwordHasher.hash(input.password)
            const user = await repository.createUser({ email, hashPassword: passwordHash })

            return { id: user.id, email: user.email }
        },

        async login(input) {
            const email = input.email.trim().toLowerCase()
            const user = await repository.getUserByEmail(email)

            if (!user || !await passwordHasher.verify(user.hashPassword, input.password)) {
                throw new Error("INVALID_CREDENTIALS")
            }

            return {
                user: { id: user.id, email: user.email },
                tokens: {
                    access: tokenService.signAccessToken(user.id)
                },
            }
        },
    }
}