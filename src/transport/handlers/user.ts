import type { Request, Response } from "express"
import type { UserService } from "../../services/user/user.types"
import type { RegisterBody } from "../dto/user/requests"
import type { UserResponse } from "../dto/user/responses"
import type { ErrorDto } from "../dto/post/errors"


export interface UserHandlers {
    register(req: Request<{}, UserResponse | ErrorDto, RegisterBody>, res: Response<UserResponse | ErrorDto>): Promise<void>
}

export function createUserHandlers(userService: UserService): UserHandlers {
    return {
        async register(req, res) {
            if (!req.body) {
                res.status(400).json({ message: "Тіло запиту має бути JSON" })
                return
            }

            const { email, password } = req.body

            if (typeof email !== "string" || !email.includes("@")) {
                res.status(422).json({ message: "Неправильний email" })
                return
            }

            if (typeof password !== "string" || password.length < 6) {
                res.status(422).json({ message: "password має бути рядком мінімум з 6 символів" })
                return
            }

            const normalizedEmail = email.trim().toLowerCase()

            try {
                const newUser = await userService.register({
                    email: normalizedEmail,
                    password: password,
                })

                res.status(201).json(newUser)
            } catch (error) {
                if (error instanceof Error) {
                    if (error.message === "BUSY_EMAIL") {
                        res.status(409).json({ message: "Користувач з таким email вже існує" })
                        return
                    }
                }

                console.log(error)
                res.status(500).json({ message: "Internal server error" })
            }
        },
    }
}