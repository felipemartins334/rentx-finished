import { Router } from "express";
import multer from "multer"
import uploadFile from "../../../../config/upload";
import { CreateUserController } from "../../../../modules/accounts/useCases/createUser/CreateUserController";
import { ProfileUserController } from "../../../../modules/accounts/useCases/profileUser/ProfileUserController";
import { UploadAvatarController } from "../../../../modules/accounts/useCases/uploadAvatar/UploadAvatarController";
import { ensureAuthenticated } from "../middlewares/EnsureAuthenticated";

const userRoutes = Router()

const uploadAvatar = multer(uploadFile)

const createUserController = new CreateUserController()
const uploadAvatarController = new UploadAvatarController()
const profileUserController = new ProfileUserController()

userRoutes.post("/", createUserController.handle)

userRoutes.patch(
  "/avatar", 
  ensureAuthenticated,
  uploadAvatar.single("avatar"), 
  uploadAvatarController.handle
  )

userRoutes.get(
  "/profile",
  ensureAuthenticated,
  profileUserController.handle
)

export { userRoutes }