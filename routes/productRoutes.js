const express = require("express");

const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  stockIn,
  stockOut,
  getStockMovements,
  getLowStock,
} = require("../controllers/productController");

const {
  protect,
  authorize,
} = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.get("/", getProducts);

router.get("/low-stock", getLowStock);

router.get("/:id/movements", getStockMovements);

router.get("/:id", getProduct);

router.post(
  "/",
  authorize("admin", "manager"),
  createProduct
);

router.put(
  "/:id",
  authorize("admin", "manager"),
  updateProduct
);

router.delete(
  "/:id",
  authorize("admin"),
  deleteProduct
);

router.post(
  "/:id/stock-in",
  authorize("admin", "manager", "staff"),
  stockIn
);

router.post(
  "/:id/stock-out",
  authorize("admin", "manager", "staff"),
  stockOut
);

module.exports = router;