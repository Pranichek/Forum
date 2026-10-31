import type { User } from "./entity"


export type NewUser = Omit<User, "id">

export interface UserRepository {
    createUser(user: NewUser): Promise<User>
    getUserByEmail(email: string): Promise<User | null>
    getUserById(id: number): Promise<User | null>
}