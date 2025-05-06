import { Router } from "express";
import { authenticateJwt } from "../auth/middleware.js";
import { UserRepository } from "./userRepository.js";
import { UserService } from "./userService.js";

const userRoutes = Router();

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

userRoutes.get("/users", authenticateJwt, async (req, res) => {
	try {
		const users = await userService.getAllUsers();
		res.json(users);
	} catch (error) {
		console.error("Error fetching users:", error);
		res.status(500).json({ message: "Error fetching users" });
	}
});

userRoutes.get("/users/me", authenticateJwt, async (req, res) => {
	try {
		const userId = req.auth.userId;

		if (!userId) {
			return res.status(400).json({ message: "User ID not found in token" });
		}

		try {
			const user = await userService.getUserById(userId);
			res.json(user);
		} catch (error) {
			if (error.message === "User not found") {
				return res.status(404).json({ message: "User not found" });
			}
			throw error;
		}
	} catch (error) {
		console.error("Error fetching current user:", error);
		res.status(500).json({ message: "Error fetching user data" });
	}
});

userRoutes.get("/users/:id", authenticateJwt, async (req, res) => {
	try {
		const { id } = req.params;
		const userId = Number.parseInt(id);

		if (Number.isNaN(userId)) {
			return res.status(400).json({ message: "Invalid user ID format" });
		}

		try {
			const user = await userService.getUserById(userId);
			res.json(user);
		} catch (error) {
			if (error.message === "User not found") {
				return res.status(404).json({ message: "User not found" });
			}
			throw error;
		}
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

		try {
			const createdUser = await userService.createUser({
				name,
				email,
				type,
				password,
			});
			res.status(201).json(createdUser);
		} catch (error) {
			if (error.message === "Email already registered") {
				return res.status(409).json({ message: "Email already registered" });
			}
			throw error;
		}
	} catch (error) {
		console.error("Error creating user:", error);
		res.status(500).json({ message: "Error creating user" });
	}
});

userRoutes.put("/users/:id", authenticateJwt, async (req, res) => {
	try {
		const { id } = req.params;
		const userId = Number.parseInt(id);
		const { name, email, type, password } = req.body;

		if (Number.isNaN(userId)) {
			return res.status(400).json({ message: "Invalid user ID format" });
		}

		const updateData = {};
		if (name) updateData.name = name;
		if (email) updateData.email = email;
		if (type) updateData.type = type;
		if (password) updateData.password = password;

		try {
			const updatedUser = await userService.updateUser(userId, updateData);
			res.json(updatedUser);
		} catch (error) {
			if (error.message === "User not found") {
				return res.status(404).json({ message: "User not found" });
			}
			if (error.message === "Email already registered") {
				return res.status(409).json({ message: "Email already registered" });
			}
			throw error;
		}
	} catch (error) {
		console.error(`Error updating user with ID ${req.params.id}:`, error);
		res.status(500).json({ message: "Error updating user" });
	}
});

userRoutes.delete("/users/:id", authenticateJwt, async (req, res) => {
	try {
		const { id } = req.params;
		const userId = Number.parseInt(id);

		if (Number.isNaN(userId)) {
			return res.status(400).json({ message: "Invalid user ID format" });
		}

		try {
			await userService.deleteUser(userId);
			res.status(204).send();
		} catch (error) {
			if (error.message === "User not found") {
				return res.status(404).json({ message: "User not found" });
			}
			throw error;
		}
	} catch (error) {
		console.error(`Error deleting user with ID ${req.params.id}:`, error);
		res.status(500).json({ message: "Error deleting user" });
	}
});

export { userRoutes };
