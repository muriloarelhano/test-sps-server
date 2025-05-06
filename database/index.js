import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";
import { usersTable } from "./schema.js";

const dbClient = postgres(process.env.DATABASE_URI);
export const db = drizzle(dbClient, { schema });

export async function initAdminUser() {
	try {
		const existingAdmin = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.email, "admin@spsgroup.com.br"))
			.execute();

		if (existingAdmin.length === 0) {
			await db
				.insert(usersTable)
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

export * from "./schema.js";
