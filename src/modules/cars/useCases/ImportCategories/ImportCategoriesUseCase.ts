import { inject, injectable } from "tsyringe";
import { ICategoriesRepository } from "../../repositories/ICategoriesRepository";
import readFile from "../../../../utils/readFile";
import { deleteFile } from "../../../../utils/deleteFile";

interface IReadData {
  value0: string
  value1: string
}

@injectable()
class ImportCategoriesUseCase {

  constructor(
    @inject("CategoriesRepository")
    private categoriesRepository: ICategoriesRepository) { }


  async execute(file: Express.Multer.File): Promise<void> {
    const categories = await readFile.readFile<IReadData>(file.path, "-")
    categories.forEach(async category => {
      const categoryAlreadyExists = await this.categoriesRepository.findByName(
        category.value0
      )
      if (!categoryAlreadyExists) {
        await this.categoriesRepository.create({
          name: category.value0,
          description: category.value1
        })
      }
    })
    await deleteFile(file.path)
  }
}

export { ImportCategoriesUseCase }