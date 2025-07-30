import express from "express";
const app = express();

app.get("/", (req, res) => {
  res.send("Servidor está vivo!");
});

app.listen(8080, () => {
  console.log("Servidor testando na porta 8080");
});
