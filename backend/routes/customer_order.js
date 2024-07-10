const { express, router, db } = require('./common_import');


router.get('/get_order', (req, res) => {

})

router.post('/send_order', (req, res) => {
    const { id, orders } = req.body;

    // Construct the order_text
    let order_text = orders.map(order => `${order["name"]} : ${order["quantity"]}`).join(', ');

    // Get the current date
    //YYYY-MM-DD HH-MM-S
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const currentTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`



    // SQL query (changed table name to orders)
    const sql = "INSERT INTO customer_order (orders, order_date, order_table) VALUES (?, ?, ?)";

    // Execute the query
    db.query(sql, [order_text, currentTime, id], (err, result) => {
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