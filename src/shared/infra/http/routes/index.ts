import { Router } from "express";
import { authenticationRoutes } from "./authentication.routes";
import { userRoutes } from "./user.routes";
import { categoriesRoutes } from "./categories.routes";

const routes = Router()

routes.use("/users", userRoutes)
routes.use("/categories", categoriesRoutes)
routes.use("/sessions", authenticationRoutes)

export { routes }