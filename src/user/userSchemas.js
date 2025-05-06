import { z } from "zod";

export const createUserSchema = z.object({
	email: z
		.string({
			required_error: "Email é obrigatório",
			invalid_type_error: "Email deve ser uma string",
		})
		.email({
			message: "Email em formato inválido",
		}),
	name: z
		.string({
			required_error: "Nome é obrigatório",
			invalid_type_error: "Nome deve ser uma string",
		})
		.min(2, {
			message: "Nome precisa ter pelo menos 2 caracteres",
		}),
	type: z
		.string({
			required_error: "Tipo de usuário é obrigatório",
			invalid_type_error: "Tipo deve ser uma string",
		})
		.refine((val) => ["admin", "user"].includes(val), {
			message: "Tipo de usuário deve ser 'admin', 'user'",
		}),
	password: z.string({
		required_error: "Senha é obrigatória",
		invalid_type_error: "Senha deve ser uma string",
	}),
});

export const updateUserSchema = z
	.object({
		email: z
			.string({
				invalid_type_error: "Email deve ser uma string",
			})
			.email({
				message: "Email em formato inválido",
			})
			.optional(),
		name: z
			.string({
				invalid_type_error: "Nome deve ser uma string",
			})
			.min(2, {
				message: "Nome precisa ter pelo menos 2 caracteres",
			})
			.optional(),
		type: z
			.string({
				invalid_type_error: "Tipo deve ser uma string",
			})
			.refine((val) => ["admin", "user"].includes(val), {
				message: "Tipo de usuário deve ser 'admin', 'user'",
			})
			.optional(),
		password: z
			.string({
				invalid_type_error: "Senha deve ser uma string",
			})
			.optional(),
	})
	.refine((data) => Object.keys(data).length > 0, {
		message: "Pelo menos um campo deve ser fornecido para atualização",
	});

export class ValidationError extends Error {
	constructor(errors) {
		super("Erro de validação");
		this.name = "ValidationError";
		this.errors = errors;
		this.status = 400;
	}

	static fromZodError(zodError) {
		const formattedErrors = zodError.errors.map((err) => ({
			field: err.path.join("."),
			message: err.message,
		}));

		return new ValidationError(formattedErrors);
	}
}
