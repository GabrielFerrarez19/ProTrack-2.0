import express from "express";
import cors from "cors";
import router from "./routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use(router); // ✅ sem prefixo

const PORT = Number(process.env.PORT) || 8085;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT} 🚀`);
});
