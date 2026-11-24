import type { RequestHandler } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { PostService } from "../../services/post/post.types";
import type { ErrorDto } from "../dto/common/errors";
import type { CreatePost, GetPosts, PostParams } from "../dto/post/requests";
import type { PostResponse } from "../dto/post/responses";

export interface PostHandlers {
	getPosts: RequestHandler<
		ParamsDictionary,
		PostResponse[] | ErrorDto,
		unknown,
		GetPosts
	>;
	getPost: RequestHandler<PostParams, PostResponse | ErrorDto>;
	createPost: RequestHandler<
		ParamsDictionary,
		PostResponse | ErrorDto,
		CreatePost
	>;
	getMyPosts: RequestHandler<ParamsDictionary, PostResponse[] | ErrorDto>;
}

export function createPostHandlers(postService: PostService): PostHandlers {
	return {
		async getPosts(req, res) {
			const { category, take } = req.query;

			let takeNumber: number | undefined;
			if (take) {
				takeNumber = Number(take);
				if (!Number.isInteger(takeNumber) || takeNumber <= 0) {
					res
						.status(422)
						.json({ message: "take повинене бути додатнім числом" });
					return;
				}
			}

			const posts = await postService.getPosts({
				category: category,
				take: takeNumber,
			});

			res.status(200).json(posts);
		},

		async getPost(req, res) {
			const id: number = Number(req.params.id);

			if (!Number.isInteger(id) || id <= 0) {
				res.status(422).json({ message: "id повино бути додатнім числом" });
				return;
			}

			const post = await postService.getPost(id);
			if (!post) {
				res.status(404).json({ message: "пост не знайдено" });
				return;
			}

			res.status(200).json(post);
		},

		async createPost(req, res) {
			const { title, content, categoryId, authorId } = req.body;

			if (
				typeof categoryId !== "number" ||
				!Number.isInteger(categoryId) ||
				categoryId <= 0
			) {
				res
					.status(400)
					.json({ message: "categoryId повинен бути додатнім цілим числом" });
				return;
			}

			if (
				typeof authorId !== "number" ||
				!Number.isInteger(authorId) ||
				authorId <= 0
			) {
				res
					.status(400)
					.json({ message: "authorId повинен бути додатнім цілим числом" });
				return;
			}

			if (!title || !content) {
				res.status(422).json({ message: "title та content обов'язкові" });
				return;
			}

			try {
				const newPost = await postService.createPost({
					title: title,
					content: content,
					categoryId: categoryId,
					authorId: authorId,
				});

				if (!newPost) {
					res
						.status(404)
						.json({ message: "Категорію з таким categoryId не знайдено" });
					return;
				}

				res.status(201).json(newPost);
			} catch (error) {
				console.log(error);
				res.status(500).json({ message: "Internal server error" });
			}
		},

		async getMyPosts(_req, res) {
			const authorId = res.locals.userId;

			if (authorId === undefined) {
				res.status(401).json({ message: "Unauthorized" });
				return;
			}

			try {
				const posts = await postService.getMyPosts(authorId);
				res.status(200).json(posts);
			} catch (error) {
				console.log(error);
				res.status(500).json({ message: "Internal server error" });
			}
		},
	};
}
