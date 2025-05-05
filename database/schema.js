import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	email: varchar().notNull().unique(),
	name: varchar().notNull(),
	type: varchar().notNull(),
	password: text().notNull(),
});
