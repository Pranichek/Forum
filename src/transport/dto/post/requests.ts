export interface GetPosts {
  category: string;
  take: string;
}

export interface PostParams {
  id: string;
}

export interface CreatePost {
  title: string;
  content: string;
  author?: string;
  category?: string;
}