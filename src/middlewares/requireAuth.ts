import type { RequestHandler } from "express"


export function createRequireAuth(verifyAccessToken: (token: string) => number): RequestHandler {
    return (req, res, next) => {
        const accessToken = req.cookies.accessToken

        if (typeof accessToken !== "string") {
            res.status(401).json({ message: "Unauthorized" })
            return
        }

        try {
            const userId = verifyAccessToken(accessToken)
            res.locals.userId = userId

            next()
        } catch (error) {
            res.status(401).json({ message: "Unauthorized" })
        }
    }
}