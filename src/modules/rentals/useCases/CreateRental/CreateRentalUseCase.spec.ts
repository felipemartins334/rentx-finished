import dayjs from 'dayjs'
import { ICarsRepository } from '../../../cars/repositories/ICarsRepository'
import { CarsRepositoryInMemory } from '../../../cars/repositories/in-memory/CarsRepositoryInMemory'
import { IDateProvider } from '../../../../shared/container/providers/DateProvider/IDateProvider'
import { DayJsDateProvider } from '../../../../shared/container/providers/DateProvider/implementations/DayjsDateProvider'
import { AppError } from "../../../../shared/errors/AppError"
import { RentalsRepositoryInMemory } from "../../repositories/in-memory/RentalsRepositoryInMemory"
import { IRentalsRepository } from "../../repositories/IRentalsRepository"
import { CreateRentalUseCase } from "./CreateRentalUseCase"

let createRentalUseCase: CreateRentalUseCase
let rentalsRepositoryInMemory: IRentalsRepository
let dayJsProvider: IDateProvider
let carsRepositoryInMemory: ICarsRepository

describe("Create Rental", () => {

  const dayAdd24Hours = dayjs().add(1, "day").toDate()

  beforeEach(() => {
    dayJsProvider = new DayJsDateProvider()
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory()
    carsRepositoryInMemory = new CarsRepositoryInMemory()
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayJsProvider,
      carsRepositoryInMemory
    )
  })

  it("should be able to create a new rental", async () => {
    const car = await carsRepositoryInMemory.create({
      brand: "Teste",
      category_id: "123",
      daily_rate: 100,
      description: "Test",
      fine_amount: 40,
      license_plate: "ABC",
      name: "fiat"
    })
    const rental = await createRentalUseCase.execute({
      user_id: "12345",
      car_id: car.id,
      expected_return_date: dayAdd24Hours
    })

    expect(rental).toHaveProperty("id")
    expect(rental).toHaveProperty("start_date")
  })

  it("should not be able to create a new rental if there is another open to the same user", async () => {

    const car = await carsRepositoryInMemory.create({
      brand: "Teste",
      category_id: "123",
      daily_rate: 100,
      description: "Test",
      fine_amount: 40,
      license_plate: "ABC",
      name: "fiat"
    })

    const car2 = await carsRepositoryInMemory.create({
      brand: "Teste",
      category_id: "123",
      daily_rate: 100,
      description: "Test",
      fine_amount: 40,
      license_plate: "A2BC",
      name: "fiat"
    })

    await createRentalUseCase.execute({
      user_id: "12345",
      car_id: car.id,
      expected_return_date: dayAdd24Hours
    })

    expect(async () => {
      await createRentalUseCase.execute({
        user_id: "12345",
        car_id: car2.id,
        expected_return_date: dayAdd24Hours
      })


    }).rejects.toEqual(new AppError("There's a rental in progress for this user"))
  })

  it("should not be able to create a new rental if there is another open to the same car", async () => {

    const car = await carsRepositoryInMemory.create({
      brand: "Teste",
      category_id: "123",
      daily_rate: 100,
      description: "Test",
      fine_amount: 40,
      license_plate: "ABC",
      name: "fiat"
    })

    await createRentalUseCase.execute({
      user_id: "321",
      car_id: car.id,
      expected_return_date: dayAdd24Hours
    })

    await expect(async () => {

      await createRentalUseCase.execute({
        user_id: "123",
        car_id: car.id,
        expected_return_date: dayAdd24Hours
      })
    }

    ).rejects.toEqual(new AppError('Car is unavailable'))
  })

  it("should not be able to create a new rental with invalid return time", async () => {

    const car = await carsRepositoryInMemory.create({
      brand: "Teste",
      category_id: "123",
      daily_rate: 100,
      description: "Test",
      fine_amount: 40,
      license_plate: "ABC",
      name: "fiat"
    })

    await expect(async () => {
      await createRentalUseCase.execute({
        user_id: "321",
        car_id: car.id,
        expected_return_date: dayjs().toDate()
      })
    }
    ).rejects.toEqual(new AppError("Invalid return time"))
  })

})