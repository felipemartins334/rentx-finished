import { ICreateCarDTO } from "../../../dtos/ICreateCarDTO";
import { ICarsRepository } from "../../../repositories/ICarsRepository";
import { getRepository, QueryBuilder, Repository } from "typeorm";
import { Car } from "../entities/Car";

class CarsRepository implements ICarsRepository{

  private repository: Repository<Car>

  constructor(){
    this.repository = getRepository(Car)
  }
 
  async create({
    name,
    brand,
    category_id,
    daily_rate,
    description,
    fine_amount,
    license_plate,
    specifications,
    id
  }: ICreateCarDTO): Promise<Car> {
    const car = this.repository.create({
      id,
      name,
      brand, 
      daily_rate,
      description,
      fine_amount,
      license_plate,
      specifications,
      category: {
        id: category_id
      }
    })
    await this.repository.save(car)
    return car
    
  }
  
  async findByLicensePlate(license_plate: string): Promise<Car> {
    const car = await this.repository.findOne({
      where:
      { license_plate }
    })
    return car
  }
  
  async findAvailable(
    brand?: string,
    category_id?: string,
    name?: string
    ): Promise<Car[]> {

      const cars = await this.repository.find({
        where: {
          available: true
        }
      })
      
      if(name){
        return cars.filter(car => car.name === name)
      }

      if(brand){
        return cars.filter(car => car.brand === brand)
      }

      if(category_id){
        return cars.filter(car => car.category.id === category_id)
      }

      return cars
      
    }
    
    async findById(id: string): Promise<Car> {
      return await this.repository.findOne({
        where: {
          id
        }
      })
    }

    async updateAvailable(id: string, available: boolean): Promise<void> {
      await this.repository
        .createQueryBuilder()
        .update()
        .set({available})
        .where("id = :id")
        .setParameters({ id })
        .execute()
    }
  }
  
  export { CarsRepository }