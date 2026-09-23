import postService from "../services/post.js"

function getPosts(req, res) {
    const { category } = req.query
    let { take } = req.query

    if (take) {
        take = Number(take)
        if (!Number.isInteger(take) || take <= 0) {
            return res.status(422).json({ message: "take повинене бути додатнім числом" })
        }
    }

    const posts = postService.getPosts(category, take)

    res.status(200).json(posts)
}

function getPost(req, res) {
    const id = Number(req.params.id)

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(422).json({ message: "id повино бути додатнім числом" })
    }

    const post = postService.getPost(id)
    if (!post) {
        return res.status(404).json(
            { message: "пост не знайдено" }
        )
    }

    res.status(200).json(post)
}

async function createPost(req, res) {
    const { title, content, author, category } = req.body


    if (!title || !content) {
        return res.status(422).json({ message: "title та content обов'язкові" })
    }

    try {
        const newPost = await postService.createPost(
            { 
                title, 
                content, 
                author, 
                category 
            }
        )
    } catch (error) {
        console.log(error)
    }


    res.status(201).json(newPost)
}

export default { getPosts, getPost, createPost }