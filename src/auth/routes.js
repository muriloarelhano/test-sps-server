import { eq } from "drizzle-orm";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { db } from "../../database/index.js";
import { usersTable } from "../../database/schema.js";

const authRoutes = Router();
const JWT_SECRET = "sps-secret-key";

authRoutes.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res
				.status(400)
				.json({ message: "Email and password are required" });
		}

		const users = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.email, email))
			.execute();

		const user = users[0];

		if (!user || user.password !== password) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const token = jwt.sign(
			{
				userId: user.id,
				email: user.email,
				type: user.type,
			},
			JWT_SECRET,
			{ expiresIn: "1h" },
		);

		res.status(200).json({
			token,
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
				type: user.type,
			},
		});
	} catch (error) {
		console.error("Login error:", error);
		res.status(500).json({ message: "Server error during authentication" });
	}
});

export { authRoutes, JWT_SECRET };
