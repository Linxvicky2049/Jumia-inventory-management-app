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

const router = express.Router();

router.use(protect);

router.get("/", getCategories);

router.post(
  "/",
  authorize("admin", "manager"),
  createCategory
);

router.put(
  "/:id",
  authorize("admin", "manager"),
  updateCategory
);

router.delete(
  "/:id",
  authorize("admin"),
  deleteCategory
);

module.exports = router;