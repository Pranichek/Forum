import type { UserRepository } from "../../domain/user/repository"
import type { PasswordHasher, UserService } from "./user.types"


export function createUserService(repository: UserRepository, passwordHasher: PasswordHasher): UserService {
    return {
        async register(input) {
            const hashPassword = await passwordHasher.hashPassword(input.password)

            const newUser = await repository.createUser({
                email: input.email,
                hashPassword: hashPassword,
            })

            return {
                id: newUser.id,
                email: newUser.email,
            }
        },
    }
}