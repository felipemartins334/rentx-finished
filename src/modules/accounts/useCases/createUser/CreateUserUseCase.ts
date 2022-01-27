import { inject, injectable } from "tsyringe";
import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { hash } from 'bcrypt'
import { AppError } from "../../../../shared/errors/AppError";

@injectable()
class CreateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({name, email, password, driver_license}: ICreateUserDTO) {
    const userExists = await this.usersRepository.findByEmail(email)
    if(userExists){
      throw new AppError("User already exists")
    }
    const passwordHash = await hash(password, 8)
    this.usersRepository.create({
      name,
      email,
      password: passwordHash,
      driver_license})
  }
}

export { CreateUserUseCase };