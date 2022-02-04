import "reflect-metadata"
import "../../container"
import '../typeorm'
import express, { NextFunction, Request, Response } from 'express'
import "express-async-errors"
import { AppError } from '../../errors/AppError'
import { routes} from './routes'

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

app.listen(3333, () => {
  console.log("Server is running")
})