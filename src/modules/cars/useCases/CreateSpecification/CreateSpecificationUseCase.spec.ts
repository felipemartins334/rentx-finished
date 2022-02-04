import { AppError } from "../../../../shared/errors/AppError"
import { SpecificationsRepositoryInMemory } from "../../repositories/in-memory/SpecificationsRepositoryInMemory"
import { ISpecificationsRepository } from "../../repositories/ISpecificationsRepository"
import { CreateSpecificationUseCase } from "./CreateSpecificationUseCase"

let createSpecificationUseCase: CreateSpecificationUseCase
let specificationsRepository: ISpecificationsRepository

describe("Create a new specification", () => {

  beforeEach(() => {
    specificationsRepository = new SpecificationsRepositoryInMemory()
    createSpecificationUseCase = new CreateSpecificationUseCase(specificationsRepository)
  })

  it("should be able to create a new specification", async () => {
    await createSpecificationUseCase.execute({
      name: "Specification Test",
      description: "Test"
    })
    const specification = await specificationsRepository.findByName(
      "Specification Test"
      )
    
    expect(specification).toHaveProperty("id")
  })

  it("should not be able to create a new specification with existing name", () => {
    expect( async () => {
      
      await createSpecificationUseCase.execute({
        name: "Specification Test",
        description: "Test"
      })

      await createSpecificationUseCase.execute({
        name: "Specification Test",
        description: "Test"
      })

    }).rejects.toBeInstanceOf(AppError)
  })
})