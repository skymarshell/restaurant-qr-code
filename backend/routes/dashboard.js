
const { express, router, db, fullTime } = require('./common_import');
const moment = require('moment')

// orders chart
router.get('/analysis/:day/:month/:year', async (req, res) => {
      const { day, month, year } = req.params;

      // Basic validation
      const dayNum = parseInt(day);
      const monthNum = parseInt(month);
      const yearNum = parseInt(year);

      let sendData = []

      if (!day || !month || !year ||
            isNaN(dayNum) || isNaN(monthNum) || isNaN(yearNum) ||
            dayNum < 1 || dayNum > 31 ||
            monthNum < 1 || monthNum > 12 ||
            isNaN(Date.parse(`${year}-${month}-${day}`))) {
            return res.status(400).json({ error: 'Invalid date parameters' });
      }

      const countCustomerByDate = `
           SELECT SUM(customer_count) AS "customer_count" FROM customer_history 
           WHERE customer_date BETWEEN "${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')} 00:00:00" 
           AND "${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')} 23:59:59"`;


      const countCustomerAllMonth = `
           SELECT SUM(customer_count) AS "customer_count" FROM customer_history
           WHERE customer_date BETWEEN '${year}-${month.padStart(2, '0')}-01 00:00:00' 
           AND '${year}-${month.padStart(2, '0')}-31 23:59:59'`;

      const countCustomerAllYear = `
           SELECT SUM(customer_count) AS "customer_count" FROM customer_history
           WHERE customer_date BETWEEN '${year}-01-01 00:00:00' 
           AND '${year}-12-31 23:59:59'`;



      db.query(countCustomerByDate, (err, resultByDate) => {
            if (err) {
                  console.log(err);
                  return res.status(500).json({ error: 'Database query failed for specific date' });
            }

            db.query(countCustomerAllMonth, (err, resultMonth) => {
                  if (err) {
                        console.log(err);
                        return res.status(500).json({ error: 'Database query failed for month' });
                  }

                  db.query(countCustomerAllYear, (err, resultYear) => {
                        if (err) {
                              console.log(err);
                              return res.status(500).json({ error: 'Database query failed for year' });
                        }

                        // Extract results
                        const customerCountByDate = resultByDate[0] ? resultByDate[0].customer_count : 0;
                        const customerCountByMonth = resultMonth[0] ? resultMonth[0].customer_count : 0;
                        const customerCountByYear = resultYear[0] ? resultYear[0].customer_count : 0;

                        // Send the response
                        return res.json({
                              customerCountByDate,
                              customerCountByMonth,
                              customerCountByYear,
                        });
                  });
            });
      });

});

router.get('/latest_order', async (req, res) => {
      db.query("SELECT * FROM customer_order a order by a.order_id desc", (err, result) => {
            if (err) {
                  console.log(err);
                  return
            }
            res.json(result)
      })
})

router.get('/chart', async (req, res) => {
      const { viewMode } = req.query;



      let sql;

      if (viewMode == "7day") {
            sql = `
            SELECT *
            FROM customer_order
            WHERE order_date BETWEEN CURDATE() - INTERVAL 7 DAY AND CONCAT(CURDATE(), ' 23:59:59')
        `;
      } else if (viewMode == "today") {
            sql = `
          SELECT orders
          FROM customer_order
          WHERE DATE(order_date) = CURDATE()
        `;
      } else if (viewMode == "thisMonth") {
            sql = `
          SELECT orders
          FROM customer_order
          WHERE DATE(order_date) BETWEEN DATE_FORMAT(CURDATE(), '%Y-%m-01') AND CURDATE()
        `;
      } else if (viewMode == "all") {
            sql = `
          SELECT orders
          FROM customer_order
        `;
      } else if (viewMode == "select_day") {

            const {
                  selectDay,
                  selectMonth,
                  selectYear,
            } = req.query

            sql = `  
                  SELECT orders
                  FROM customer_order
                  WHERE order_date BETWEEN '${selectYear}-${String(selectMonth).padStart(2, '0')}-${String(selectDay).padStart(2, '0')} 00:00:00' 
                  AND '${selectYear}-${String(selectMonth).padStart(2, '0')}-${String(selectDay).padStart(2, '0')} 23:59:59'

          `

      } else if (viewMode == "onlyMonth") {
            const { onlyMonth } = req.query
            //console.log(onlyMonth);

            const now = new Date()
            sql = `SELECT orders
                  FROM customer_order
                  WHERE order_date BETWEEN '${now.getFullYear()}-${String(onlyMonth).padStart(2, '0')}-01 00:00:00' 
                  AND '${now.getFullYear()}-${String(onlyMonth).padStart(2, '0')}-${new Date(now.getFullYear(), onlyMonth, 0).getDate()} 23:59:59'
                  `
      }

      db.query(sql, (err, result) => {
            if (err) {
                  console.log(err);
                  return res.status(500).json({ error: err.message });
            }

            const foodData = {};
            result.forEach((o) => {
                  const splitOrder = o.orders.split(",");
                  splitOrder.forEach((item) => {
                        const [food, quantity] = item.split(":").map((str) => str.trim());
                        if (foodData[food]) {
                              foodData[food] += parseInt(quantity, 10);
                        } else {
                              foodData[food] = parseInt(quantity, 10);
                        }
                  });
            });

            const top5 = Object.entries(foodData)           // [['ข้าวผัด',10], ['กะเพรา',7], ...]
            .sort((a, b) => b[1] - a[1])                  // เรียงจากยอดขายมากไปน้อย
            .slice(0, 5);                                 // เอาแค่ 5 อันดับ

            const foodKey = top5.map(([name]) => name);
            const foodValue = top5.map(([, qty]) => qty);

            res.status(200).json({ foodKey, foodValue });
      });
});

//customer history chart
router.get('/customer_history_chart', async (req, res) => {
      //input year and month
      const year = req.query.year
      const inputMonth = req.query.month
      // Define a JavaScript function called lastday with parameters y (year) and m (month)
      var lastday = function (y, m) {
            // Create a new Date object representing the last day of the specified month
            // By passing m + 1 as the month parameter and 0 as the day parameter, it represents the last day of the specified month
            return new Date(y, m + 1, 0).getDate();
      }
      const date = [];
      // -1 เพราะ index เรื่ม 0
      for (let numDate = 1; numDate <= lastday(year, inputMonth - 1); numDate++) {
            date.push(`${year}-${String(inputMonth).padStart(2, "0")}-${String(numDate).padStart(2, "0")}`);
      }

      const sql = `
      SELECT 
      CAST(customer_date AS DATE) AS uni_date,
      SUM(customer_count) AS total_customers
      FROM customer_history
      WHERE CAST(customer_date AS DATE) 
      BETWEEN '${year}-${String(inputMonth).padStart(2, "0")}-01' 
      AND LAST_DAY('${year}-${String(inputMonth).padStart(2, "0")}-01')
      GROUP BY CAST(customer_date AS DATE)
      ORDER BY uni_date
      `
      db.query(sql, (err, result) => {
            if (err) {
                  console.log(err);
                  return
            }
            const splitCustomer_count = result.map((r) => {
                  return { date: moment(r.uni_date).format("YYYY-MM-DD"), total_customers: r.total_customers }
            })

            const summarizeData = date.map((d) => {
                  const found = splitCustomer_count.find((sc) => sc.date == d);
                  if (found != undefined) {
                        return found;
                  } else {
                        return { date: d, total_customers: 0 };
                  }
            });

            console.log(summarizeData);
            res.status(200).json(summarizeData)

      })

})

module.exports = router