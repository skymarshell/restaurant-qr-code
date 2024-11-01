const { express, router, db, fullTime } = require('./common_import');
const moment = require('moment')

// orders chart
router.get('/analysis/:day/:month/:year', async (req, res) => {
      const { day, month, year } = req.params;
      // Basic validation
      if (!day || !month || !year || isNaN(Date.parse(`${year}-${month}-${day}`))) {
            return res.status(400).json({ error: 'Invalid date parameters' });
      }

      // Define queries
      const getCategory = `SELECT * FROM category`;
      const getFood = `SELECT * FROM food`;
      const getCustomerOrder = `SELECT * FROM customer_order`;

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

      // Promisify db.query
      const query = (sql) => {
            return new Promise((resolve, reject) => {
                  db.query(sql, (err, result) => {
                        if (err) {
                              return reject(err);
                        }
                        resolve(result);
                  });
            });
      };

      try {
            // Execute all queries in parallel using Promise.all
            const [categories, foods, countCustomerByDateResult, countCustomerAllMonthResult, customerOrders, countCustomerAllYearResult] = await Promise.all([
                  query(getCategory),
                  query(getFood),
                  query(countCustomerByDate),
                  query(countCustomerAllMonth),
                  query(getCustomerOrder),
                  query(countCustomerAllYear)
            ]);

            // Extract counts from the results
            const data = {
                  countCustomerByDate: countCustomerByDateResult[0]?.customer_count || 0,
                  countCustomerAllMonth: countCustomerAllMonthResult[0]?.customer_count || 0,
                  customerAllYearCount: countCustomerAllYearResult[0]?.customer_count || 0,
                  category: categories,
                  customerOrders: customerOrders,
                  food: foods,
            };

            res.json(data); // Send the collected data as a response
      } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database query failed' });
      }
});

router.get('/chart', async (req, res) => {
      const { viewMode } = req.query;


      let sql;

      if (viewMode == "7day") {
            sql = `
            SELECT *
            FROM restaurant.customer_order
            WHERE order_date BETWEEN CURDATE() - INTERVAL 7 DAY AND CONCAT(CURDATE(), ' 23:59:59')
        `;
      } else if (viewMode == "today") {
            sql = `
          SELECT orders
          FROM restaurant.customer_order
          WHERE DATE(order_date) = CURDATE()
        `;
      } else if (viewMode == "thisMonth") {
            sql = `
          SELECT orders
          FROM restaurant.customer_order
          WHERE DATE(order_date) BETWEEN DATE_FORMAT(CURDATE(), '%Y-%m-01') AND CURDATE()
        `;
      } else if (viewMode == "all") {
            sql = `
          SELECT orders
          FROM restaurant.customer_order
        `;
      } else if (viewMode == "select_day") {

            const {
                  selectDay,
                  selectMonth,
                  selectYear,
            } = req.query

            sql = `  
                  SELECT orders
                  FROM restaurant.customer_order
                  WHERE order_date BETWEEN '${selectYear}-${String(selectMonth).padStart(2, '0')}-${String(selectDay).padStart(2, '0')} 00:00:00' 
                  AND '${selectYear}-${String(selectMonth).padStart(2, '0')}-${String(selectDay).padStart(2, '0')} 23:59:59'

          `

      } else if (viewMode == "onlyMonth") {
            const { onlyMonth } = req.query
            //console.log(onlyMonth);

            const now = new Date()
            sql = `SELECT orders
                  FROM restaurant.customer_order
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

            const foodKey = Object.keys(foodData);
            const foodValue = Object.values(foodData);

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
      FROM restaurant.customer_history
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