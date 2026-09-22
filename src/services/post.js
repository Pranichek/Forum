import postRepository from "../repositories/post.js"

function getPosts(category, take) {
  return postRepository.getAll(category, take)
}

function getPost(id) {
  return postRepository.getById(id)
}


async function createPost(data) {
  const newPost = await postRepository.addPost(data)
  return newPost
}

export default { getPosts, getPost, createPost }