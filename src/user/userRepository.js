import { eq } from "drizzle-orm";
import { db, usersTable } from "../../database/index.js";

export class UserRepository {
	async findAll() {
		return await db
			.select({
				id: usersTable.id,
				name: usersTable.name,
				email: usersTable.email,
				type: usersTable.type,
			})
			.from(usersTable);
	}

	async findById(id) {
		const users = await db
			.select({
				id: usersTable.id,
				name: usersTable.name,
				email: usersTable.email,
				type: usersTable.type,
			})
			.from(usersTable)
			.where(eq(usersTable.id, id));

		return users.length > 0 ? users[0] : null;
	}

	async findByEmail(email) {
		const users = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.email, email));

		return users.length > 0 ? users[0] : null;
	}

	async create(userData) {
		const result = await db.insert(usersTable).values(userData).returning({
			id: usersTable.id,
			name: usersTable.name,
			email: usersTable.email,
			type: usersTable.type,
		});

		return result[0];
	}

	async update(id, userData) {
		const result = await db
			.update(usersTable)
			.set(userData)
			.where(eq(usersTable.id, id))
			.returning({
				id: usersTable.id,
				name: usersTable.name,
				email: usersTable.email,
				type: usersTable.type,
			});

		return result.length > 0 ? result[0] : null;
	}

	async delete(id) {
		return await db.delete(usersTable).where(eq(usersTable.id, id));
	}
}
