const path = require("path");
const sqlite3 = require("sqlite3").verbose();

let dbInstance = null;

function getConnectionDB() {
	if (dbInstance) return dbInstance;

	// Usa DB de teste se NODE_ENV=test
	const dbName =
		process.env.NODE_ENV === "test" ? "test.sqlite" : "database.sqlite";
	const dbPath = path.resolve(__dirname, `../db/${dbName}`);

	dbInstance = new sqlite3.Database(dbPath, (err) => {
		if (err) console.error("Erro ao conectar ao SQLite:", err.message);
		else if (process.env.NODE_ENV !== "test") {
			console.log("[SQLite] Conectado em:", dbPath);
		}
	});

	return dbInstance;
}

function resetConnection() {
	if (dbInstance) {
		dbInstance.close();
		dbInstance = null;
	}
}

module.exports = { getConnectionDB, resetConnection };
