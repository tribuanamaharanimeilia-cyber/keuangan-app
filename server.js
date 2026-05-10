require("dotenv").config();

const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("WEB HIDUP");
});
// app.use(express.static("public"));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// TEST ROOT
app.get("/", (req, res) => {
  res.send("Server jalan");
});

// AMBIL DATA
app.get("/data", async (req, res) => {
  try {

    const result = await pool.query(
      "SELECT * FROM keuangan ORDER BY id DESC"
    );

    res.json(result.rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });
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

    res.json({
      success: true
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }
});

// EDIT
app.put("/data/:id", async (req, res) => {

  try {

    const { deskripsi, jumlah, tipe } = req.body;

    const id = req.params.id;

    await pool.query(
      "UPDATE keuangan SET deskripsi=$1, jumlah=$2, tipe=$3 WHERE id=$4",
      [deskripsi, jumlah, tipe, id]
    );

    res.json({
      success: true
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }
});

// DELETE
app.delete("/data/:id", async (req, res) => {

  try {

    const id = req.params.id;

    await pool.query(
      "DELETE FROM keuangan WHERE id=$1",
      [id]
    );

    res.json({
      success: true
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${PORT}`);
});