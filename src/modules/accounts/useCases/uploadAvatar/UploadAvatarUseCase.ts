import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { IUploadAvatarDTO } from "../../dtos/IUploadAvatarDTO";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { IStorageProvider } from "../../../../shared/container/providers/StorageProvider/IStorageProvider";

@injectable()
class UploadAvatarUseCase{
  
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("StorageProvider")
    private storageProvider: IStorageProvider
    ){}
  
  async execute({ user_id , file_name}: IUploadAvatarDTO): Promise<void>{
    const user = await this.usersRepository.findById(user_id)
    if(!user){
      throw new AppError("User doesn't exist")
    }

    
    if(user.avatar){
      await this.storageProvider.delete(user.avatar, "avatar")
    }

    await this.storageProvider.save(file_name, "avatar")

    user.avatar = file_name

    await this.usersRepository.create(user)
  }
}

export { UploadAvatarUseCase }