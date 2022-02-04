import { Router } from "express";
import { authenticationRoutes } from "./authentication.routes";
import { userRoutes } from "./user.routes";
import { categoriesRoutes } from "./categories.routes";
import { specificationsRoutes } from "./specifications.routes";
import { carsRoutes } from "./cars.routes";

const routes = Router()

routes.use("/users", userRoutes)
routes.use("/categories", categoriesRoutes)
routes.use("/sessions", authenticationRoutes)
routes.use("/specifications", specificationsRoutes)
routes.use("/cars", carsRoutes)

export { routes }