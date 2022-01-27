import { getRepository, Repository } from "typeorm";
import { ICategoriesRepository } from "../../../repositories/ICategoriesRepository";
import { Category } from "../entities/Category";

class CategoriesRepository implements ICategoriesRepository{
  
  private repository: Repository<Category>
  
  async create({ name, description }: ICreateCategoryDTO): Promise<void> {
    const category = this.repository.create({ name, description })
    await this.repository.save(category)
  }

  async findByName(name: string): Promise<Category> {
    const category = await this.repository.findOne({
      where: {
        name
      }
    })
    return category
  }
  
  async list(): Promise<Category[]> {
    return await this.repository.find()
  }

  constructor(){
    this.repository = getRepository(Category)
  }

}

export { CategoriesRepository }