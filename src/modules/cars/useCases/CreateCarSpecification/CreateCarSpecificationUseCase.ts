import { inject, injectable } from "tsyringe"
import { AppError } from "../../../../shared/errors/AppError"
import { Car } from "../../infra/typeorm/entities/Car"
import { ICarsRepository } from "../../repositories/ICarsRepository"
import { ISpecificationsRepository } from "../../repositories/ISpecificationsRepository"

interface IRequest{
  car_id: string
  specifications_id: string[]
}

@injectable()
class CreateCarSpecificationUseCase{
  constructor(
    @inject("CarsRepository")
    private carsRepository: ICarsRepository,
    @inject("SpecificationsRepository")
    private specificationsRepository: ISpecificationsRepository
  ){}

  async execute({ car_id, specifications_id}: IRequest): Promise<Car>{

    const carExists = await this.carsRepository.findById(car_id)

    if(!carExists){ 
      throw new AppError("Car doesn't exist")
    }

    const specifications = await this.specificationsRepository.findByIds(
      specifications_id
    )

    if(!specifications){
      throw new AppError("Specifications not found")
    }
    
    carExists.specifications = specifications

    await this.carsRepository.create({
      ...carExists,
      category_id: carExists.category.id
    })

    return carExists
  }
}

export { CreateCarSpecificationUseCase  }