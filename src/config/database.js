const path = require("path");
const sqlite3 = require("sqlite3").verbose();

let dbInstance = null;

function getConnectionDB() {
	if (dbInstance) return dbInstance;

	const dbPath = path.resolve(__dirname, "../db/database.sqlite");
	dbInstance = new sqlite3.Database(dbPath, (err) => {
		if (err) console.error("Erro ao conectar ao SQLite:", err.message);
		else console.log("[SQLite] Conectado em:", dbPath);
	});

	return dbInstance;
}

module.exports = { getConnectionDB };
