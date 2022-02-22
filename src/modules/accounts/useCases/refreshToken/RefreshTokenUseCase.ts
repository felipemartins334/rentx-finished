import { verify, sign } from 'jsonwebtoken'
import { inject, injectable } from 'tsyringe'
import auth from '../../../../config/auth'
import { IDateProvider } from '../../../../shared/container/providers/DateProvider/IDateProvider'
import { AppError } from '../../../../shared/errors/AppError'
import { IUsersTokenRepository } from '../../repositories/IUsersTokenRepository'

interface IPayload{
  sub: string
  email: string
}

interface ITokenResponse{
  token: string
  refresh_token: string
}

@injectable()
class RefreshTokenUseCase{

  constructor(
    @inject("UsersTokenRepository")
    private usersTokenRepository: IUsersTokenRepository,
    @inject("DayJsDateProvider")
    private daysJsDateProvider: IDateProvider
  ){}

  async execute(refresh_token: string): Promise<ITokenResponse>{
    const { email, sub } = verify(refresh_token, auth.secret_refresh_token) as IPayload
    
    const user_id = sub 

    const userToken = await this.usersTokenRepository.findByUserIdAndRefreshToken(
      user_id, refresh_token
      )

    if(!userToken){
      throw new AppError("Refresh Token does not exist")
    }

    await this.usersTokenRepository.deleteById(userToken.id)

    const refresh_token_expires_date = this.daysJsDateProvider.addDays(
      auth.expires_refresh_token_days
    )

    const token = sign({ email }, auth.secret_refresh_token, {
      subject: sub,
      expiresIn: auth.expires_in_refresh_token
    })

    await this.usersTokenRepository.create({
      expires_date: refresh_token_expires_date,
      refresh_token: token,
      user_id
    })


    const newToken = sign({}, auth.secret_token, {
      subject: user_id,
      expiresIn: auth.expires_in_token
    })

    return {
      refresh_token,
      token: newToken
    }
  }


}

export { RefreshTokenUseCase }