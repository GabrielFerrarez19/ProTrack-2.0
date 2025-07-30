import mysql from "mysql";
import dotenv from "dotenv";
dotenv.config();

export const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "gabri1234",
  database: process.env.DB_NAME || "protrack",
});
