import { eq } from "drizzle-orm";
import { db, usersTable } from "../../database/index.js";

export class AuthRepository {
	async findUserByEmail(email) {
		const users = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.email, email));

		return users.length > 0 ? users[0] : null;
	}
}
