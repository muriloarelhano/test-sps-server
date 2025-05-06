import jwt from "jsonwebtoken";

const JWT_SECRET = "sps-secret-key";

export class AuthService {
	constructor(authRepository) {
		this.authRepository = authRepository;
	}

	async login(email, password) {
		const user = await this.authRepository.findUserByEmail(email);
		
		if (!user || user.password !== password) {
			throw new Error("Invalid credentials");
		}

		const token = jwt.sign(
			{
				userId: user.id,
				email: user.email,
				type: user.type,
			},
			JWT_SECRET,
			{ expiresIn: "1h" }
		);

		return {
			token,
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
				type: user.type,
			},
		};
	}
}

export { JWT_SECRET };