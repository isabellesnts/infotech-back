import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { testConnection } from "./config/database";

const PORT = process.env.PORT || 3000;

async function start() {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

start();
