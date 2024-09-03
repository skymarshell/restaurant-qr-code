const { express, router, db } = require('./common_import');
// : http://localhost:3000/tables/table/:time/:id
router.get('/table', (req, res) => {
  const sql = `SELECT * FROM tables
              ORDER BY CAST(table_number AS UNSIGNED);
             `;
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

  const { time, id } = req.params
  const sql = "SELECT * FROM tables WHERE table_number = ? and start_time=? ";
  db.query(sql, [id, time], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Database query error" });
      return;
    }


    res.json({ len: result.length, result: { ...result } });
  });
});

router.post('/table', (req, res) => {
  const tableInput = req.body.tableInput;

  if (!tableInput) {
    return res.status(400).json({ message: "Table number is required" });
  }

  const sql = "INSERT INTO tables (table_number) VALUES (?)";
  db.query(sql, [tableInput], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error occurred while creating the table" });
    }

    res.status(201).json({
      message: "Table successfully Added."
    });
  });
});

router.put('/table/time_up', (req, res) => {
  const table_number = req.body.table_number

  const sql = "UPDATE tables SET status = ? WHERE table_number = ?";
  db.query(sql, ["time's up", table_number], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An error occurred while creating the table" });
    }

    res.status(201).json({
      message: "Table successfully updated."
    });
  });
});

router.put('/table/reset', (req, res) => {
  const { table_number } = req.body; // Extract from req.body
  const sql = `UPDATE tables SET 
  start_time = ?, customer_count = ? ,status = ? 
  WHERE table_number = ?`
  db.query(sql, ["", 0, "available", table_number], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Database query error" });
      return;
    }

    const sqlCheckOrder = 'SELECT count(*) as "count" FROM customer_order WHERE order_table = ? AND order_status = ?';
    db.query(sqlCheckOrder, [table_number, 2], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return;
      }
      if (result[0].count > 0) {
        const cancelOrder = `
        UPDATE customer_order SET
        order_status = ? WHERE order_table = ? AND order_status = ?
        `
        db.query(cancelOrder, [-1, table_number, 2], (err, result) => {
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
    const insertHistory = `
    INSERT INTO customer_history 
    (customer_count, customer_date, table_number)
    VALUES 
    (?,?,?)
    `
    db.query(insertHistory, [customer_count, start_time, table_number], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Database query error" });
        return;
      }
    })

    res.json({ message: "Table start successfully", result });
  });
});


module.exports = router;
