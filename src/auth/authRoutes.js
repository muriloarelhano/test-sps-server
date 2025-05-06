import { Router } from "express";
import { AuthRepository } from "./authRepository.js";
import { AuthService } from "./authService.js";

const authRoutes = Router();

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);

authRoutes.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res
				.status(400)
				.json({ message: "Email and password are required" });
		}

		const result = await authService.login(email, password);
		res.status(200).json(result);
	} catch (error) {
		console.error("Login error:", error);

		if (error.message === "Invalid credentials") {
			return res.status(401).json({ message: "Invalid credentials" });
		}
		res.status(500).json({ message: "Server error during authentication" });
	}
});

export { authRoutes };
