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

router.post('/categories', (req, res) => {
      const category_id = req.body.category_id
      const category_name = req.body.category_name
      const sql = "UPDATE category SET category_name = ? WHERE category_id = ?";
      db.query(sql, [category_name, category_id], (err, result) => {
            if (err) {
                  console.error("Error updating category:", err);
                  res.status(500).json({ error: "Error updating category" });
                  return
            }
            else {
                  console.log("Category updated successfully");
                  res.status(200).json(result);
            }
      })
})


module.exports = router