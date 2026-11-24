import argon2 from "argon2";
import type { PasswordHasher } from "../services/user/user.types";

export function createPasswordHasher(pepper: string): PasswordHasher {
	const pepperBuffer = Buffer.from(pepper);

	return {
		async hash(password) {
			const hash = await argon2.hash(password, {
				type: argon2.argon2id,
				memoryCost: 19456,
				timeCost: 2,
				parallelism: 1,
				secret: pepperBuffer,
			});

			return hash;
		},

		async verify(hash, password) {
			const isValid = await argon2.verify(hash, password, {
				secret: pepperBuffer,
			});

			return isValid;
		},
	};
}
