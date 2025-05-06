import { ZodError } from "zod";
import {
	createUserSchema,
	updateUserSchema,
	ValidationError,
} from "./userSchemas.js";

export class UserService {
	constructor(userRepository) {
		this.userRepository = userRepository;
	}

	async getAllUsers() {
		return this.userRepository.findAll();
	}

	async getUserById(id) {
		const user = await this.userRepository.findById(id);
		if (!user) {
			throw new Error("User not found");
		}
		return user;
	}

	async createUser(userData) {
		try {
			// Validar dados de entrada usando Zod
			const validatedData = createUserSchema.parse(userData);

			const existingUser = await this.userRepository.findByEmail(
				validatedData.email,
			);
			if (existingUser) {
				throw new Error("Email already registered");
			}

			return this.userRepository.create(validatedData);
		} catch (error) {
			if (error.name === "ZodError") {
				throw ValidationError.fromZodError(error);
			}
			throw error;
		}
	}

	async updateUser(id, userData) {
		try {
			const validatedData = updateUserSchema.parse(userData);

			const existingUser = await this.userRepository.findById(id);
			if (!existingUser) {
				throw new Error("User not found");
			}

			if (validatedData.email && validatedData.email !== existingUser.email) {
				const emailExists = await this.userRepository.findByEmail(
					validatedData.email,
				);
				if (emailExists) {
					throw new Error("Email already registered");
				}
			}

			return this.userRepository.update(id, validatedData);
		} catch (error) {
			if (error instanceof ZodError) {
				throw ValidationError.fromZodError(error);
			}
			throw error;
		}
	}

	async deleteUser(id) {
		const existingUser = await this.userRepository.findById(id);
		if (!existingUser) {
			throw new Error("User not found");
		}

		await this.userRepository.delete(id);
		return true;
	}
}
