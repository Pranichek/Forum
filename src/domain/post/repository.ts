import type { Post } from "./entity";

export interface CreatePostData {
	title: string;
	content: string;
	categoryId: number;
	authorId: number;
}

export interface PostFilters {
	category: string | undefined;
	take: number | undefined;
}

export interface PostRepository {
	getAll(filters: PostFilters): Promise<Post[]>;
	getById(id: number): Promise<Post | null>;
	addPost(data: CreatePostData): Promise<Post>;
	getByAuthorId(authorId: number): Promise<Post[]>;
}
