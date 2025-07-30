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

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

process.on("uncaughtException", (err) => {
  console.error("Erro não tratado:", err);
});
