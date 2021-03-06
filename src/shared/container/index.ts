import "reflect-metadata"
import './providers/'
import { container } from 'tsyringe'
import { UsersRepository } from '../../modules/accounts/infra/typeorm/repositories/UsersRepository'
import { IUsersRepository } from '../../modules/accounts/repositories/IUsersRepository'
import { CarsImagesRepository } from "../../modules/cars/infra/typeorm/repositories/CarsImagesRepository"
import { CarsRepository } from "../../modules/cars/infra/typeorm/repositories/CarsRepository"
import { CategoriesRepository } from "../../modules/cars/infra/typeorm/repositories/CategoriesRepository"
import { SpecificationsRepository } from "../../modules/cars/infra/typeorm/repositories/SpecificationsRepository"
import { ICarsImageRepository } from "../../modules/cars/repositories/ICarsImageRepository"
import { ICarsRepository } from "../../modules/cars/repositories/ICarsRepository"
import { ICategoriesRepository } from "../../modules/cars/repositories/ICategoriesRepository"
import { ISpecificationsRepository } from "../../modules/cars/repositories/ISpecificationsRepository"
import { RentalsRepository } from "../../modules/rentals/infra/typeorm/repositories/RentalsRepository"
import { IRentalsRepository } from "../../modules/rentals/repositories/IRentalsRepository"
import { IUsersTokenRepository } from "../../modules/accounts/repositories/IUsersTokenRepository"
import { UsersTokenRepository } from "../../modules/accounts/infra/typeorm/repositories/UsersTokenRepository"

container.registerSingleton<IUsersRepository>(
  "UsersRepository",
  UsersRepository
)

container.registerSingleton<ICategoriesRepository>(
  "CategoriesRepository",
  CategoriesRepository
)

container.registerSingleton<ISpecificationsRepository>(
  "SpecificationsRepository",
  SpecificationsRepository
)

container.registerSingleton<ICarsRepository>(
  "CarsRepository",
  CarsRepository
)

container.registerSingleton<ICarsImageRepository>(
  "CarsImageRepository",
  CarsImagesRepository
)

container.registerSingleton<IRentalsRepository>(
  "RentalsRepository",
  RentalsRepository
)

container.registerSingleton<IUsersTokenRepository>(
  "UsersTokenRepository",
  UsersTokenRepository
)
