import { Router } from "express";
import multer from "multer"
import uploadFile from "../../../../config/upload";
import { CreateUserController } from "../../../../modules/accounts/useCases/createUser/CreateUserController";
import { UploadAvatarController } from "../../../../modules/accounts/useCases/uploadAvatar/UploadAvatarController";
import { ensureAuthenticated } from "../middlewares/EnsureAuthenticated";

const userRoutes = Router()

const uploadAvatar = multer(uploadFile.upload("./tmp/avatar"))

const createUserController = new CreateUserController()
const uploadAvatarController = new UploadAvatarController()

userRoutes.post("/", createUserController.handle)

userRoutes.patch(
  "/avatar", 
  uploadAvatar.single("avatar"), 
  ensureAuthenticated,uploadAvatarController.handle
  )

export { userRoutes }