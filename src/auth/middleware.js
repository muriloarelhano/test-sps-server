import { expressjwt } from "express-jwt";
import { JWT_SECRET } from "./routes.js";

export const authenticateJwt = expressjwt({
	secret: JWT_SECRET,
	algorithms: ["HS256"],
});

export const handleAuthErrors = (err, req, res, next) => {
	if (err.name === "UnauthorizedError") {
		return res.status(401).json({ message: "Invalid or expired token" });
	}
	next(err);
};
