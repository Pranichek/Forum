import type { PostgresClient } from "@prisma/orm-postgres/runtime";
import type { Contract } from "../prisma/contract.d";
import type { RefreshSession } from "../domain/refreshSession/entity";
import type { RefreshSessionRepository } from "../domain/refreshSession/repository";

export function createRefreshSessionRepository(
	db: PostgresClient<Contract>,
): RefreshSessionRepository {
	return {
		async create(session) {
			const newSession: RefreshSession =
				await db.orm.public.RefreshSession.create({
					tokenHash: session.tokenHash,
					time_limit: session.time_limit,

					user: (user) => user.connect({ id: session.userId }),
				});

			return newSession;
		},

		async getByHash(tokenHash) {
			const session: RefreshSession | null =
				await db.orm.public.RefreshSession.where({
					tokenHash: tokenHash,
				}).first();

			return session;
		},

		async rotation(data) {
			const updatedSession: RefreshSession | null =
				await db.orm.public.RefreshSession.where({
					tokenHash: data.oldTokenHash,
				}).update({
					tokenHash: data.newTokenHash,
					time_limit: data.timeLimit,
				});

			return updatedSession;
		},

		async delete(tokenHash) {
			await db.orm.public.RefreshSession.where({
				tokenHash: tokenHash,
			}).delete();
		},
	};
}
