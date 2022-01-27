import { ICategoriesRepository } from "../../repositories/ICategoriesRepository"
import { CategoriesRepositoryInMemory } from "../../repositories/in-memory/CategoriesRepositoryInMemory"
import { CreateCategoryUseCase } from "../CreateCategory/CreateCategoryUseCase"
import { ListCategoriesUseCase } from "./ListCategoriesUseCase"

let listCategoriesUseCase: ListCategoriesUseCase
let createCategoryUseCase: CreateCategoryUseCase
let categoriesRepository: ICategoriesRepository

describe("List all categories", () => {
  
  beforeEach(() => {
    categoriesRepository = new CategoriesRepositoryInMemory()
    createCategoryUseCase = new CreateCategoryUseCase(categoriesRepository)
    listCategoriesUseCase = new ListCategoriesUseCase(categoriesRepository)
  })

  it("should be able to list all categories", async () => {

    await createCategoryUseCase.execute({
      name: "Tester",
      description: "Teste"
    })
    const categories = await listCategoriesUseCase.execute()

    expect(categories).toHaveLength(1)
  })
})

