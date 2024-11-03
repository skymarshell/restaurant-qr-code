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
    // viewBy = 0 -> View all.
    // viewBy = 1 -> View orders this day.
    // viewBy = 2 -> View orders by date.
    // waiting order = 2
    const { page, limit, view, viewBy, viewDate, viewMonth, viewYear } = req.query;
    const offset = (page - 1) * limit;

    console.log(view, viewBy, viewDate, viewMonth, viewYear);


    /* SELECT * FROM restaurant.customer_order WHERE order_date between '2024-08-21 00:00:00' AND '2024-08-21 23:59:59'; */

    // const sql = view === "waiting orders"
    //     ? `SELECT * FROM customer_order WHERE order_status = 2 ORDER BY order_status DESC , order_id LIMIT ${limit} OFFSET ${offset}`
    //     : `SELECT * FROM customer_order ORDER BY order_status DESC , order_id DESC LIMIT ${limit} OFFSET ${offset}`;

    let sql2, countSql;
    let d = new Date(); // Use new Date() to get a Date object
    let date = String(d.getDate()).padStart(2, '0'); // Ensure date is zero-padded
    let month = String(d.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so add 1 and zero-pad
    let year = d.getFullYear();
    // viewBy = 0 -> View all.
    // viewBy = 1 -> View orders this day.
    // viewBy = 2 -> View orders by date.
    // cancel = -1
    // sent = 1
    // waiting order = 2
    if (view == 'view all orders') {

        // view all status
        if (viewBy == 0) {
            sql2 = `
        SELECT * FROM customer_order       
        ORDER BY order_status DESC, order_id 
        LIMIT ${limit} OFFSET ${offset}`;

            countSql = "SELECT COUNT(*) as total FROM customer_order"
        }
        else if (viewBy == 1) {
            sql2 = `
                SELECT * FROM customer_order 
                WHERE order_date BETWEEN '${year}-${month}-${date} 00:00:00' AND 
                '${year}-${month}-${date} 23:59:59' 
                ORDER BY order_status DESC, order_id 
                LIMIT ${limit} OFFSET ${offset}`;

            countSql = `SELECT COUNT(*) as total FROM customer_order 
            WHERE order_date BETWEEN '${year}-${month}-${date} 00:00:00' AND 
            '${year}-${month}-${date} 23:59:59'
            ORDER BY order_status DESC, order_id 
            LIMIT ${limit} OFFSET ${offset}
            `
        }
        else if (viewBy == 2) {
            // //View orders by date.
            sql2 = `
                SELECT * FROM customer_order 
                WHERE order_date BETWEEN '${viewYear}-${viewMonth}-${viewDate} 00:00:00' AND 
                '${viewYear}-${viewMonth}-${viewDate} 23:59:59' 
                ORDER BY order_status DESC, order_id 
                LIMIT ${limit} OFFSET ${offset}`;

            countSql = `SELECT COUNT(*) as total FROM customer_order 
                WHERE order_date BETWEEN '${viewYear}-${viewMonth}-${viewDate} 00:00:00' AND 
                '${viewYear}-${viewMonth}-${viewDate} 23:59:59'
                ORDER BY order_status DESC, order_id 
                LIMIT ${limit} OFFSET ${offset}
                `
        }


    }
    else if (view == "waiting orders") {
        // view all date
        if (viewBy == 0) {
            sql2 = `
            SELECT * FROM customer_order 
            WHERE order_status = 2            
            ORDER BY order_status DESC, order_id 
            LIMIT ${limit} OFFSET ${offset}`;

            countSql = `SELECT COUNT(*) as total FROM customer_order 
            WHERE order_status = 2          
            `
        }
        //View orders this day.
        else if (viewBy == 1) {
            sql2 = `
                SELECT * FROM customer_order 
                WHERE order_status = 2 
                AND order_date BETWEEN '${year}-${month}-${date} 00:00:00' AND 
                '${year}-${month}-${date} 23:59:59' 
                ORDER BY order_status DESC, order_id 
                LIMIT ${limit} OFFSET ${offset}`;

            countSql = `SELECT COUNT(*) as total FROM customer_order 
                WHERE order_status = 2                
                AND order_date BETWEEN '${year}-${month}-${date} 00:00:00' AND 
                '${year}-${month}-${date} 23:59:59'        
                `
        } else if (viewBy == 2) {
            // //View orders by date.
            sql2 = `
                SELECT * FROM customer_order 
                WHERE order_status = 2 
                AND order_date BETWEEN '${viewYear}-${viewMonth}-${viewDate} 00:00:00' AND 
                '${viewYear}-${viewMonth}-${viewDate} 23:59:59' 
                ORDER BY order_status DESC, order_id 
                LIMIT ${limit} OFFSET ${offset}`;

            countSql = `SELECT COUNT(*) as total FROM customer_order 
                WHERE order_status = 2                
                AND order_date BETWEEN '${viewYear}-${viewMonth}-${viewDate} 00:00:00' AND 
                '${viewYear}-${viewMonth}-${viewDate} 23:59:59'        
                `
        }
    }
    else if (view == 'sent') {
        if (viewBy == 0) {
            // view all date
            sql2 = `
            SELECT * FROM customer_order 
            WHERE order_status = 1            
            ORDER BY order_status DESC, order_id 
            LIMIT ${limit} OFFSET ${offset}`;

            countSql = `SELECT COUNT(*) as total FROM customer_order WHERE order_status = 1`
        }
        //View orders this day.
        else if (viewBy == 1) {
            sql2 = `
                SELECT * FROM customer_order 
                WHERE order_status = 1 
                AND order_date BETWEEN '${year}-${month}-${date} 00:00:00' AND 
                '${year}-${month}-${date} 23:59:59' 
                ORDER BY order_status DESC, order_id 
                LIMIT ${limit} OFFSET ${offset}`;

            countSql = `SELECT COUNT(*) as total FROM customer_order 
            WHERE order_status = 1
            AND order_date BETWEEN '${year}-${month}-${date} 00:00:00' AND 
            '${year}-${month}-${date} 23:59:59'
            `
        } else if (viewBy == 2) {
            // //View orders by date.
            sql2 = `
                SELECT * FROM customer_order 
                WHERE order_status = 1 
                AND order_date BETWEEN '${viewYear}-${viewMonth}-${viewDate} 00:00:00' AND 
                '${viewYear}-${viewMonth}-${viewDate} 23:59:59' 
                ORDER BY order_status DESC, order_id 
                LIMIT ${limit} OFFSET ${offset}`;


            countSql = `SELECT COUNT(*) as total FROM customer_order 
                WHERE order_status = 1
                AND order_date BETWEEN '${viewYear}-${viewMonth}-${viewDate} 00:00:00' AND 
                '${viewYear}-${viewMonth}-${viewDate} 23:59:59'
                `
        }
    }
    else if (view == 'cancel') {
        if (viewBy == 0) {
            // view all date
            sql2 = `
            SELECT * FROM customer_order 
            WHERE order_status = -1            
            ORDER BY order_status DESC, order_id 
            LIMIT ${limit} OFFSET ${offset}`;

            countSql = `SELECT COUNT(*) as total FROM customer_order WHERE order_status = -1`
        }
        //View orders this day.
        else if (viewBy == 1) {
            sql2 = `
                SELECT * FROM customer_order 
                WHERE order_status = -1 
                AND order_date BETWEEN '${year}-${month}-${date} 00:00:00' AND 
                '${year}-${month}-${date} 23:59:59' 
                ORDER BY order_status DESC, order_id 
                LIMIT ${limit} OFFSET ${offset}`;

            countSql = `SELECT COUNT(*) as total FROM customer_order WHERE order_status = -1            
            AND order_date BETWEEN '${year}-${month}-${date} 00:00:00' AND 
                '${year}-${month}-${date} 23:59:59'
            `
        } else if (viewBy == 2) {
            // //View orders by date.
            sql2 = `
                SELECT * FROM customer_order 
                WHERE order_status = -1 
                AND order_date BETWEEN '${viewYear}-${viewMonth}-${viewDate} 00:00:00' AND 
                '${viewYear}-${viewMonth}-${viewDate} 23:59:59' 
                ORDER BY order_status DESC, order_id 
                LIMIT ${limit} OFFSET ${offset}`;

            countSql = `SELECT COUNT(*) as total FROM customer_order WHERE order_status = -1            
                AND order_date BETWEEN '${viewYear}-${viewMonth}-${viewDate} 00:00:00' AND 
                    '${viewYear}-${viewMonth}-${viewDate} 23:59:59'
                `
        }
    }





    db.query(sql2, (err, orders) => {
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


    if (time == "admin" && id == "admin") {
        const getPage = req.query.getPage
        console.log(getPage);


        let adminSQL = `SELECT * FROM customer_order 
        WHERE order_table LIKE ? ORDER BY order_id DESC LIMIT ${parseInt(getPage) * 5},5`;

        db.query(adminSQL, ['%admin%'], (err, results) => {
            if (err) {
                console.error('SQL error:', err);
                return res.status(500).json({ error: 'Database query failed' });
            }

            res.json(results);
        });
        return
    }

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
    const { id, orders, adminInput } = req.body;

    let order_table;
    if (adminInput != "") {
        order_table = `Admin order table ${adminInput.trim()}`
    } else {
        order_table = id
    }

    // Construct the order_text
    let order_text = orders.map(order => `${order["name"]} : ${order["quantity"]}`).join(',');

    const currentTime = getDateTime()

    // SQL query (changed table name to orders)
    const sql = "INSERT INTO customer_order (orders, order_date, order_table , order_status) VALUES (?, ?, ?,?)";

    // Execute the query
    db.query(sql, [order_text, currentTime, order_table, 2], (err, result) => {
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