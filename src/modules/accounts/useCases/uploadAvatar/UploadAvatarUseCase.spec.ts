import { AppError } from "../../../../shared/errors/AppError"
import { ICreateUserDTO } from "../../dtos/ICreateUserDTO"
import { UsersRepositoryInMemory } from "../../repositories/in-memory/UsersRepositoryInMemory"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { UploadAvatarUseCase } from "./UploadAvatarUseCase"

let usersRepositoryInMemory: UsersRepositoryInMemory
let uploadAvatarUseCase: UploadAvatarUseCase
let createUserUseCase: CreateUserUseCase

describe("Upload an avatar", () => {
  
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory()
    uploadAvatarUseCase = new UploadAvatarUseCase(usersRepositoryInMemory)
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
  })

  it("should be able to update an avatar", async () => {
      const user: ICreateUserDTO={
        driver_license: "123",
        email:"teste@teste",
        name:"Tester",
        password: "teste"
      }
      
      await createUserUseCase.execute(user)
      const userCreated = await usersRepositoryInMemory.findByEmail("teste@teste")
      const file_name = "123.jpg"
      const user_id = userCreated.id

      await uploadAvatarUseCase.execute({ user_id, file_name})
      
      expect(userCreated.avatar).toBe(file_name)
    })

  it("should not be able to update an avatar with nonexisting user", async () => {
    expect(async () => {
      await uploadAvatarUseCase.execute({
        user_id: "123",
        file_name: "avatar.jpg"
      })
    }).rejects.toBeInstanceOf(AppError)
      
    })
    
  })