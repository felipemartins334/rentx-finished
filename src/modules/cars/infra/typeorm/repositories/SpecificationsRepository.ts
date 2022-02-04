import { getRepository, Repository } from "typeorm";
import { specificationsRoutes } from "../../../../../shared/infra/http/routes/specifications.routes";
import { ICreateSpecificationDTO } from "../../../dtos/ICreateSpecificationDTO";
import { ISpecificationsRepository } from "../../../repositories/ISpecificationsRepository";
import { Specification } from "../entities/Specification";

class SpecificationsRepository implements ISpecificationsRepository{
  
  private repository: Repository<Specification>

  constructor(){
    this.repository = getRepository(Specification)
  }

  async findByIds(ids: string[]): Promise<Specification[]> {
    const specifications = await this.repository.findByIds(ids)
    return specifications
  }

  async create({ name, description }: ICreateSpecificationDTO): Promise<Specification> {
    const specification = this.repository.create({
      name,
      description
    })
    await this.repository.save(specification)

    return specification

  }
  async findByName(name: string): Promise<Specification> {
    return await this.repository.findOne({
      where: {
        name
      }
    })
  }

}

export { SpecificationsRepository }