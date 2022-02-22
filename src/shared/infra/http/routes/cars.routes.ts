import { Router } from 'express'
import upload from '../../../../config/upload'
import multer from 'multer'
import { CreateCarController } from '../../../../modules/cars/useCases/CreateCar/CreateCarController'
import { CreateCarSpecificationController } from '../../../../modules/cars/useCases/CreateCarSpecification/CreateCarSpecificationController'
import { ListAvailableCarsController } from '../../../../modules/cars/useCases/ListAvailableCars/ListAvailableCarsController'
import { UploadCarImageController } from '../../../../modules/cars/useCases/UploadCarImage/UploadCarImageController'
import { ensureAdmin } from '../middlewares/EnsureAdmin'
import { ensureAuthenticated } from '../middlewares/EnsureAuthenticated'

const carsRoutes = Router()

const createCarController = new CreateCarController()
const listAvailableCarsController = new ListAvailableCarsController()
const createCarSpecificationController = new CreateCarSpecificationController()
const uploadCarImageController = new UploadCarImageController()

const uploadImage = multer(upload)

carsRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  createCarController.handle
  )
  
carsRoutes.get("/available", listAvailableCarsController.handle)

carsRoutes.post(
  "/specifications/:id",
  ensureAuthenticated,
  ensureAdmin,
  createCarSpecificationController.handle
  )

carsRoutes.post(
  "/images/:id", 
  ensureAuthenticated,
  ensureAdmin,
  uploadImage.array("images"),
  uploadCarImageController.handle
  )

export { carsRoutes }