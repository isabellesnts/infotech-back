import express, { Application } from "express";
import cors from "cors";
import categoriaRoutes from "./routes/categoriaRoutes";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/categorias", categoriaRoutes);

export default app;
