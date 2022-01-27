import { AppError } from "../../../../shared/errors/AppError"
import { ICreateUserDTO } from "../../dtos/ICreateUserDTO"
import { UsersRepositoryInMemory } from "../../repositories/in-memory/UsersRepositoryInMemory"
import { IUsersRepository } from "../../repositories/IUsersRepository"
import { CreateUserUseCase } from "./CreateUserUseCase"

let createUserUseCase: CreateUserUseCase
let usersRepositoryInMemory: IUsersRepository

describe("Create a new user", () => {
  
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory()
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
  })

  it("should be able to create a new user", async () => {
    
    const user: ICreateUserDTO = { 
      name: "Tester",
      password: "123",
      driver_license: "CNH",
      email: "tester@tester.com"
    }
  
    await createUserUseCase.execute(user)

    const userCreated = await usersRepositoryInMemory.findByEmail(user.email)

    expect(userCreated).toHaveProperty("id")
  })

  it("should not be able to create a new user with email already existing",
  async () => {
     
  expect( async () => {
    
    const user: ICreateUserDTO = { 
      name: "Tester",
      password: "123",
      driver_license: "CNH",
      email: "tester@tester.com"
    }
  
    await createUserUseCase.execute(user)

    await createUserUseCase.execute(user)

    }).rejects.toBeInstanceOf(AppError)
  })
})