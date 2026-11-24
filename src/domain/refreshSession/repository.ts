import type { RefreshSession } from "./entity";

export type NewRefreshSession = Omit<RefreshSession, "id" | "time_created">;

export interface RotationData {
	oldTokenHash: string;
	newTokenHash: string;
	timeLimit: Temporal.Instant;
}

export interface RefreshSessionRepository {
	create(session: NewRefreshSession): Promise<RefreshSession>;
	getByHash(tokenHash: string): Promise<RefreshSession | null>;
	rotation(data: RotationData): Promise<RefreshSession | null>;
	delete(tokenHash: string): Promise<void>;
}
