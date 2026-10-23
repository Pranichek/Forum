import type { PublicUser } from "../../domain/user/entity"

export interface UserInput {
    email: string
    password: string    
}

export interface PasswordHasher {
    hashPassword(password: string): Promise<string>
    checkPassword(hash: string, password: string): Promise<boolean>
}

export interface UserService {
    register(input: UserInput): Promise<PublicUser>
}