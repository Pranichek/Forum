import type { Request, Response } from "express"
import type { AuthService } from "../../services/user/user.types"
import type { RegisterBody } from "../dto/user/requests"
import type { UserResponse } from "../dto/user/responses"
import type { ErrorDto } from "../dto/post/errors"


export interface UserHandlers {
    register(req: Request<{}, {}, RegisterBody>, res: Response<UserResponse | ErrorDto>): Promise<void>
    login(req: Request<{}, {}, RegisterBody>, res: Response<UserResponse | ErrorDto>): Promise<void>
}

export function createUserHandlers(authService: AuthService): UserHandlers {
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

            try {
                const newUser = await authService.register({
                    email: email,
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

        async login(req, res) {
            if (!req.body) {
                res.status(400).json({ message: "Тіло запиту має бути JSON" })
                return
            }

            const { email, password } = req.body

            if (typeof email !== "string" || typeof password !== "string") {
                res.status(422).json({ message: "email та password обов'язкові" })
                return
            }

            try {
                const { tokens, user } = await authService.login({
                    email: email,
                    password: password,
                })

                res.cookie("accessToken", tokens.access, {
                    httpOnly: true,
                    sameSite: "lax",
                    path: "/",
                    maxAge: 15 * 60 * 1000,
                })

                res.status(200).json(user)
            } catch (error) {
                if (error instanceof Error) {
                    if (error.message === "INVALID_CREDENTIALS") {
                        res.status(401).json({ message: "невірний email або пароль" })
                        return
                    }
                }

                console.log(error)
                res.status(500).json({ message: "Internal server error" })
            }
        },
    }
}