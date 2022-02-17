import { AppError } from "../../../../shared/errors/AppError";
import { IAuthenticateUserDTO } from "../../dtos/IAuthenticateUserDTO";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { compare } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { inject, injectable } from "tsyringe";
import { IUsersTokenRepository } from "../../repositories/IUsersTokenRepository";
import auth from "../../../../config/auth";
import { IDateProvider } from "../../../../shared/container/providers/DateProvider/IDateProvider";

interface IResponse {
  user: {
    name: string
    email: string
  }
  token: string
  refresh_token: string
}

@injectable()
class AuthenticateUserUseCase {

  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("UsersTokenRepository")
    private usersTokenRepository: IUsersTokenRepository,
    @inject("DayJsDateProvider")
    private daysJsDateProvider: IDateProvider
  ) { }

  async execute({ email, password }: IAuthenticateUserDTO): Promise<IResponse> {
    
    const user = await this.usersRepository.findByEmail(email)

    const { 
      expires_in_token,
      secret_refresh_token,
      secret_token,
      expires_in_refresh_token,
      expires_refresh_token_days
    } = auth

    if (!user) {
      throw new AppError("Email or password incorrect")
    }

    const passwordMatches = await compare(password, user.password)

    if (!passwordMatches) {
      throw new AppError("Email or password incorrect")
    }

    const token = sign({}, secret_token, {
      subject: user.id,
      expiresIn: expires_in_token
    })

    const refresh_token = sign({ email }, secret_refresh_token, {
      subject: user.id,
      expiresIn: expires_in_refresh_token
    })

    const refresh_token_expires_date = this.daysJsDateProvider.addDays(
      expires_refresh_token_days
    )

    await this.usersTokenRepository.create({
      expires_date: refresh_token_expires_date,
      refresh_token,
      user_id: user.id
    })

    return {
      user: {
        name: user.name,
        email: user.email
      },
      token,
      refresh_token
    }
  }
}

export { AuthenticateUserUseCase }