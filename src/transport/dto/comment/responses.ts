import type { UserResponse } from "../user/responses";

export interface CommentResponse {
	id: number;
	content: string;
	postId: number;
	authorId: number;
	createdAt: Temporal.Instant;
	author: UserResponse;
}
