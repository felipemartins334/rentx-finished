import { AppError } from "../../../../shared/errors/AppError"
import { ICarsRepository } from "../../repositories/ICarsRepository"
import { CarsRepositoryInMemory } from "../../repositories/in-memory/CarsRepositoryInMemory"
import { SpecificationsRepositoryInMemory } from "../../repositories/in-memory/SpecificationsRepositoryInMemory"
import { ISpecificationsRepository } from "../../repositories/ISpecificationsRepository"
import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase"

let carsRepositoryInMemory: ICarsRepository
let specificationsRepositoryInMemory: ISpecificationsRepository
let createCarSpecificationUseCase: CreateCarSpecificationUseCase

describe("Create Car Specification", () => {

  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory()
    specificationsRepositoryInMemory = new SpecificationsRepositoryInMemory()
    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
      carsRepositoryInMemory, specificationsRepositoryInMemory
      )
  })

  it("should be able to add a new specification to a car", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Palio",
      brand: "Toyota",
      category: {
        id: "123"
      },
      daily_rate: 100,
      description: "Carro bonito",
      fine_amount: 40,
      license_plate: "123ABC"
    })

    const specification = await specificationsRepositoryInMemory.create({
      description: "test",
      name: "test"
    })

    const specificationsCars = await createCarSpecificationUseCase.execute({ 
      car_id: car.id, 
      specifications_id: [specification.id]
     })

     expect(specificationsCars).toHaveProperty("specifications")
     expect(specificationsCars.specifications.length).toBe(1)
  })

  it("should not be able to add a new specification to a nonexisting car", async () => {
    expect(async () => {
      const car_id = "1234"
      const specifications_id = ["54321"]
      await createCarSpecificationUseCase.execute({ car_id, specifications_id })
    }).rejects.toBeInstanceOf(AppError)
  })
})
