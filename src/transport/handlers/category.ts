import type { Request, Response } from "express"
import type { CategoryService } from "../../services/category/category.types"
import type { CreateCategoryBody, CategoryParams } from "../dto/category/requests"
import type { CategoryResponse } from "../dto/category/responses"
import type { ErrorDto } from "../dto/post/errors"


export interface CategoryHandlers {
    getCategories(req: Request, res: Response<CategoryResponse[] | ErrorDto>): Promise<void>
    getCategory(req: Request<CategoryParams>,res: Response<CategoryResponse | ErrorDto>): Promise<void>
    createCategory(req: Request<{}, CategoryResponse | ErrorDto, CreateCategoryBody>,res: Response<CategoryResponse | ErrorDto>): Promise<void>
}

export function createCategoryHandlers(categoryService: CategoryService): CategoryHandlers {
    return {
        async getCategories(req, res) {
            try {
                const categories = await categoryService.getCategories()
                res.status(200).json(categories)
            } catch (error) {
                console.log(error)
                res.status(500).json({ message: "Internal server error" })
            }
        },

        async getCategory(req, res) {
            const id: number = Number(req.params.id)


            if (!Number.isInteger(id) || id <= 0) {
                res.status(400).json({ message: "id повинен бути позитивним цілим числом" })
                return
            }

            try {
                const category = await categoryService.getCategory(id)

                if (!category) {
                    res.status(404).json({ message: "категорію не знайдено" })
                    return
                }

                res.status(200).json(category)
            } catch (error) {
                console.log(error)
                res.status(500).json({ message: "Internal server error" })
            }
        },

        async createCategory(req, res) {
            if (!req.body) {
                res.status(400).json({ message: "має бути JSON" })
                return
            }

            const { name } = req.body

            if (typeof name !== "string" || name.trim() === "") {
                res.status(422).json({ message: "name є обов'язковий" })
                return
            }

            try {
                const newCategory = await categoryService.createCategory({ name: name.trim() })

                if (!newCategory) {
                    res.status(409).json({ message: "категорія з такою назвою вже є" })
                    return
                }

                res.status(201).json(newCategory)
            } catch (error) {
                console.log(error)
                res.status(500).json({ message: "Internal server error" })
            }
        },
    }
}