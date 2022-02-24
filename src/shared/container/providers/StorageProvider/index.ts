import { container } from "tsyringe"
import { FTPStorageProvider } from "./implementations/FTPStorageProvider"
import { LocalStorageProvider } from "./implementations/LocalStorageProvider"
import { S3StorageProvider } from "./implementations/S3StorageProvider"
import { IStorageProvider } from "./IStorageProvider"

const diskStorage = {
  local: LocalStorageProvider,
  s3: S3StorageProvider,
  ftp: FTPStorageProvider
}

container.registerSingleton<IStorageProvider>(
  "StorageProvider",
  diskStorage[process.env.disk]
)