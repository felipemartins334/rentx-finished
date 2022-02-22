import "reflect-metadata"
import "dotenv/config"
import "../../container"
import createConnection from '../typeorm'
import express, { NextFunction, Request, Response } from 'express'
import "express-async-errors"
import { AppError } from '../../errors/AppError'
import { routes} from './routes'

(async () => {
  const connection = await createConnection()
})()

const app = express()

app.use(express.json())

app.use(routes)

app.use((error: Error, request: Request, response: Response, next: NextFunction) => {
  if(error instanceof AppError){
    return response.status(error.statusCode).json({
      error: error.message
    })
  }
  return response.status(500).json({
    status: "Error",
    message: `Internal Server Error - ${error.message}`
  })
})

export { app }