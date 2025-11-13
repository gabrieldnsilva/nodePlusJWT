const { getConnectionDB } = require("../config/database");
const User = require("../models/User");

class UserRepository {
	constructor() {
		User.initTable();
		this.db = getConnectionDB(); // Singleton da conexão com o banco de dados
	}

	create({ email, password }) {
		return new Promise((resolve, reject) => {
			// defesa: só aceitar bcrypt ($2...)
			if (typeof password !== "string" || !password.startsWith("$2")) {
				return reject(
					new Error(
						"UserRepository.create: password deve ser hash bcrypt (iniciando com $2)."
					)
				);
			}
			const querySQL = `INSERT INTO users (email, password) VALUES (?, ?)`;
			this.db.run(querySQL, [email, password], function (err) {
				if (err) return reject(err);
				resolve({ id: this.lastID, email, password });
			});
		});
	}

	findByEmail(email) {
		return new Promise((resolve, reject) => {
			const querySQL = `SELECT * FROM users WHERE email = ?`;
			this.db.get(querySQL, [email], (err, row) => {
				if (err) return reject(err);
				resolve(row ? new User(row) : null);
			});
		});
	}
}

module.exports = new UserRepository();
