const express = require("express");

const {
  createSupplier,
  getSuppliers,
  getSupplier,
  updateSupplier,
  deleteSupplier,
} = require("../controllers/supplierController");

const {
  protect,
  authorize,
} = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.get("/", getSuppliers);

router.get("/:id", getSupplier);

router.post(
  "/",
  authorize("admin", "manager"),
  createSupplier
);

router.put(
  "/:id",
  authorize("admin", "manager"),
  updateSupplier
);

router.delete(
  "/:id",
  authorize("admin"),
  deleteSupplier
);

module.exports = router;