import { inject, injectable } from 'tsyringe';
import { IDateProvider } from '../../../../shared/container/providers/DateProvider/IDateProvider';
import { AppError } from "../../../../shared/errors/AppError";
import { ICarsRepository } from '../../../cars/repositories/ICarsRepository';
import { ICreateRentalDTO } from "../../dtos/ICreateRentalDTO";
import { Rental } from "../../infra/typeorm/entities/Rental";
import { IRentalsRepository } from "../../repositories/IRentalsRepository";

@injectable()
class CreateRentalUseCase{

  constructor(
    @inject("RentalsRepository")
    private rentalsRepository: IRentalsRepository,
    @inject("DayJsDateProvider")
    private dateProvider: IDateProvider,
    @inject("CarsRepository")
    private carsRepository: ICarsRepository
  ){}

  async execute({
    car_id,
    expected_return_date,
    user_id
  }: ICreateRentalDTO): Promise<Rental>{
    
    const minimumHours = 24

    const carUnavailable = await this.rentalsRepository.findOpenRentalByCar(car_id)
    
    if(carUnavailable){ 
      throw new AppError("Car is unavailable")
    }

    const rentalOpenToUser = await this.rentalsRepository.findOpenRentalByUser(user_id)

    if(rentalOpenToUser){
      throw new AppError("There's a rental in progress for this user")
    }

    const compare = this.dateProvider.compareInHours(
      this.dateProvider.dateNow(),
      expected_return_date 
      )

    if(compare < minimumHours){
      throw new AppError("Invalid return time")
    }

    const rental = await this.rentalsRepository.create({
      user_id,
      car_id,
      expected_return_date
    })

    await this.carsRepository.updateAvailable(car_id, false)

    return rental
  }

}

export { CreateRentalUseCase }