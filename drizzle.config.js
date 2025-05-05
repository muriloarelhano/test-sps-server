import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./database/migrations",
	schema: "./database/schema.js",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URI,
	},
});
