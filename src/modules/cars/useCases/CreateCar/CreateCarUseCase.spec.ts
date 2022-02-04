import { AppError } from "../../../../shared/errors/AppError"
import { ICarsRepository } from "../../repositories/ICarsRepository"
import { CarsRepositoryInMemory } from "../../repositories/in-memory/CarsRepositoryInMemory"
import { CreateCarUseCase } from "./CreateCarUseCase"

let carsRepository: ICarsRepository
let createCarUseCase: CreateCarUseCase

describe("Create a new car", () => {

  beforeEach(() => {
    carsRepository = new CarsRepositoryInMemory()
    createCarUseCase = new CreateCarUseCase(carsRepository)
  })

  it("should be able to create a new car", async () => {
    const car = await createCarUseCase.execute({
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

    expect(car).toHaveProperty("id")
  })

  it("should not be able to create a new car with existing license plate", () => {
    expect(async () => {
      const car0 = await createCarUseCase.execute({
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
      const car1 = await createCarUseCase.execute({
        name: "Palio",
        brand: "Toyota",
        category: {
          id:"123"
        },
        daily_rate: 100,
        description: "Carro bonito",
        fine_amount: 40,
        license_plate: "123ABC"
      })
    }).rejects.toBeInstanceOf(AppError)
  })

  it("the car should be registered with available being true", async () => {
    const car = await createCarUseCase.execute({
      name: "Palio",
      brand: "Toyota",
      category:{
        id: "123"
      },
      daily_rate: 100,
      description: "Carro bonito",
      fine_amount: 40,
      license_plate: "123ABC"
    })
    expect(car.available).toBe(true)
  })

})