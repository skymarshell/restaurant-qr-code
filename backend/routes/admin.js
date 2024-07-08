const { express, router, db } = require('./common_import')

router.get('/login', (req, res) => {
      res.json("admin login")
})

router.post('/login', (req, res) => {
      const username = req.body.username
      const password = req.body.password

      const sql = "Select * from admin WHERE username = ? and password = ?"
      db.query(sql, [username, password], (err, result) => {
            if (err) {
                  console.log(err)
                  return;
            }
            if (result.length > 0) {
                  res.status(200).json("Admin found");
            } else {
                  res.status(404).json({ error: "Admin not found" });
            }
      })
})

router.get('/categories', (req, res) => {
      const sql = "SELECT * FROM category ORDER BY category_id"
      db.query(sql, (err, result) => {
            if (err) {
                  console.log(err)
                  return
            }
            else {
                  res.status(200).json(result)
            }
      })
})


router.post('/categories/update', (req, res) => {
      const category_id = req.body.category_id;
      const category_name = req.body.category_name;

      // Check if the category name already exists
      const checkSql = "SELECT * FROM category WHERE category_name = ? ";
      db.query(checkSql, [category_name], (err, results) => {
            if (err) {
                  console.error("Error checking category:", err);
                  res.status(500).json({ error: "Error checking category" });
                  return;
            }

            if (results.length > 0) {
                  res.status(400).json({ error: "Category name already exists" });
                  return;
            }

            // Proceed to update if the name doesn't exist
            const updateSql = "UPDATE category SET category_name = ? WHERE category_id = ?";
            db.query(updateSql, [category_name, category_id], (err, result) => {
                  if (err) {
                        console.error("Error updating category:", err);
                        res.status(500).json({ error: "Error updating category" });
                        return;
                  }

                  console.log("Category updated successfully");
                  res.status(200).json(result);
            });
      });
});


router.post('/categories/insert', (req, res) => {
      const category_name = req.body.category_name
      const sql = "INSERT INTO category (category_name) VALUE (?)";
      db.query(sql, [category_name], (err, result) => {
            if (err) {
                  console.error("Error inserting category:", err);
                  res.status(500).json({ error: "Error inserting category" });
                  return
            }
            else {
                  console.log("Category inserted successfully");
                  res.status(200).json(result);
            }
      })
})

router.delete('/categories/delete/:id/:name', (req, res) => {
      const category_id = req.params.id;
      const category_name = req.params.name;

      const sql = "DELETE FROM category WHERE category_name = ? and category_id = ?";
      db.query(sql, [category_name, category_id], (err, result) => {
            if (err) {
                  console.error("Error deleting category:", err);
                  res.status(500).json({ error: "Error deleting category" });
                  return;
            } else {
                  console.log("Category deleted successfully");
                  res.status(200).json({ message: "Category deleted successfully" });
            }
      });
});


module.exports = router