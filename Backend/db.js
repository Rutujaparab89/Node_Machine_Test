import mysql from "mysql2";

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "machine_test"
});

db.connect(err => {
  if(err) console.log("DB connection error:", err);
  else console.log("DB connected");
});
