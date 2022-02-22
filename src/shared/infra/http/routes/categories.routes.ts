import { Router } from "express";
import { CreateCategoryController } from "../../../../modules/cars/useCases/CreateCategory/CreateCategoryController";
import { ListCategoriesController } from "../../../../modules/cars/useCases/ListCategories/ListCategoriesController";
import { ensureAuthenticated } from "../middlewares/EnsureAuthenticated";
import upload from "../../../../config/upload";
import multer from "multer";
import { ImportCategoriesController } from "../../../../modules/cars/useCases/ImportCategories/ImportCategoriesController";
import { ensureAdmin } from "../middlewares/EnsureAdmin";

const categoriesRoutes = Router()

const uploadFile = multer(upload)

const createCategoryController = new CreateCategoryController()
const listCategoriesController = new ListCategoriesController()
const importCategoriesController = new ImportCategoriesController()

categoriesRoutes.post(
  "/", 
  ensureAuthenticated, 
  ensureAdmin, 
  createCategoryController.handle
  )

categoriesRoutes.get("/", ensureAuthenticated, listCategoriesController.handle)

categoriesRoutes.post(
  "/import",
  ensureAuthenticated,
  ensureAdmin,
  uploadFile.single("file"), 
  importCategoriesController.handle)

export { categoriesRoutes }