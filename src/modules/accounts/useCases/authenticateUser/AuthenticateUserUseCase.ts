import { AppError } from "../../../../shared/errors/AppError";
import { IAuthenticateUserDTO } from "../../dtos/IAuthenticateUserDTO";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { compare } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { inject, injectable } from "tsyringe";

interface IResponse{
  user:{
    name: string
    email: string
  }
  token: string
}

@injectable()
class AuthenticateUserUseCase{

  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository){}

  async execute({email, password}: IAuthenticateUserDTO): Promise<IResponse>{
    const user = await this.usersRepository.findByEmail(email)
    if(!user){
      throw new AppError("Email or password incorrect")
    }
    const passwordMatches = await compare(password, user.password)
    if(!passwordMatches){
      throw new AppError("Email or password incorrect")
    }
    const token = sign({
      user: user.id,
      name: user.name,
      email: user.email
    }, "e6cf3b331fadbd39b9759fb3979d5f8a", {
      expiresIn: "1d"
    })

    return {
      user:{
        name: user.name,
        email: user.email
      },
      token
    }
  }
}

export { AuthenticateUserUseCase }