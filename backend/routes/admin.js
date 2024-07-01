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



module.exports = router