import { AppError } from "../../../../shared/errors/AppError"
import { ICategoriesRepository } from "../../repositories/ICategoriesRepository"
import { CategoriesRepositoryInMemory } from "../../repositories/in-memory/CategoriesRepositoryInMemory"
import { CreateCategoryUseCase } from "../../../../modules/cars/useCases/CreateCategory/CreateCategoryUseCase"

let createCategoryUseCase: CreateCategoryUseCase
let categoriesRepository: ICategoriesRepository

describe("Create a new category", () => {

  beforeEach(() => {
    categoriesRepository = new CategoriesRepositoryInMemory()
    createCategoryUseCase = new CreateCategoryUseCase(categoriesRepository)
  })

  it("should be able to create a new category", async () => {
    const name = "Test Category"
    const description = "Category Description"
    await createCategoryUseCase.execute({name, description})
    const category = await categoriesRepository.findByName(name)

    expect(category).toHaveProperty("id")
  })

  it("should not be able to create a category with name existing", () => {
    expect( async () => {
      
      const name = "Test Category"
      const description = "Category Description"
      await createCategoryUseCase.execute({name, description})
      await createCategoryUseCase.execute({name, description})

    }).rejects.toBeInstanceOf(AppError)
  })

})