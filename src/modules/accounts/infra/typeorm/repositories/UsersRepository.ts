import { getRepository, Repository } from "typeorm";
import { ICreateUserDTO } from "../../../dtos/ICreateUserDTO";
import { User } from "../entities/User";
import { IUsersRepository } from "../../../repositories/IUsersRepository";

class UsersRepository implements IUsersRepository{
  
  private repository: Repository<User>

  constructor(){
    this.repository = getRepository(User)
  }

  async create(
    {
      name,
      driver_license,
      email,
      password,
      avatar,
      id
  }: ICreateUserDTO): Promise<void> {

    const user = this.repository.create({
      name,
      driver_license,
      email,
      avatar,
      id,
      password
    })

    await this.repository.save(user)

  }
  async findByEmail(email: string): Promise<User> {
    return await this.repository.findOne({
      where:
        {email}
    })

  }
  async findById(id: string): Promise<User> {
    return await this.repository.findOne({
      where:
        { id }
    })
  }

}

export { UsersRepository }