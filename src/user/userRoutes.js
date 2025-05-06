import { Router } from "express";
import { UserRepository } from "./userRepository.js";
import { ValidationError } from "./userSchemas.js";
import { UserService } from "./userService.js";

const userRoutes = Router();

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

userRoutes.get("/users", async (req, res) => {
	try {
		const users = await userService.getAllUsers();
		res.json(users);
	} catch (error) {
		console.error("Error fetching users:", error);
		res.status(500).json({ message: "Error fetching users" });
	}
});

userRoutes.get("/users/me", async (req, res) => {
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

userRoutes.get("/users/:id", async (req, res) => {
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

userRoutes.post("/users", async (req, res) => {
	try {
		try {
			const createdUser = await userService.createUser(req.body);
			res.status(201).json(createdUser);
		} catch (error) {
			if (error instanceof ValidationError) {
				return res.status(400).json({
					message: "Dados de usuário inválidos",
					errors: error.errors,
				});
			}
			if (error.message === "Email already registered") {
				return res.status(409).json({ message: "Email já cadastrado" });
			}
			throw error;
		}
	} catch (error) {
		console.error("Error creating user:", error);
		res.status(500).json({ message: "Erro ao criar usuário" });
	}
});

userRoutes.put("/users/:id", async (req, res, next) => {
	try {
		const { id } = req.params;
		const userId = Number.parseInt(id);

		if (Number.isNaN(userId)) {
			return res
				.status(400)
				.json({ message: "Formato de ID de usuário inválido" });
		}

		try {
			const updatedUser = await userService.updateUser(
				userId,
				req.body,
				req.auth.type,
			);
			res.json(updatedUser);
		} catch (error) {
			if (error instanceof ValidationError) {
				return res.status(400).json({
					message: "Dados de atualização inválidos",
					errors: error.errors,
				});
			}

			if (error.message === "User not found") {
				return res.status(404).json({ message: "Usuário não encontrado" });
			}

			if (error.message === "Email already registered") {
				return res.status(409).json({ message: "Email já cadastrado" });
			}

			next(error);
		}
	} catch (error) {
		console.error(`Error updating user with ID ${req.params.id}:`, error);
		res.status(500).json({ message: "Erro ao atualizar usuário" });
	}
});

userRoutes.delete("/users/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const userId = Number.parseInt(id);
		const currentUserId = req.auth.userId;

		if (Number.isNaN(userId)) {
			return res.status(400).json({ message: "Invalid user ID format" });
		}

		try {
			await userService.deleteUser(userId, currentUserId);
			res.status(204).send();
		} catch (error) {
			if (error.message === "User not found") {
				return res.status(404).json({ message: "User not found" });
			}
			if (error.message === "Cannot delete your own user account") {
				return res
					.status(403)
					.json({ message: "Você não pode deletar a sua própria conta" });
			}
			throw error;
		}
	} catch (error) {
		console.error(`Error deleting user with ID ${req.params.id}:`, error);
		res.status(500).json({ message: "Error deleting user" });
	}
});

export { userRoutes };
