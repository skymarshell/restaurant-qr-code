const { express, router, db, fullTime } = require('./common_import');
const { getDateTime } = require("../functions")

router.get('/waiting_orderCount', (req, res) => {
    db.query("SELECT count(order_status) FROM customer_order WHERE order_status = ?", [2], (err, result) => {
        if (err) {
            console.log(err);
            return
        } else {

            res.status(200).json(result);
        }

    })
})

router.get('/get_order', (req, res) => {
    //page,limit=9 9 item per page,view = waiting orders || view all orders
    const { page, limit, view } = req.query;
    const offset = (page - 1) * limit;

    const sql = view === "waiting orders"
        ? `SELECT * FROM customer_order WHERE order_status = 2 ORDER BY order_status DESC , order_id LIMIT ${limit} OFFSET ${offset}`
        : `SELECT * FROM customer_order ORDER BY order_status DESC , order_id DESC LIMIT ${limit} OFFSET ${offset}`;

    const countSql = view === "waiting orders"
        ? `SELECT COUNT(*) as total FROM customer_order WHERE order_status = 2`
        : `SELECT COUNT(*) as total FROM customer_order`;

    db.query(sql, (err, orders) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Error fetching orders" });
        }

        db.query(countSql, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: "Error counting orders" });
            }

            const totalOrders = result[0].total;
            res.status(200).json({ orders, totalOrders });
        });
    });
});

router.get('/orders_history/:time/:id', (req, res) => {
    const maxTime = fullTime; // Duration in minutes
    const { time, id } = req.params;

    // Parse the input time
    const [datePart, timePart] = time.split(' ');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hours, minutes, seconds] = timePart.split(':').map(Number);

    // Create a Date object from the parsed parts
    const startDate = new Date(year, month - 1, day, hours, minutes, seconds);

    // Calculate the end time by adding maxTime in minutes
    const endDate = new Date(startDate.getTime() + (maxTime * 60000)); // Add maxTime in milliseconds

    // Format dates back to SQL DATETIME string format
    const formatDateTime = (date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const dd = String(date.getDate()).padStart(2, '0');
        const hh = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        const ss = String(date.getSeconds()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
    };

    const formattedStartDateTime = formatDateTime(startDate);
    const formattedEndDateTime = formatDateTime(endDate);

    console.log(formattedStartDateTime);
    console.log(formattedEndDateTime);

    // Build SQL query with parameterized values
    const sql = `
      SELECT * FROM customer_order
      WHERE STR_TO_DATE(order_date, '%Y-%m-%d %H:%i:%s') 
      BETWEEN ? AND ? AND order_table = ? ORDER BY order_id DESC
    `;

    // Execute the query
    db.query(sql, [formattedStartDateTime, formattedEndDateTime, id], (err, results) => {
        if (err) {
            console.error('SQL error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }

        res.json(results);
    });
});

router.get('/analysis/:month/:year', (req, res) => {
    const { month, year } = req.params;

    const getCategory = `SELECT * FROM category`;
    const getFood = `SELECT * FROM food`;
    const getCustomerOrder = `SELECT * FROM customer_order WHERE order_status = 1`;
    const countCustomer = `
    SELECT sum(customer_count) as "customer_count" FROM customer_history
    WHERE customer_date 
    BETWEEN '${year}-${month.padStart(2, 0)}-01 00:00:00' AND '${year}-${month.padStart(2, 0)}-31 23:59:59';
    `;
    const countCustomerAllYear =
        `
    SELECT sum(customer_count) as "customer_count" FROM customer_history
    WHERE customer_date 
    BETWEEN '${year}-01-01 00:00:00' AND '${year}-12-31 23:59:59';
    `



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

    // Execute all queries in parallel using Promise.all
    Promise.all([
        query(getCategory),
        query(getFood),
        query(countCustomer),
        query(getCustomerOrder),
        query(countCustomerAllYear)
    ])
        .then(([categories, foods, customerCount, customerOrders,customerAllYearCount]) => {
            const data = {
                customerCount: customerCount[0].customer_count, // Extract the count from the result
                customerAllYearCount:customerAllYearCount[0].customer_count,
                category: categories,
                customerOrders: customerOrders,
                food: foods,
            };

            res.json(data); // Send the collected data as a response
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: 'Database query failed' });
        });
});



router.post('/confirm_order', (req, res) => {
    const { orderId } = req.body;
    const sql = `UPDATE customer_order SET order_status = 1 WHERE order_id = ?`;

    db.query(sql, [orderId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Error confirming order" });
        }
        res.status(200).json({ message: "Order confirmed" });
    });
});

router.post('/cancel_order', (req, res) => {
    const { orderId } = req.body;
    const sql = `UPDATE customer_order SET order_status = -1 WHERE order_id = ?`;

    db.query(sql, [orderId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Error cancelling order" });
        }
        res.status(200).json({ message: "Order cancelled" });
    });
});

router.post('/send_order', (req, res) => {
    const { id, orders } = req.body;

    // Construct the order_text
    let order_text = orders.map(order => `${order["name"]} : ${order["quantity"]}`).join(',');


    const currentTime = getDateTime()



    // SQL query (changed table name to orders)
    const sql = "INSERT INTO customer_order (orders, order_date, order_table , order_status) VALUES (?, ?, ?,?)";

    // Execute the query
    db.query(sql, [order_text, currentTime, id, 2], (err, result) => {
        if (err) {
            console.error('Error sending order:', err);
            res.status(500).json({ error: "Error sending order" });
        } else {
            console.log('Order sent successfully:', result);
            res.status(200).json({ message: "Order sent successfully", result });
        }
    });
});


module.exports = router;