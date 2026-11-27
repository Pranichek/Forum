import type { Comment } from "../../domain/comment/entity";

export interface CreateCommenInput {
	postId: number;
	authorId: number;
	content: string;
}

export interface DeleteCommentInput {
	commentId: number;
	userId: number;
}

export interface CommentService {
	getComments(postId: number): Promise<Comment[]>;
	createComment(input: CreateCommenInput): Promise<Comment>;
	deleteComment(input: DeleteCommentInput): Promise<void>;
}
