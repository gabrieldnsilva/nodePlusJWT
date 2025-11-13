require("dotenv").config();
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Rota de saúde
app.get("/health", (_req, res) => {
	res.json({ status: "UP" });
});

// Importar e usar as rotas de usuários
const userRoutes = require("./routes/router.js");
app.use("/api/usuarios", userRoutes);

// Exporta app sem iniciar servidor (para testes)
if (require.main === module) {
	app.listen(PORT, () => {
		console.log(`Servidor rodando na porta http://localhost:${PORT}`);
	});
}

module.exports = app;
