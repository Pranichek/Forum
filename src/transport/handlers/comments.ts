import type { RequestHandler } from "express";
import type { CommentService } from "../../services/comment/comment.types";
import type { ErrorDto } from "../dto/common/errors";
import type {PostCommentsParams} from "../dto/comment/requests";
import type { CommentResponse } from "../dto/comment/responses";

export interface CommentHandlers {
	getComments: RequestHandler<PostCommentsParams, CommentResponse[] | ErrorDto>;
	createComment: RequestHandler;
	deleteComment: RequestHandler;
}

export function createCommentHandlers(
	commentService: CommentService,
): CommentHandlers {
	return {
		async getComments(req, res) {
			const postId: number = Number(req.params.postId);

			if (!postId) {
				res.status(400).json({ message: "Некоректний id" });
				return;
			}

			try {
				const comments = await commentService.getComments(postId);
				res.status(200).json(comments);
			} catch (error) {
				if (error instanceof Error) {
					if (error.message === "POST_NOT_FOUND") {
						res.status(404).json({ message: "пост не знайдено" });
						return;
					}
				}

				console.log(error);
				res.status(500).json({ message: "Internal server error" });
			}
		},

		async createComment(req, res) {
			const authorId = res.locals.userId;

			if (authorId === undefined) {
				res.status(401).json({ message: "Unauthorized" });
				return;
			}

			const postId: number = Number(req.params.postId);

			if (!Number.isInteger(postId) || postId <= 0) {
				res.status(400).json({ message: "Некоректний id" });
				return;
			}

			const content = req.body.content;

			if (typeof content !== "string") {
				res.status(400).json({ message: "Коментарий має бути текстом" });
				return;
			}

			try {
				const comment = await commentService.createComment({
					postId: postId,
					authorId: authorId,
					content: content,
				});

				res.status(201).json(comment);
			} catch (error) {
				if (error instanceof Error) {
					if (error.message === "INVALID_COMMENT_CONTENT") {
						res
							.status(400)
							.json({ message: "коментар має бути від 1 до 500 символів" });
						return;
					}

					if (error.message === "POST_NOT_FOUND") {
						res.status(404).json({ message: "пост не знайдено" });
						return;
					}
				}

				console.log(error);
				res.status(500).json({ message: "Internal server error" });
			}
		},

		async deleteComment(req, res) {
			const userId = res.locals.userId;

			if (userId === undefined) {
				res.status(401).json({ message: "Unauthorized" });
				return;
			}

			const commentId: number = Number(req.params.commentId);

			if (!Number.isInteger(commentId) || commentId <= 0) {
				res.status(400).json({ message: "Некоректний id" });
				return;
			}

			try {
				await commentService.deleteComment({
					commentId: commentId,
					userId: userId,
				});

				res.status(204).end();
			} catch (error) {
				if (error instanceof Error) {
					if (error.message === "COMMENT_NOT_FOUND") {
						res.status(404).json({
							message: "коментар не знайдено",
						});
						return;
					}
					if (error.message === "FORBIDDEN") {
						res.status(403).json({
							message: "Можна видаляти лише власні коментарі",
						});
						return;
					}
				}

				console.log(error);
				res.status(500).json({ message: "Internal server error" });
			}
		},
	};
}
