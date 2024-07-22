const { express, router, db } = require('./common_import');

router.get('/table', (req, res) => {
  const sql = "SELECT * FROM tables";
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Database query error" });
      return;
    }
    res.json(result);
  });
});

router.put('/table/reset', (req, res) => {
  const { table_number } = req.body; // Extract from req.body
  const sql = `UPDATE tables SET 
  start_time = ?, customer_count = ? ,status = ? 
  WHERE table_number = ?`
  db.query(sql, ["-", 0, "available", table_number], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Database query error" });
      return;
    }
    res.json({ message: "Table reset successfully", result });
  });
});

router.put('/table/start', (req, res) => {
  const { start_time, customer_count, table_number } = req.body; 
  const sql = `UPDATE tables SET 
  start_time = ?, customer_count = ? ,status = ? 
  WHERE table_number = ?`
  db.query(sql, [start_time, customer_count, "unavailable", table_number], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Database query error" });
      return;
    }
    res.json({ message: "Table start successfully", result });
  });
});


module.exports = router;
