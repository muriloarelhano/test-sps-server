import cors from "cors";
import express from "express";
import { authRoutes } from "./auth/authRoutes.js";
import { userRoutes } from "./user/userRoutes.js";
import { authenticateJwt, handleAuthErrors } from "./auth/middlewares.js";
import { handleGenericErrors } from "./utils/errorHandler.js";
import { initAdminUser } from "../database/index.js";


const app = express();

app.use(cors());
app.use(express.json());

app.use(authRoutes);
app.use(authenticateJwt, userRoutes);

app.use(handleAuthErrors);
app.use(handleGenericErrors);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
	console.log(`Server is running on http://localhost:${PORT}`);
	await initAdminUser()
});
