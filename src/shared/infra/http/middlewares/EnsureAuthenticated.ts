import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../errors/AppError";
import { verify } from "jsonwebtoken";
import auth from "../../../../config/auth";


export const ensureAuthenticated = async (
  request: Request,
  response: Response,
  next: NextFunction): Promise<void> => {

    const authHeader = request.headers.authorization


    if(!authHeader){
      throw new AppError("Token missing")
    }
    const [, token]= authHeader.split(" ")
    try{
      const { sub } = verify(token, auth.secret_token)

      request.user = {
        id: sub as string
      }
      next()
    }
    catch{
      throw new AppError("Invalid token", 401)
    }

}