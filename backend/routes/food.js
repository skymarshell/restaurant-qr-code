const { express, router, db } = require("./common_import");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads")); // Specify the destination path
  },
  filename: function (req, file, cb) {
    // Use path methods to get a sanitized base name and extension
    const name = path
      .basename(file.originalname, path.extname(file.originalname))
      .replace(/[^a-zA-Z0-9_-]/g, ""); // Removes special characters
    const extension = path.extname(file.originalname);

    // Generate the unique file name
    const getFileName = `${Date.now()}-${name}${extension}`;

    cb(null, getFileName);
  },
});

const upload = multer({ storage: storage });

// Get all food items
router.get("/menu", (req, res) => {
  const sql = "SELECT * FROM food ORDER BY category_id";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error querying food table:", err);
      res.status(500).json({ error: "Error querying food table" });
    } else {
      res.status(200).json(result);
    }
  });
});

// Update a food item
router.put("/menu/:foodId", upload.single("food_image"), (req, res) => {
  const { foodId } = req.params;
  const { food_name, food_description, category_id, old_food_name } = req.body;

  // Check if req.file exists and is not null before assigning food_image
  let food_image = null;
  if (req.file) {
    food_image = req.file.filename;
  }

  const sql = `
      UPDATE food 
      SET food_name = ?, food_description = ?, food_image = IFNULL(?, food_image), category_id = ? 
      WHERE food_id = ?
    `;
  const values = [food_name, food_description, food_image, category_id, foodId];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error updating food item:", err);
      res.status(500).json({ error: "ชื่ออาหารซํ้ากัน" });
    } else {
      //delete old image
      if (req.file) {
        // Step 2: Delete the file from the filesystem
        const filePath = path.resolve(__dirname, "../uploads", old_food_name);
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error("ลบรูปเก่าไม่ได้", unlinkErr);
              res.status(500).json({ error: "Error deleting food image" });
            }
          });
        }
      }
      res
        .status(200)
        .json({ msg: `Food item with ID ${foodId} updated successfully` });
      console.log(`Food item with ID ${foodId} updated successfully`);
    }
  });
});

// Delete a food item
// Delete a food item and its associated image
router.delete("/menu/:foodId", (req, res) => {
  const { foodId } = req.params;

  const deleteSql = "DELETE FROM food WHERE food_id = ?";
  db.query(deleteSql, [foodId], (deleteErr, deleteResult) => {
    if (deleteErr) {
      console.error("Error deleting food item:", deleteErr);
      res.status(500).json({ error: "Error deleting food item" });
    } else {
      console.log(`Food item with ID ${foodId} and image deleted successfully`);
      res
        .status(200)
        .json({ message: `Food item with ID ${foodId} deleted successfully` });
    }
  });
});

// POST route for adding a new food item with image upload
router.post("/menu", upload.single("food_image"), (req, res) => {
  const { food_name, food_description, category_id } = req.body;

  // Check if the required fields are present
  if (!food_name || !category_id || !req.file) {
    return res.status(400).json({
      error: "Missing required fields: food_name, category_id, or food_image",
    });
  }

  // Get the uploaded file name from multer
  const food_image = req.file.filename;

  const sql = `
      INSERT INTO food (food_name, food_description, food_image, category_id)
      VALUES (?, ?, ?, ?)
    `;
  const values = [food_name, food_description || "", food_image, category_id];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting new food item:", err);
      return res.status(500).json({ error: "Error inserting new food item" });
    }

    const insertedFoodId = result.insertId;
    console.log(`New food item inserted with ID: ${insertedFoodId}`);

    res.status(201).json({
      message: "New food item inserted successfully",
      insertedFoodId,
      food_image_url: `/uploads/${food_image}`, // Construct URL for image
    });
  });
});

module.exports = router;
