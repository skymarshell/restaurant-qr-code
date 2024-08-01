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

router.get('/table/:time/:id', (req, res) => {
  // http://localhost:5173/customer/14:22/1
  const { time, id } = req.params
  const sql = "SELECT * FROM tables WHERE table_number = ? and start_time=? ";
  db.query(sql, [id, time], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Database query error" });
      return;
    }
    res.json(result.length);
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

    const sqlCheckOrder = 'SELECT count(*) as "count" FROM customer_order WHERE order_table = ?';
    db.query(sqlCheckOrder, [table_number], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return;
      }
      if (result[0].count > 0) {
        const cancelOrder = `
        UPDATE customer_order SET
        order_status = ? WHERE order_table = ? 
        `
        db.query(cancelOrder, [-1, table_number], (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: "Database query error" });
            return;
          }
        })
      }
    });


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
