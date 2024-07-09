const { express, router, db } = require('./common_import');



// Get all food items
router.get('/menu', (req, res) => {
    const sql = "SELECT * FROM restaurant.food ORDER BY category_id";
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error querying food table:', err);
            res.status(500).json({ error: "Error querying food table" });
        } else {
            console.log('Get food data');
            res.status(200).json(result);
        }
    });
});

// Update a food item
router.put('/menu/:foodId', (req, res) => {
    const { foodId } = req.params;
    const { food_name, food_description, food_image, category_id } = req.body;

    const sql = `
    UPDATE restaurant.food 
    SET food_name = ?, food_description = ?, food_image = ?, category_id = ? 
    WHERE food_id = ?
  `;
    const values = [food_name, food_description, food_image, category_id, foodId];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error updating food item:', err);
            res.status(500).json({ error: "Error updating food item" });
        } else {
            console.log(`Food item with ID ${foodId} updated successfully`);
            res.status(200).json({ message: `Food item with ID ${foodId} updated successfully` });
        }
    });
});

// Delete a food item
router.delete('/menu/:foodId', (req, res) => {
    const { foodId } = req.params;

    const sql = "DELETE FROM restaurant.food WHERE food_id = ?";
    const values = [foodId];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error deleting food item:', err);
            res.status(500).json({ error: "Error deleting food item" });
        } else {
            console.log(`Food item with ID ${foodId} deleted successfully`);
            res.status(200).json({ message: `Food item with ID ${foodId} deleted successfully` });
        }
    });
});

// Insert a new food item
router.post('/menu', (req, res) => {
    const { food_name, food_description, food_image, category_id } = req.body;
    console.log(food_name, food_description, food_image, category_id);
    const sql = `
        INSERT INTO food (food_name, food_description, food_image, category_id)
        VALUES (?, ?, ?, ?)
    `;
    const values = [food_name, food_description, food_image, category_id];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error inserting new food item:', err);
            res.status(500).json({ error: "Error inserting new food item" });
        } else {
            const insertedFoodId = result.insertId;
            console.log(`New food item inserted with ID: ${insertedFoodId}`);
            res.status(201).json({
                message: 'New food item inserted successfully',
                insertedFoodId
            });
        }
    });
});


module.exports = router;
