import { Request, Response } from "express";
import { container } from "tsyringe";
import { UploadAvatarUseCase } from "./UploadAvatarUseCase";

class UploadAvatarController{
  
  async handle(request: Request, response: Response): Promise<Response>{
    const filename = request.file.filename
    const { id } = request.user
    const uploadAvatarUseCase = container.resolve(UploadAvatarUseCase)
    await uploadAvatarUseCase.execute({user_id: id, file_name: filename})
    
    return response.status(204).send()
  }
}

export { UploadAvatarController }