import express from "express";
import cors from "cors";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rotas (exemplo)
app.get("/", (req, res) => {
  res.send("API rodando com sucesso 🚀");
});

// Corrigindo a porta
const PORT = Number(process.env.PORT) || 8085;

app.listen(8085, () => {
  console.log('Server running...');
});

// Escutando externamente
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
