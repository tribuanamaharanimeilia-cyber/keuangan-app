require("dotenv").config();

const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// STATIC FILE
app.use(express.static(path.join(__dirname, "public")));
// app.use(express.static(path.join(__dirname, "public")));

// DATABASE
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// TEST DATABASE
pool.connect()
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch((err) => {
    console.error("DB ERROR:", err);
  });

// ROOT
app.get("/", (req, res) => {
  res.send("APP HIDUP");
});

// GET DATA
app.get("/data", async (req, res) => {
  try {

    const result = await pool.query(
      "SELECT * FROM keuangan ORDER BY id DESC"
    );

    res.json(result.rows);

  } catch (err) {

    console.error("GET ERROR:", err);

    res.status(500).json({
      error: err.message,
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
      success: true,
    });

  } catch (err) {

    console.error("POST ERROR:", err);

    res.status(500).json({
      error: err.message,
    });
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

    res.json({
      success: true,
    });

  } catch (err) {

    console.error("PUT ERROR:", err);

    res.status(500).json({
      error: err.message,
    });
  }
});

// DELETE DATA
app.delete("/data/:id", async (req, res) => {
  try {

    const id = req.params.id;

    await pool.query(
      "DELETE FROM keuangan WHERE id=$1",
      [id]
    );

    res.json({
      success: true,
    });

  } catch (err) {

    console.error("DELETE ERROR:", err);

    res.status(500).json({
      error: err.message,
    });
  }
});

// PORT
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${PORT}`);
});