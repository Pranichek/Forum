import type { PostRepository } from "../../domain/post/repository"
import type { PostService } from "./post.types"

export function createPostService(postRepository: PostRepository): PostService {
  return {
    getPosts(category, take) {
      return postRepository.getAll(category, take)
    },

    getPost(id) {
      return postRepository.getById(id)
    },

    async createPost(data) {
      const newPost = await postRepository.addPost(data)
      return newPost
    },
  }
}