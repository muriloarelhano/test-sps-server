import cors from "cors";
import express from "express";
import { userRoutes } from "./user/routes.js";

const app = express();

app.use(cors());

app.use(userRoutes);

app.listen(process.env.PORT, () => {
	console.log("Server is running on http://localhost:3000");
});
