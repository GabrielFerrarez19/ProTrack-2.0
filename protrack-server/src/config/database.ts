// db.ts
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

export const db = mysql.createPool({
  host: "18.191.70.76", // ou '18.191.70.76' se for remoto
  user: "protrack_user",
  password: "senha_segura_aqui",
  database: "protrack",
  port: 3306, // verifique seu porto do MySQL
});
