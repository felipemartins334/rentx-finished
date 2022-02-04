import { createConnection } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'
import { hash } from 'bcrypt'

async function create(){
  const connection = await createConnection()
  const id = uuidv4()
  const password = await hash("admin", 8)
  await connection.query(
    `INSERT INTO USERS(id, name, email, password, admin, created_at, driver_license)
    VALUES('${id}', 'admin', 'admin@rentx.com', '${password}', true, now(), 'CNH');`
  )
  await connection.close()
}

create().then(() => console.log("User admin created"))