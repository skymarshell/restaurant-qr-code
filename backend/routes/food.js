const { express, router, db } = require('./common_import');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../restaurant-qr-code/public')); // Specify the destination path
    },
    filename: function (req, file, cb) {
        const [name, type] = file.originalname.split('.');
        const getFileName = `${Date.now()}-${name}.${type}`; // Add the dot before the file extension
        cb(null, getFileName);
    }
});


// Create multer instance
const upload = multer({ storage: storage });


// Get all food items
router.get('/menu', (req, res) => {
    const sql = "SELECT * FROM food ORDER BY category_id";
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error querying food table:', err);
            res.status(500).json({ error: "Error querying food table" });
        } else {

            res.status(200).json(result);
        }
    });
});





router.put('/menu/:foodId', (req, res) => {
    const { foodId } = req.params;
    const { food_name, food_url, food_description, category_id } = req.body;
    const sql = `
     UPDATE food 
SET 
    food_name = ?, 
    food_description = ?, 
    food_image = ?, 
    category_id = ? 
WHERE 
    food_id = ?;
    `;
    const values = [food_name, food_description, food_url, category_id, foodId];

    db.query(sql, values, (err, result) => {  // Pass `values` directly, not `[values]`
        if (err) {
            console.log("Update error:", err);
            res.status(500).json({ error: "ชื่ออาหารซํ้ากันหรืออาจมี Error" });
            return;
        }
        res.status(200).json({ message: `Food item with ID ${foodId} updated successfully` });
    });
});



// Delete a food item
// Delete a food item and its associated image
router.delete('/menu/:foodId', (req, res) => {
    const { foodId } = req.params;

    const deleteSql = "DELETE FROM food WHERE food_id = ?";
    db.query(deleteSql, [foodId], (deleteErr, deleteResult) => {
        if (deleteErr) {
            console.error('Error deleting food item:', deleteErr);
            res.status(500).json({ error: "Error deleting food item" });
        } else {
            console.log(`Food item with ID ${foodId} and image deleted successfully`);
            res.status(200).json({ message: `Food item with ID ${foodId} deleted successfully` });
        }
    });
});

// Insert a new food item
// POST route for adding a new food item with image upload
router.post('/menu', (req, res) => {


    const { foodName,
        foodDescription,
        fileURL,
        categoryId, } = req.body;

    // const food_image = req.file.filename; // Get the uploaded file name from multer

    const sql = `
      INSERT INTO food (food_name, food_description, food_image, category_id)
      VALUES (?, ?, ?, ?)
    `;
    const values = [foodName, foodDescription, fileURL, categoryId];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error inserting new food item:', err);
            res.status(500).json({ error: "Error inserting new food item" });
        } else {

            console.log(`New food item inserted`);
            res.status(201).json({
                message: 'New food item inserted successfully'
            });
        }
    });
});


module.exports = router;
