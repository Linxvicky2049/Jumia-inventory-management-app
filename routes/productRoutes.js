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

  bulkUpdateProductImages,
  uploadProductImage,
  bulkUploadProductImages,
} = require("../controllers/productcontroller");

const {
  protect,
  authorize,
} = require("../middleware/auth");

const {
  productValidation,
  productUpdateValidation,
} = require("../middleware/validators/productValidator");

const {
  upload,
} = require("../middleware/uploads");

const router = express.Router();

// =====================================================
// AUTHENTICATION
// =====================================================

router.use(protect);

// =====================================================
// PRODUCTS
// =====================================================

// GET /api/products
router.get(
  "/",
  getProducts
);

// =====================================================
// SINGLE PRODUCT IMAGE UPLOAD
// =====================================================

// POST /api/products/:id/images
router.post(
  "/:id/images",

  authorize("admin", "manager"),

  upload.single("image"),

  uploadProductImage
);

// =====================================================
// BULK IMAGE URL UPDATE
// =====================================================

// POST /api/products/bulk-images
router.post(
  "/bulk-images",

  authorize("admin", "manager"),

  bulkUpdateProductImages
);

// =====================================================
// BULK ACTUAL IMAGE UPLOAD
// =====================================================

// POST /api/products/bulk-images/upload
router.post(
  "/bulk-images/upload",

  authorize("admin", "manager"),

  upload.array("images", 100),

  bulkUploadProductImages
);

// =====================================================
// LOW STOCK
// =====================================================

// GET /api/products/low-stock
router.get(
  "/low-stock",
  getLowStock
);

// =====================================================
// STOCK MOVEMENTS
// =====================================================

// GET /api/products/:id/movements
router.get(
  "/:id/movements",
  getStockMovements
);

// =====================================================
// SINGLE PRODUCT
// =====================================================

// GET /api/products/:id
router.get(
  "/:id",
  getProduct
);

// =====================================================
// CREATE PRODUCT
// =====================================================

// POST /api/products
router.post(
  "/",

  authorize("admin", "manager"),

  productValidation,

  createProduct
);

// =====================================================
// UPDATE PRODUCT
// =====================================================

// PUT /api/products/:id
router.put(
  "/:id",

  authorize("admin", "manager"),

  productUpdateValidation,

  updateProduct
);

// =====================================================
// DELETE PRODUCT
// =====================================================

// DELETE /api/products/:id
router.delete(
  "/:id",

  authorize("admin"),

  deleteProduct
);

// =====================================================
// STOCK IN
// =====================================================

// POST /api/products/:id/stock-in
router.post(
  "/:id/stock-in",

  authorize(
    "admin",
    "manager",
    "staff"
  ),

  stockIn
);

// =====================================================
// STOCK OUT
// =====================================================

// POST /api/products/:id/stock-out
router.post(
  "/:id/stock-out",

  authorize(
    "admin",
    "manager",
    "staff"
  ),

  stockOut
);

// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;