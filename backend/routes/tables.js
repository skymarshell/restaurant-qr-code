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

module.exports = router;
