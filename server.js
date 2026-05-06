require("dotenv").config();

const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => console.log("DB CONNECTED"))
  .catch(err => console.error("DB ERROR:", err));

app.get("/data", async (req, res) => {
  const result = await pool.query("SELECT * FROM keuangan ORDER BY id DESC");
  res.json(result.rows);
});

app.post("/data", async (req, res) => {
  const { deskripsi, jumlah, tipe } = req.body;

  await pool.query(
    "INSERT INTO keuangan (deskripsi, jumlah, tipe) VALUES ($1, $2, $3)",
    [deskripsi, jumlah, tipe]
  );

  res.send("OK");
});

app.listen(3000, () => console.log("Server jalan di 3000"));

app.put("/data/:id", async (req, res) => {
  const { deskripsi, jumlah, tipe } = req.body;
  const id = req.params.id;

  await pool.query(
    "UPDATE keuangan SET deskripsi=$1, jumlah=$2, tipe=$3 WHERE id=$4",
    [deskripsi, jumlah, tipe, id]
  );

  res.send("Updated");
});

app.delete("/data/:id", async (req, res) => {
  const id = req.params.id;
  await pool.query("DELETE FROM keuangan WHERE id=$1", [id]);
  res.send("Deleted");
});

app.put("/data/:id", async (req, res) => {
  const { deskripsi, jumlah, tipe } = req.body;
  const id = req.params.id;

  await pool.query(
    "UPDATE keuangan SET deskripsi=$1, jumlah=$2, tipe=$3 WHERE id=$4",
    [deskripsi, jumlah, tipe, id]
  );

  res.send("Updated");
});