import type { RefreshSession } from "./entity"

export type NewRefreshSession = Omit<RefreshSession, "id" | "time_created">

export interface RefreshSessionRepository {
    create(session: NewRefreshSession): Promise<RefreshSession>
    getByHash(tokenHash: string): Promise<RefreshSession | null>
    rotation(oldTokenHash: string, newTokenHash: string, timeLimit: Temporal.Instant): Promise<RefreshSession | null>
    delete(tokenHash: string): Promise<void>
}