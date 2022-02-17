import { ICreateUserTokenDTO } from "../dtos/ICreateUserTokenDTO";
import { UserTokens } from "../infra/typeorm/entities/UserTokens";

interface IUsersTokenRepository{
  create({
    expires_date,
    refresh_token,
    user_id
  }: ICreateUserTokenDTO): Promise<UserTokens>

  findByUserIdAndRefreshToken(user_id: string, refresh_token): Promise<UserTokens>

  deleteById(id: string): Promise<void>
}

export { IUsersTokenRepository }