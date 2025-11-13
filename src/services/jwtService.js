const jwt = require("jsonwebtoken");
require("dotenv").config();

class JwtService {
	create(payload, options = { expiresIn: "1h" }) {
		return jwt.sign(payload, process.env.JWT_SECRET, options);
	}
	verify(token) {
		try {
			return jwt.verify(token, process.env.JWT_SECRET);
		} catch {
			return null;
		}
	}
}

module.exports = new JwtService();
