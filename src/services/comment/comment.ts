import type { CommentRepository } from "../../domain/comment/repository";
import type { CommentService } from "./comment.types";

export function createCommentService(
	commentRepository: CommentRepository,
): CommentService {
	return {
		async getComments(postId) {
			return await commentRepository.getByPostId(postId);
		},

		async createComment(input) {
			const content = input.content.trim();

			if (content.length === 0 || content.length > 500) {
				throw new Error("INVALID_COMMENT_CONTENT");
			}
			return await commentRepository.add({
				content: content,
				postId: input.postId,
				authorId: input.authorId,
			});
		},

		async deleteComment(input) {
			const comment = await commentRepository.getById(input.commentId);
			if (!comment) {
				throw new Error("COMMENT_NOT_FOUND");
			}

			if (comment.authorId !== input.userId) {
				throw new Error("FORBIDDEN");
			}

			await commentRepository.delete(input.commentId, input.userId);
		},
	};
}
