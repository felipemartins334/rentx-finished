import { ICreateCarDTO } from "../../dtos/ICreateCarDTO";
import { Car } from "../../infra/typeorm/entities/Car";
import { ICarsRepository } from "../ICarsRepository";

class CarsRepositoryInMemory implements ICarsRepository{
  
  private cars: Car[] = []
  
  async findByLicensePlate(license_plate: string): Promise<Car> {
    return this.cars.find(car => car.license_plate === license_plate)
  }
  
  async findById(id: string): Promise<Car> {
    return this.cars.find(car => car.id === id)
  }

  async findAvailable(
    brand?: string,
    category_id?: string,
    name?: string
  ): Promise<Car[]> {
    return this.cars
      .filter(car => {
        if(
          car.available === true || 
          ((brand && car.brand === brand) || 
          (category_id && car.category.id === category_id) || 
          (name && car.name === name))){
          return car
        }
      })

  }

  async create({
    brand,
    category_id,
    daily_rate,
    description,
    fine_amount,
    license_plate,
    name,
    
  }: ICreateCarDTO): Promise<Car> {
    const car = new Car()
    Object.assign(car, {
      brand,
      category: {
        id: category_id
      },
      daily_rate,
      description,
      fine_amount,
      license_plate,
      name,
      available: true,
      created_at: new Date(),
      
    })
    this.cars.push(car)
    return car
  }

}

export { CarsRepositoryInMemory }