import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "localhost",      // conecta na própria EC2
  user: "root",           // usuário que você configurou
  password: "gabri1234",  // senha definida
  port: 3306,             // porta padrão do MySQL
  database: "protrack",   // banco que você criou
});
