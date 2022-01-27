import { Router } from "express";
import { CreateCategoryController } from "../../../../modules/cars/useCases/CreateCategory/CreateCategoryController";
import { ListCategoriesController } from "../../../../modules/cars/useCases/ListCategories/ListCategoriesController";
import { ensureAuthenticated } from "../middlewares/EnsureAuthenticated";
import upload from "../../../../config/upload";
import multer from "multer";
import { ImportCategoriesController } from "../../../../modules/cars/useCases/ImportCategories/ImportCategoriesController";

const categoriesRoutes = Router()

const uploadFile = multer(upload.upload("./tmp"))

const createCategoryController = new CreateCategoryController()
const listCategoriesController = new ListCategoriesController()
const importCategoriesController = new ImportCategoriesController()

categoriesRoutes.post("/", ensureAuthenticated, createCategoryController.handle)
categoriesRoutes.get("/", ensureAuthenticated, listCategoriesController.handle)
categoriesRoutes.post(
  "/import",
  ensureAuthenticated,
  uploadFile.single("file"), 
  importCategoriesController.handle)

export { categoriesRoutes }