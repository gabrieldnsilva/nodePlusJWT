const jwtService = require("../../services/jwtService");

describe("JWT Service", () => {
	beforeAll(() => {
		process.env.JWT_SECRET = "test_jwt_secret";
	});

	describe("create", () => {
		it("deve criar token JWT válido", () => {
			const payload = { id: 1, email: "test@jest.com" };
			const token = jwtService.create(payload);

			expect(token).toBeDefined();
			expect(typeof token).toBe("string");
			expect(token.split(".")).toHaveLength(3);
		});

		it("deve incluir payload no token", () => {
			const payload = { id: 42, email: "user@test.com" };
			const token = jwtService.create(payload);
			const decoded = jwtService.verify(token);

			expect(decoded.id).toBe(42);
			expect(decoded.email).toBe("user@test.com");
		});
	});

	describe("verify", () => {
		it("deve verificar token válido", () => {
			const payload = { id: 1, email: "valid@jwt.com" };
			const token = jwtService.create(payload);
			const decoded = jwtService.verify(token);

			expect(decoded).toBeDefined();
			expect(decoded.id).toBe(1);
		});

		it("deve retornar null para token inválido", () => {
			const decoded = jwtService.verify("token.invalido.fake");
			expect(decoded).toBeNull();
		});

		it("deve retornar null para token expirado", () => {
			const payload = { id: 1 };
			const token = jwtService.create(payload, { expiresIn: "0s" });

			// Aguarda 1ms para garantir expiração
			return new Promise((resolve) => setTimeout(resolve, 10)).then(
				() => {
					const decoded = jwtService.verify(token);
					expect(decoded).toBeNull();
				}
			);
		});
	});
});
