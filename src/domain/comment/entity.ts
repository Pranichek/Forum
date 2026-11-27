import type { PublicUser } from "../user/entity";

export interface Comment {
    id: number,
    content: string,
    postId: number,
    authorId: number,
    createdAt: Temporal.Instant,
    author: PublicUser;
}