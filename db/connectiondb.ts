import mysql from "mysql";
import util from "util";
import dotenv from "dotenv";
dotenv.config();

export const conn = mysql.createPool({
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT),
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const queryAsync = util.promisify(conn.query).bind(conn);


