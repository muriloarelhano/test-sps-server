import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";

const client = postgres(process.env.DATABASE_URI);
export const db = drizzle(client, { schema });

export async function initAdminUser() {
	try {
		const existingAdmin = await db
			.select()
			.from(schema.usersTable)
			.where(eq(schema.usersTable.email, "admin@spsgroup.com.br"))
			.execute();

		if (existingAdmin.length === 0) {
			await db
				.insert(schema.usersTable)
				.values({
					name: "admin",
					email: "admin@spsgroup.com.br",
					type: "admin",
					password: "1234",
				})
				.execute();
			console.log("Admin user created successfully!");
		} else {
			console.log("Admin user already exists");
		}
	} catch (error) {
		console.error("Error initializing admin user:", error);
	}
}
