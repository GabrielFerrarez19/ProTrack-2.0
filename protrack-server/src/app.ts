import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();

// Configura CORS para permitir requisições do frontend Vite
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Middleware para JSON e URL Encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Todas as rotas
app.use("/", routes);

// Porta (env ou fallback 8085)
const PORT = Number(process.env.PORT) || 8085;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

// Captura erros não tratados
process.on("uncaughtException", (err) => {
  console.error("Erro não tratado:", err);
});
