const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool
  .connect()
  .then(() => console.log("Connected to user database"))
  .catch((err) => console.error("Database connection error:", err));

// Basic CRUD routes
app.get("/users", async (req, res) => {
  const result = await pool.query("SELECT * FROM users");
  res.json(result.rows);
});

app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  const result = await pool.query(
    "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
    [name, email]
  );
  res.json(result.rows[0]);
});

// Starting the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`User service running on port ${PORT}`);
});
