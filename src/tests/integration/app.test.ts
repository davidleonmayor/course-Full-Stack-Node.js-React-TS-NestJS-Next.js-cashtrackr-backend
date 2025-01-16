import request from "supertest";
import { db, initializeDB } from "../../config/db";
import server from "../../server";
import { AuthController } from "../../controllers/AuthController";

describe("Database Connection Integration Test", () => {
  beforeAll(async () => {
    // Intentar inicializar la conexión a la base de datos
    await initializeDB();
  });

  // afterAll(async () => {
  //   // Cierra la conexión de Sequelize después de la prueba
  //   await db.close();
  // });

  it("should display validation errors when form is empty", async () => {
    const response = await request(server)
      .post("/api/auth/create-account")
      .send({});
    const createAccountMock = jest.spyOn(AuthController, "createAccount");
    // console.log(response.body);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(10);

    expect(response.status).not.toBe(201);
    expect(response.body.errors).not.toHaveLength(2);
    expect(createAccountMock).not.toHaveBeenCalled();
  });

  it("should return 400 status code when the email is invalid", async () => {
    const response = await request(server)
      .post("/api/auth/create-account")
      .send({
        name: "Juan",
        password: "ValidPassowrd1*.@",
        confirmPassword: "ValidPassowrd1*.@",
        email: "not_valid_email",
      });
    const createAccountMock = jest.spyOn(AuthController, "createAccount");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe("Must be a valid email address");

    expect(response.status).not.toBe(201);
    expect(response.body.errors).not.toHaveLength(2);
    expect(createAccountMock).not.toHaveBeenCalled();
  });

  // it("should connect to the database successfully", async () => {
  //   let isConnected = false;
  //   try {
  //     await db.authenticate(); // Método de Sequelize para verificar conexión
  //     isConnected = true;
  //   } catch (error) {
  //     isConnected = false;
  //   }
  //   expect(isConnected).toBe(true); // Asegura que esté conectado
  // });
});
