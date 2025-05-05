const express = require("express");
const { userRoutes } = require("./user/routes");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(userRoutes);

app.listen(process.env.PORT, () => {
	console.log("Server is running on http://localhost:3000");
});
