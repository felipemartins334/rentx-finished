import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { IUsersTokenRepository } from "../../repositories/IUsersTokenRepository";
import { v4 as uuidV4 } from 'uuid'
import { IDateProvider } from "../../../../shared/container/providers/DateProvider/IDateProvider";
import { IMailProvider } from "../../../../shared/container/providers/MailProvider/IMailProvider";
import { resolve } from 'path'

@injectable()
class SendForgotPasswordMailUseCase{

  constructor(
    @inject("UsersRepository")
    private usersRepository:  IUsersRepository,
    @inject("UsersTokenRepository")
    private usersTokenRepository: IUsersTokenRepository,
    @inject("DayJsDateProvider")
    private dateProvider: IDateProvider,
    @inject("EtherealMailProvider")
    private mailProvider: IMailProvider
  ){}

  async execute(email: string): Promise<void>{
    const user = await this.usersRepository.findByEmail(email)
    
    const templatePath = resolve(__dirname, '..', '..', 'views', 'emails', 'forgotPassword.hbs')

    if(!user){
      throw new AppError("User does not exist")
    }

    const token = uuidV4()

    await this.usersTokenRepository.create({
      user_id: user.id,
      refresh_token: token,
      expires_date: this.dateProvider.addHours(3)
    })

    const variables = {
      name: user.name,
      link: `${process.env.FORGOT_MAIL_URL}${token}`
    }

    await this.mailProvider.sendMail(
      email,
      "Recuperação de Senha",
      variables,
      templatePath
      )
  }
}

export { SendForgotPasswordMailUseCase }