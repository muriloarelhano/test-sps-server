import { eq } from "drizzle-orm";
import { Router } from "express";
import { db } from "../../database/index.js";
import { usersTable } from "../../database/schema.js";
import { authenticateJwt } from "../auth/middleware.js";

const userRoutes = Router();

userRoutes.get("/users", authenticateJwt, async (req, res) => {
	try {
		const users = await db
			.select({
				id: usersTable.id,
				name: usersTable.name,
				email: usersTable.email,
				type: usersTable.type,
			})
			.from(usersTable)
			.execute();

		res.json(users);
	} catch (error) {
		console.error("Error fetching users:", error);
		res.status(500).json({ message: "Error fetching users" });
	}
});

userRoutes.get("/users/:id", authenticateJwt, async (req, res) => {
	try {
		const { id } = req.params;

		const users = await db
			.select({
				id: usersTable.id,
				name: usersTable.name,
				email: usersTable.email,
				type: usersTable.type,
			})
			.from(usersTable)
			.where(eq(usersTable.id, Number.parseInt(id)))
			.execute();

		if (users.length === 0) {
			return res.status(404).json({ message: "User not found" });
		}

		res.json(users[0]);
	} catch (error) {
		console.error(`Error fetching user with ID ${req.params.id}:`, error);
		res.status(500).json({ message: "Error fetching user" });
	}
});

userRoutes.post("/users", authenticateJwt, async (req, res) => {
	try {
		const { name, email, type, password } = req.body;

		if (!name || !email || !type || !password) {
			return res.status(400).json({
				message: "All fields are required: name, email, type, password",
			});
		}

		const existingUser = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.email, email))
			.execute();

		if (existingUser.length > 0) {
			return res.status(409).json({ message: "Email already registered" });
		}

		const result = await db
			.insert(usersTable)
			.values({ name, email, type, password })
			.returning({
				id: usersTable.id,
				name: usersTable.name,
				email: usersTable.email,
				type: usersTable.type,
			})
			.execute();

		res.status(201).json(result[0]);
	} catch (error) {
		console.error("Error creating user:", error);
		res.status(500).json({ message: "Error creating user" });
	}
});

userRoutes.put("/users/:id", authenticateJwt, async (req, res) => {
	try {
		const { id } = req.params;
		const { name, email, type, password } = req.body;

		const existingUser = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.id, Number.parseInt(id)))
			.execute();

		if (existingUser.length === 0) {
			return res.status(404).json({ message: "User not found" });
		}

		const updateData = {};

		if (name) updateData.name = name;
		if (email) updateData.email = email;
		if (type) updateData.type = type;
		if (password) updateData.password = password;

		if (email && email !== existingUser[0].email) {
			const emailExists = await db
				.select()
				.from(usersTable)
				.where(eq(usersTable.email, email))
				.execute();

			if (emailExists.length > 0) {
				return res.status(409).json({ message: "Email already registered" });
			}
		}

		const result = await db
			.update(usersTable)
			.set(updateData)
			.where(eq(usersTable.id, Number.parseInt(id)))
			.returning({
				id: usersTable.id,
				name: usersTable.name,
				email: usersTable.email,
				type: usersTable.type,
			})
			.execute();

		res.json(result[0]);
	} catch (error) {
		console.error(`Error updating user with ID ${req.params.id}:`, error);
		res.status(500).json({ message: "Error updating user" });
	}
});

userRoutes.delete("/users/:id", authenticateJwt, async (req, res) => {
	try {
		const { id } = req.params;

		const existingUser = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.id, Number.parseInt(id)))
			.execute();

		if (existingUser.length === 0) {
			return res.status(404).json({ message: "User not found" });
		}

		await db
			.delete(usersTable)
			.where(eq(usersTable.id, Number.parseInt(id)))
			.execute();

		res.status(204).send();
	} catch (error) {
		console.error(`Error deleting user with ID ${req.params.id}:`, error);
		res.status(500).json({ message: "Error deleting user" });
	}
});

export { userRoutes };
