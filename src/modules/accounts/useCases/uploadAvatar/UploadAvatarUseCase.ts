import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { IUploadAvatarDTO } from "../../dtos/IUploadAvatarDTO";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { deleteFile } from "../../../../utils/deleteFile";

@injectable()
class UploadAvatarUseCase{
  
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository){}
  
  async execute({ user_id , file_name}: IUploadAvatarDTO): Promise<void>{
    const user = await this.usersRepository.findById(user_id)
    if(!user){
      throw new AppError("User doesn't exist")
    }
    if(user.avatar){
      await deleteFile(`./tmp/avatar/${user.avatar}`)
    }
    user.avatar = file_name

    await this.usersRepository.create(user)
  }
}

export { UploadAvatarUseCase }