import "dotenv/config"
import argon2 from "argon2"

const pepper = process.env.PEPPER
if (!pepper) throw new Error("PEPPER_NOT_FOUND")
const pepperBuffer = Buffer.from(pepper)

export async function hashPassword(password: string): Promise<string> {
    const hash = await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 19456,
        timeCost: 2,
        parallelism: 1,
        secret: pepperBuffer
    })

    return hash
}

export async function checkPassword(hash: string, password: string): Promise<boolean> {
    const isValid = await argon2.verify(hash, password, { secret: pepperBuffer })

    return isValid
}