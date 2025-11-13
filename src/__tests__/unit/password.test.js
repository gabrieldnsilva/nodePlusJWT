const { hash, verify } = require("../../utils/password");

describe("Password Utils", () => {
	describe("hash", () => {
		it("deve gerar hash bcrypt válido", async () => {
			const password = "minhaSenha123";
			const hashed = await hash(password);

			expect(hashed).toBeDefined();
			expect(typeof hashed).toBe("string");
			expect(hashed.startsWith("$2")).toBe(true);
			expect(hashed.length).toBe(60);
		});

		it("deve gerar hashes diferentes para mesma senha", async () => {
			const password = "senha";
			const hash1 = await hash(password);
			const hash2 = await hash(password);

			expect(hash1).not.toBe(hash2); // salt aleatório
		});
	});

	describe("verify", () => {
		it("deve validar senha correta", async () => {
			const password = "senhaSecreta";
			const hashed = await hash(password);
			const isValid = await verify(password, hashed);

			expect(isValid).toBe(true);
		});

		it("deve rejeitar senha incorreta", async () => {
			const password = "senhaCorreta";
			const hashed = await hash(password);
			const isValid = await verify("senhaErrada", hashed);

			expect(isValid).toBe(false);
		});
	});
});
