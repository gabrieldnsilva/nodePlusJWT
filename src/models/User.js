const { getConnectionDB } = require("../config/database");

class User {
	constructor(props) {
		this.id = props.id;
		this.email = props.email;
		this.password = props.password; // Senha deve ser armazenada como hash
		this.createdAt = props.createdAt;
	}

	static initTable() {
		const db = getConnectionDB();
		const querySQL = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
		db.run(querySQL);
	}
}

module.exports = User;
