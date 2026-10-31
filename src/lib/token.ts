import "dotenv/config"
import jwt from "jsonwebtoken"


export function signAccessToken(userId: number): string {
    const secretKey = process.env.JWT_ACCESS_KEY

    if (!secretKey) {
        throw new Error("secret key not found")
    }

    const token = jwt.sign({}, secretKey, {
        algorithm: "HS256",
        subject: String(userId),
        expiresIn: 15 * 60,
    })

    return token
}

export function signRefreshToken(userId: number): string {
    const refreshSecret = process.env.JWT_REFRESH_KEY
    if (!refreshSecret) { 
        throw new Error("refresh secret key not found") 
    }

    const token = jwt.sign({ type: "refresh" }, refreshSecret, {
        algorithm: "HS256",                                 
        subject: String(userId),                             
        expiresIn: Number(process.env.TOKEN_REFRESH_TIME)     
    })
    return token
}


export function verifyRefreshToken(token: string): number {
    const refreshSecret = process.env.JWT_REFRESH_KEY
    if (!refreshSecret) { throw new Error("refresh secret key not found") }

    try {
        const payload = jwt.verify(token, refreshSecret, { algorithms: ["HS256"] })

        if (typeof payload === "string" || payload.type !== "refresh" || typeof payload.sub !== "string") {
            throw new Error()
        }

        const userId = Number(payload.sub)
        if (!Number.isSafeInteger(userId) || userId <= 0) {
            throw new Error()
        }

        return userId
    } catch (error) {
        throw new Error("INVALID REFRESH TOKEN")
    }
}