import postRepository, { type Post } from "../repositories/post"

function getPosts(category: string | undefined, take: number | undefined) {
  return postRepository.getAll(category, take)
}

function getPost(id: number): Post | undefined {
  return postRepository.getById(id)
}


async function createPost(data: {title: string, content: string, author?: string | undefined, category?: string | undefined }): Promise<Post> {
  const newPost = await postRepository.addPost(data)
  return newPost
}

export default { getPosts, getPost, createPost }