import cors from "cors";
import express from "express";
import { initAdminUser } from "../database/index.js";
import { handleAuthErrors } from "./auth/middleware.js";
import { authRoutes } from "./auth/routes.js";
import { userRoutes } from "./user/routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use(authRoutes);
app.use(userRoutes);

app.use(handleAuthErrors);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
	console.log(`Server is running on http://localhost:${PORT}`);

	await initAdminUser();
});
