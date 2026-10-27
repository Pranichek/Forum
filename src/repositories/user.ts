import type { PostgresClient } from "@prisma/orm-postgres/runtime"
import type { Contract } from "../prisma/contract.d"
import type { User } from "../domain/user/entity"
import type { UserRepository } from "../domain/user/repository"


export function createUserRepository(db: PostgresClient<Contract>): UserRepository {
    return {
        async createUser(user) {
            try {
                const newUser: User = await db.orm.public.User.create({
                    email: user.email,
                    hashPassword: user.hashPassword,
                })

                return newUser
            } catch (error) {
                if (error instanceof Error && "sqlState" in error) {
                    if (error.sqlState === "23505") {
                        throw new Error("BUSY_EMAIL")
                    }
                }

                throw error
            }
        },
        async getUserByEmail(email) {
            const user: User | null = await db.orm.public.User.where({ email: email }).first()
            return user
        }
    }
}