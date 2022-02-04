import { ICarsRepository } from "../../repositories/ICarsRepository"
import { CarsRepositoryInMemory } from "../../repositories/in-memory/CarsRepositoryInMemory"
import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase"

let carsRepositoryInMemory: ICarsRepository
let listAvailableCars: ListAvailableCarsUseCase
 
 describe("List Cars", () => {

  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory()
    listAvailableCars = new ListAvailableCarsUseCase(carsRepositoryInMemory)
  })

  it("should be able to list all available cars", async () => {
    const car = await carsRepositoryInMemory.create({
      brand: "Car_brand",
      category: {
        id:"category_id"
      },
      daily_rate: 140,
      description: "carro bonito",
      fine_amount: 100,
      license_plate: "DDD-123",
      name: "Car 1"
    })
    const cars = await listAvailableCars.execute({})

    expect(cars).toEqual([car])
   })

  it("should be able to list all available cars by brand", async () => {
    const car = await carsRepositoryInMemory.create({
      brand: "Car_brand",
      category: {
        id:"category_id"
      },
      daily_rate: 140,
      description: "carro bonito",
      fine_amount: 100,
      license_plate: "DDD-123",
      name: "Car 1"
    })

    const cars = await listAvailableCars.execute({
      brand: "Car_brand"
    })
    expect(cars).toEqual([car])
  })

  it("should be able to list all available cars by name", async () => {
    const car = await carsRepositoryInMemory.create({
      brand: "Car_brand",
      category: {
        id:"category_id"
      },
      daily_rate: 140,
      description: "carro bonito",
      fine_amount: 100,
      license_plate: "DDD-123",
      name: "Car 1"
    })

    const cars = await listAvailableCars.execute({
      name: "Car 1"
    })
    expect(cars).toEqual([car])
  })

  it("should be able to list all available cars by category", async () => {
    const car = await carsRepositoryInMemory.create({
      brand: "Car_brand",
      category: {
        id:"category_id"
      },
      daily_rate: 140,
      description: "carro bonito",
      fine_amount: 100,
      license_plate: "DDD-123",
      name: "Car 1"
    })

    const cars = await listAvailableCars.execute({
      category_id: "category_id"
    })
    expect(cars).toEqual([car])
  })
 })