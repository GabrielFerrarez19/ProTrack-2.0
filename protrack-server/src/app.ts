import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import routes from "./routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", routes); // todas as rotas vão por aqui

const PORT = process.env.PORT || 8085;

// ✅ Escutando em todas as interfaces (inclusive IP público da EC2)
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

process.on("uncaughtException", (err) => {
  console.error("Erro não tratado:", err);
});
