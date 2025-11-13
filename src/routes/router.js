const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", (_req, res) => res.json({ ok: true }));

router.post("/register", (req, res) => userController.register(req, res));
router.post("/validate", (req, res) => userController.validate(req, res));

module.exports = router;
