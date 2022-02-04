import { getRepository, Repository } from "typeorm";
import { ICarsImageRepository } from "../../../repositories/ICarsImageRepository";
import { CarImage } from "../entities/CarImage";

class CarsImagesRepository implements ICarsImageRepository{
  
  constructor(){
    this.repository = getRepository(CarImage)
  }

  private repository: Repository<CarImage>

  async create(car_id: string, image_name: string): Promise<CarImage> {
    const carImage = this.repository.create({
      car_id,
      image_name
    })
    await this.repository.save(carImage)
    return carImage
  }

}

export { CarsImagesRepository }