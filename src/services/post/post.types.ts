import type { Post } from "../../domain/post/entity";
import type { PostFilters } from "../../domain/post/repository";

interface CreatePostInput {
	title: string;
	content: string;
	categoryId: number;
	authorId: number;
}

export interface PostService {
	getPosts(filters: PostFilters): Promise<Post[]>;
	getPost(id: number): Promise<Post | null>;
	getMyPosts(authorId: number): Promise<Post[]>;
	createPost(data: CreatePostInput): Promise<Post | null>;
}
