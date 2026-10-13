import type { PostRepository } from "../../domain/post/repository"
import type { CategoryRepository } from "../../domain/category/repository"
import type { PostService } from "./post.types"


export function createPostService(
  postRepository: PostRepository,
  categoryRepository: CategoryRepository
): PostService {
  return {
    getPosts(category, take) {
      return postRepository.getAll(category, take)
    },

    getPost(id) {
      return postRepository.getById(id)
    },

    async createPost(data) {
      const category = await categoryRepository.findById(data.categoryId)

      if (!category) {
        return null
      }

      const newPost = await postRepository.addPost(data)
      return newPost
    },
  }
}