import { Client } from 'basic-ftp'
import fs from 'fs'
import { IStorageProvider } from "../IStorageProvider";
import { resolve } from 'path'
import upload from '../../../../../config/upload';

class FTPStorageProvider implements IStorageProvider{

  async getConnection(): Promise<Client>{
    const client = new Client()
    await client.access({
      host: "192.168.1.4",
      user: "admin",
      password: "12345",
      port: 2121,
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