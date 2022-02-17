import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../errors/AppError";
import { verify } from "jsonwebtoken";
import { UsersTokenRepository } from "../../../../modules/accounts/infra/typeorm/repositories/UsersTokenRepository";
import auth from "../../../../config/auth";


export const ensureAuthenticated = async (
  request: Request,
  response: Response,
  next: NextFunction): Promise<void> => {

    const authHeader = request.headers.authorization

    const userTokensRepository = new UsersTokenRepository()

    if(!authHeader){
      throw new AppError("Token missing")
    }
    const [, token]= authHeader.split(" ")
    try{
      const { sub } = verify(token, auth.secret_refresh_token)
      
      const user = await userTokensRepository.findByUserIdAndRefreshToken(
        sub as string,
        token
      )
      
      if(!user){
        throw new AppError("User does not exists", 401)
      }
      request.user = {
        id: sub as string
      }
      next()
    }
    catch{
      throw new AppError("Invalid token", 401)
    }

}