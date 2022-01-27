import { AppError } from "../../../../shared/errors/AppError"
import { UsersRepositoryInMemory } from "../../repositories/in-memory/UsersRepositoryInMemory"
import { IUsersRepository } from "../../repositories/IUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"

let authenticateUserCase: AuthenticateUserUseCase
let createUserUseCase: CreateUserUseCase
let usersRepository: IUsersRepository

describe("Authenticate a user", () => {
  
  beforeEach(() => {  
    usersRepository = new UsersRepositoryInMemory()
    authenticateUserCase = new AuthenticateUserUseCase(usersRepository)
    createUserUseCase = new CreateUserUseCase(usersRepository)
  })
  
  it("should be able to authenticate an user", async () => {

    await createUserUseCase.execute({
      driver_license: "test",
      email:"tester@test.com",
      password:"mypassword",
      name:"Tester"
    })

    let token = await authenticateUserCase.execute({
      email: "tester@test.com",
      password: "mypassword"
    })
    expect(token).toHaveProperty("token")
  })

  it("should not be able to authenticate an nonexisting user", async () => {
    expect(async () => {
      await authenticateUserCase.execute({
        email: "tester@",
        password: "test"
      })
    }).rejects.toBeInstanceOf(AppError)
  })

  it("should not be able to authenticate a user with wrong password", 
    async () => {
      
      expect( async () => {
        await createUserUseCase.execute({
          driver_license: "test",
          email:"tester@test.com",
          password:"mypassword",
          name:"Tester"
        })
        await authenticateUserCase.execute({
          email: "tester@test.com",
          password: "wrongpassword"
        })
      }).rejects.toBeInstanceOf(AppError)
  })

})