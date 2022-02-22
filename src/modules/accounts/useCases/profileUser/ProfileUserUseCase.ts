import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { User } from "../../infra/typeorm/entities/User";
import { IUsersRepository } from "../../repositories/IUsersRepository";

@injectable()
class ProfileUserUseCase{

  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ){}

  async execute(id: string): Promise<User>{
    const userExists = await this.usersRepository.findById(id)
    return userExists
  }
}

export { ProfileUserUseCase }