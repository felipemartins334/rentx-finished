import { Client } from 'basic-ftp'
import fs from 'fs'
import { IStorageProvider } from "../IStorageProvider";
import { resolve } from 'path'
import upload from '../../../../../config/upload';

class FTPStorageProvider implements IStorageProvider{

  async getConnection(): Promise<Client>{
    const client = new Client()
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      port: Number(process.env.FTP_PORT),
      secure: false
    })

    return client
  }


  async save(file: string, folder: string): Promise<string> {
    
    const client = await this.getConnection()

    await fs.promises.rename(
      resolve(upload.tmpFolder, file),
      resolve(`${upload.tmpFolder}/${folder}`, file)
    )
    
    await client.ensureDir(`${folder}`)
    await client.uploadFrom(`${upload.tmpFolder}/${folder}/${file}`, `${file}`)
    await fs.promises.unlink(resolve(`${upload.tmpFolder}/${folder}`, file))
    return file
  }

  async delete(file: string, folder: string): Promise<void> {
    
    const client = await this.getConnection()
    await client.remove(`${folder}/${file}`)
  }

}

export { FTPStorageProvider }