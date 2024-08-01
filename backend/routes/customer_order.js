const { express, router, db } = require('./common_import');
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
        ? `SELECT * FROM customer_order WHERE order_status = 2 ORDER BY order_status DESC,order_id DESC LIMIT ${limit} OFFSET ${offset}`
        : `SELECT * FROM customer_order ORDER BY order_status DESC,order_id DESC LIMIT ${limit} OFFSET ${offset}`;

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
    const maxTime = 150; // Duration in minutes
    const { time, id } = req.params;

    // Split the date and time
    const [datePart, timePart] = time.split(' ');
    const [h, m, s] = timePart.split(':');

    // Convert to integers
    const hours = parseInt(h, 10);
    const minutes = parseInt(m, 10);

    // Calculate end time
    let endMinutes = minutes + (maxTime % 60); // Add remaining minutes
    let endHours = hours + Math.floor(maxTime / 60); // Add hours

    // Handle overflow in minutes
    if (endMinutes >= 60) {
        endHours += Math.floor(endMinutes / 60); // Convert overflow to hours
        endMinutes = endMinutes % 60; // Keep minutes within 0-59
    }

    // Optionally handle day overflow (e.g., hours exceeding 24)
    endHours = endHours % 24; // Uncomment if you need to handle day overflow

    // Format end time with leading zeros if needed
    const formattedEndHours = endHours.toString().padStart(2, '0');
    const formattedEndMinutes = endMinutes.toString().padStart(2, '0');
    const endTime = `${formattedEndHours}:${formattedEndMinutes}:59`;

    // Build SQL query with parameterized values
    const sql = `
      SELECT * FROM customer_order
      WHERE STR_TO_DATE(order_date, '%Y-%m-%d %H:%i:%s') 
      BETWEEN ? AND ?
    `;

    const startDateTime = `${datePart} ${timePart}`;
    const endDateTime = `${datePart} ${endTime}`;

    // Execute the query
    db.query(sql, [startDateTime, endDateTime], (err, results) => {
        if (err) {
            console.error('SQL error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }

        res.json(results);
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