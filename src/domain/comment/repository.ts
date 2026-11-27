import type { Comment } from "./entity";

export interface CreateCommentData {
	content: string;
	postId: number;
	authorId: number;
}

export interface CommentRepository {
	getByPostId(postId: number): Promise<Comment[]>;
	getById(id: number): Promise<Comment | null>;
	add(data: CreateCommentData): Promise<Comment>;
	delete(id: number, authorId: number ): Promise<void>;
}
