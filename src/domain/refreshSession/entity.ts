export interface RefreshSession {
	id: number;
	tokenHash: string;
	userId: number;
	time_created: Temporal.Instant;
	time_limit: Temporal.Instant;
}
