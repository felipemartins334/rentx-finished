import { hash } from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import request from 'supertest'
import { Connection } from 'typeorm'
import { app } from '../../../../shared/infra/http/app'
import createConnection from '../../../../shared/infra/typeorm/index'

let connection: Connection

describe("Create Category Controller", () => {

  beforeAll( async () => {
    connection = await createConnection()
    await connection.runMigrations()
    const id = uuidv4()
    const password = await hash("admin", 8)

    await connection.query(
      `INSERT INTO USERS
      (id, name, email, password, admin, created_at, driver_license)
      VALUES('${id}', 'admin', 'admin@rentx.com', '${password}', true, now(), 'CNH');`
    )

  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  it("should be able to create a new category", async () => {

    const responseToken = await request(app).post("/sessions")
      .send({
        email: "admin@rentx.com",
        password: "admin"
      })

      const { refresh_token } = responseToken.body

    const response = await request(app).post("/categories")
      .send({
        name: "Category Supertest",
        description: "Category Supertest"
       })
        .set({
          Authorization: `Bearer ${refresh_token}`
        })
    expect(response.status).toBe(201)
  })

  it("should not be able to create a new category with existing name", async () => {

    const responseToken = await request(app).post("/sessions")
      .send({
        email: "admin@rentx.com",
        password: "admin"
      })

    const { refresh_token } = responseToken.body

    const response = await request(app).post("/categories")
      .send({
        name: "Category Supertest",
        description: "Category Supertest"
       })
        .set({
          Authorization: `Bearer ${refresh_token}`
        })
    expect(response.status).toBe(400)
  })

})