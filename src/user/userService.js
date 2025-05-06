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
		const existingUser = await this.userRepository.findByEmail(userData.email);
		if (existingUser) {
			throw new Error("Email already registered");
		}
		return this.userRepository.create(userData);
	}

	async updateUser(id, userData) {
		const existingUser = await this.userRepository.findById(id);
		if (!existingUser) {
			throw new Error("User not found");
		}

		if (userData.email && userData.email !== existingUser.email) {
			const emailExists = await this.userRepository.findByEmail(userData.email);
			if (emailExists) {
				throw new Error("Email already registered");
			}
		}

		return this.userRepository.update(id, userData);
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