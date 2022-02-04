import { Router } from "express";
import { CreateSpecificationController } from "../../../../modules/cars/useCases/CreateSpecification/CreateSpecificationController";
import { ensureAdmin } from "../middlewares/EnsureAdmin";
import { ensureAuthenticated } from "../middlewares/EnsureAuthenticated";

const specificationsRoutes = Router()

const createSpecificationController = new CreateSpecificationController()

specificationsRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  createSpecificationController.handle
  )

export { specificationsRoutes }