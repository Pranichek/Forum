import type { PostgresClient } from "@prisma/orm-postgres/runtime";
import type { Contract } from "../prisma/contract.d";
import type { CommentRepository } from "../domain/comment/repository";


export function createCommentRepository(
	db: PostgresClient<Contract>,
): CommentRepository {
	return {
		async getByPostId(postId) {
			const comments =  await db.orm.public.Comment.include("author", (author) =>
				author.select("id", "email"),
			)
				.where({ postId: postId })
				.all();

			return comments.map((comment) => {
				if (!comment.author) {
					throw new Error("AUTHOR_NOT_FOUND");
				}
				return { ...comment, author: comment.author };
			})
		},

		async getById(id) {
			const comment = await db.orm.public.Comment.include("author", (author) =>
				author.select("id", "email"),
			)
                .where({ id: id })
                .first()
			
			if (!comment){
				return null
			}

			if (!comment.author){
				throw new Error("AUTHOR_NOT_FOUND")
			}

			return { ...comment, author: comment.author }
		},
		async add({ content, postId, authorId }) {
			try {
				const comment =  await db.orm.public.Comment.include("author", (author) =>
					author.select("id", "email"),
				).create({
					content: content,
					post: (post) => post.connect({ id: postId }),
					author: (author) => author.connect({ id: authorId }),
				});

				if (!comment.author){
					throw new Error("AUTHOR_NOT_FOUND");
				}

				return { ...comment, author: comment.author };
				
			} catch (error) {
				if (error instanceof Error && "sqlState" in error) {
					if (error.sqlState === "23505") {
						throw new Error("POST_NOT_FOUND");
					}
				}
				throw Error;
			}
		},

		async delete(id, authorId) {
			await db.orm.public.Comment.where({
				id: id,
				authorId: authorId
			}).delete();
		},
	};
}
