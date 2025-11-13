const userRepository = require("../repositories/UserRepository");
const jwtService = require("../services/jwtService");
const { hash, verify } = require("../utils/password");

class UserController {
	async register(req, res) {
		try {
			const { email, password } = req.body;
			if (!email || !password) {
				return res
					.status(400)
					.json({ message: "Email e senha são obrigatórios." });
			}
			// REGEX simples para validar email
			if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
				return res.status(400).json({ message: "Email inválido." });
			}
			if (password.length < 6) {
				return res.status(400).json({
					message: "A senha deve ter pelo menos 6 caracteres.",
				});
			}

			const alreadyExists = await userRepository.findByEmail(email);
			if (alreadyExists) {
				return res
					.status(409)
					.json({ message: "Email já cadastrado." });
			}

			const hashedPassword = await hash(password);
			const newUser = await userRepository.create({
				email,
				password,
				hashedPassword,
			});

			return res
				.status(201)
				.json({ id: newUser.id, email: newUser.email });
		} catch (err) {
			return res.status(500).json({
				message: "Erro ao registrar usuário.",
				error: err.message,
			});
		}
	}

	async validate(req, res) {
		try {
			const { email, password } = req.body;
			if (!email || !password) {
				return res
					.status(400)
					.json({ message: "Email e senha são obrigatórios." });
			}

			const user = await userRepository.findByEmail(email);
			if (!user) {
				return res
					.status(401)
					.json({ message: "Credenciais inválidas." });
			}

			const validPassword = await verify(password, user.password);
			if (!validPassword) {
				return res
					.status(401)
					.json({ message: "Credenciais inválidas." });
			}

			const token = jwtService.create({ id: user.id, email: user.email });
			return res.status(200).json({ token });
		} catch (err) {
			return res.status(500).json({
				message: "Erro ao validar usuário.",
				error: err.message,
			});
		}
	}
}

module.exports = new UserController();
