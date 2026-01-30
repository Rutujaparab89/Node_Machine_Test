import express from "express";
import cors from "cors";
import mysql from "mysql2";

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",   
  database: "machine_test"
});

db.connect(err => {
  if (err) {
    console.error("DB ERROR:", err);
    return;
  }
  console.log("MySQL Connected");
});

/* TEST ROUTE */
app.get("/test", (req, res) => {
  res.json({ ok: true });
});

/* CATEGORY */
app.get("/categories", (req, res) => {
  db.query("SELECT * FROM categories", (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

app.post("/categories", (req, res) => {
  console.log("BODY:", req.body); // 👈 IMPORTANT LOG

  db.query(
    "INSERT INTO categories (category_name) VALUES (?)",
    [req.body.category_name],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Category Added" });
    }
  );
});

app.delete("/categories/:id", (req, res) => {
  db.query(
    "DELETE FROM categories WHERE category_id = ?",
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Category Deleted" });
    }
  );
});

app.put('/categories/:id', (req, res) => {
  db.query(
    'UPDATE categories SET category_name = ? WHERE category_id = ?',
    [req.body.category_name, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Updated' });
    }
  );
});

/* ================= PRODUCT ================= */

app.get("/products", (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const offset = (page - 1) * limit;

  db.query("SELECT COUNT(*) AS total FROM products", (err, count) => {
    if (err) return res.status(500).json(err);

    const total = count[0].total;
    const totalPages = Math.ceil(total / limit);

    db.query(
      `SELECT 
         p.product_id,
         p.product_name,
         p.category_id,
         c.category_name
       FROM products p
       JOIN categories c ON p.category_id = c.category_id
       ORDER BY p.product_id ASC
       LIMIT ? OFFSET ?`,
      [limit, offset],
      (err, rows) => {
        if (err) return res.status(500).json(err);

        res.json({
          data: rows,
          page,
          totalPages,
          total
        });
      }
    );
  });
});


app.post("/products", (req, res) => {
  const { product_name, category_id } = req.body;

  db.query(
    "INSERT INTO products (product_name, category_id) VALUES (?,?)",
    [product_name, category_id],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Product added" });
    }
  );
});

app.put("/products/:id", (req, res) => {
  db.query(
    "UPDATE products SET product_name=?, category_id=? WHERE product_id=?",
    [req.body.product_name, req.body.category_id, req.params.id],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Product updated" });
    }
  );
});

app.delete("/products/:id", (req, res) => {
  db.query(
    "DELETE FROM products WHERE product_id=?",
    [req.params.id],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Product deleted" });
    }
  );
});


app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

