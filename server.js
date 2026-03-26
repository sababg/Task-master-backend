import "dotenv/config";

import express from "express";

import "./config/connection.js";

import projectRoutes from "./routes/api/projectRoutes.js";
import userRoutes from "./routes/api/userRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
// app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => res.send("Hello World"));

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
