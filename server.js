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
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect()
  .then(() => console.log("DB CONNECTED"))
  .catch(err => console.error("DB ERROR:", err));


// GET DATA
app.get("/data", async (req, res) => {
  try {

    const result = await pool.query(
      "SELECT * FROM keuangan ORDER BY id DESC"
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error ambil data");
  }
});


// TAMBAH DATA
app.post("/data", async (req, res) => {

  try {

    const { deskripsi, jumlah, tipe } = req.body;

    await pool.query(
      "INSERT INTO keuangan (deskripsi, jumlah, tipe) VALUES ($1,$2,$3)",
      [deskripsi, jumlah, tipe]
    );

    res.send("Berhasil tambah");

  } catch (err) {
    console.error(err);
    res.status(500).send("Database Error");
  }
});


// EDIT DATA
app.put("/data/:id", async (req, res) => {

  try {

    const { deskripsi, jumlah, tipe } = req.body;

    const id = req.params.id;

    await pool.query(
      "UPDATE keuangan SET deskripsi=$1, jumlah=$2, tipe=$3 WHERE id=$4",
      [deskripsi, jumlah, tipe, id]
    );

    res.send("Updated");

  } catch (err) {
    console.error(err);
    res.status(500).send("Update Error");
  }
});


// HAPUS DATA
app.delete("/data/:id", async (req, res) => {

  try {

    const id = req.params.id;

    await pool.query(
      "DELETE FROM keuangan WHERE id=$1",
      [id]
    );

    res.send("Deleted");

  } catch (err) {
    console.error(err);
    res.status(500).send("Delete Error");
  }
});


// SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server jalan di ${PORT}`);
});