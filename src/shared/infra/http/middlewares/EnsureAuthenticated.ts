import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../errors/AppError";
import { verify } from "jsonwebtoken";

interface IPayload{
  user: string
}

export const ensureAuthenticated = async (
  request: Request,
  response: Response,
  next: NextFunction): Promise<void> => {
    const auth = request.headers.authorization
    if(!auth){
      throw new AppError("Token missing")
    }
    const [, token]= auth.split(" ")
    try{
      const { user } = verify(token, "e6cf3b331fadbd39b9759fb3979d5f8a") as IPayload
      request.user = {
        id: user
      }
      next()
    }
    catch{
      throw new AppError("Invalid token")
    }

}