import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "caboose.proxy.rlwy.net",
  user: "root",
  password: "BOwuyhBlulgOsPBiNVszpLGGmPQceMaH",
  port: 44969,
  database: "protrack", // igual ao final da URL
});
