const express = require("express");

const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const {
  protect,
  authorize,
} = require("../middleware/auth");
const {
  categoryValidation,
} = require("../middleware/validators/categoryValidator");

const router = express.Router();

router.use(protect);

router.get("/categories", getCategories);

router.post(
  "/categories",
  authorize("admin", "manager"),
  categoryValidation,
  createCategory
);

router.put(
  "/categories/:id",
  authorize("admin", "manager"),
  categoryValidation,
  updateCategory
);

router.delete(
  "/categories/:id",
  authorize("admin"),
  deleteCategory
);

module.exports = router;