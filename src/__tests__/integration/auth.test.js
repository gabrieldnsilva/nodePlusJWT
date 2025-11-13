const request = require("supertest");
const app = require("../../app");
const { resetConnection } = require("../../config/database");
const fs = require("fs");
const path = require("path");

describe("Auth Integration Tests", () => {
	const testDbPath = path.resolve(__dirname, "../../db/test/test.sqlite");
	const testDbDir = path.dirname(testDbPath);

	beforeAll(() => {
		process.env.NODE_ENV = "test";
		process.env.JWT_SECRET = "test_secret_key_for_jest";

		// Garante que o diretório existe
		if (!fs.existsSync(testDbDir)) {
			fs.mkdirSync(testDbDir, { recursive: true });
		}

		// Limpa DB de teste se existir
		if (fs.existsSync(testDbPath)) {
			fs.unlinkSync(testDbPath);
		}
	});

	afterAll(() => {
		resetConnection();
		// Limpa DB após testes
		if (fs.existsSync(testDbPath)) {
			fs.unlinkSync(testDbPath);
		}
	});

	describe("POST /api/usuarios/register", () => {
		it("deve registrar um novo usuário com sucesso", async () => {
			const res = await request(app).post("/api/usuarios/register").send({
				email: "teste@jest.com",
				password: "123456",
			});

			expect(res.status).toBe(201);
			expect(res.body).toHaveProperty("id");
			expect(res.body.email).toBe("teste@jest.com");
			expect(res.body).not.toHaveProperty("password");
		});

		it("deve retornar 409 para email duplicado", async () => {
			await request(app).post("/api/usuarios/register").send({
				email: "duplicado@jest.com",
				password: "123456",
			});

			const res = await request(app).post("/api/usuarios/register").send({
				email: "duplicado@jest.com",
				password: "654321",
			});

			expect(res.status).toBe(409);
			expect(res.body.message).toContain("já cadastrado");
		});

		it("deve retornar 400 para email inválido", async () => {
			const res = await request(app).post("/api/usuarios/register").send({
				email: "email-invalido",
				password: "123456",
			});

			expect(res.status).toBe(400);
			expect(res.body.message).toContain("Email inválido");
		});

		it("deve retornar 400 para senha curta", async () => {
			const res = await request(app).post("/api/usuarios/register").send({
				email: "curta@jest.com",
				password: "123",
			});

			expect(res.status).toBe(400);
			expect(res.body.message).toContain("6 caracteres");
		});
	});

	describe("POST /api/usuarios/validate", () => {
		beforeAll(async () => {
			await request(app).post("/api/usuarios/register").send({
				email: "login@jest.com",
				password: "senha123",
			});
		});

		it("deve fazer login e retornar JWT válido", async () => {
			const res = await request(app).post("/api/usuarios/validate").send({
				email: "login@jest.com",
				password: "senha123",
			});

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty("token");
			expect(typeof res.body.token).toBe("string");
			expect(res.body.token.split(".")).toHaveLength(3); // JWT tem 3 partes
		});

		it("deve retornar 401 para senha incorreta", async () => {
			const res = await request(app).post("/api/usuarios/validate").send({
				email: "login@jest.com",
				password: "senhaErrada",
			});

			expect(res.status).toBe(401);
			expect(res.body.message).toContain("Credenciais inválidas");
		});

		it("deve retornar 401 para email não cadastrado", async () => {
			const res = await request(app).post("/api/usuarios/validate").send({
				email: "naoexiste@jest.com",
				password: "123456",
			});

			expect(res.status).toBe(401);
		});

		it("deve retornar 400 sem email ou senha", async () => {
			const res = await request(app)
				.post("/api/usuarios/validate")
				.send({ email: "teste@jest.com" });

			expect(res.status).toBe(400);
		});
	});

	describe("GET /health", () => {
		it("deve retornar status UP", async () => {
			const res = await request(app).get("/health");
			expect(res.status).toBe(200);
			expect(res.body.status).toBe("UP");
		});
	});
});
