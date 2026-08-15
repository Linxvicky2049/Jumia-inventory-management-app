const Product = require("../models/Product");
const StockMovement = require("../models/StockMovement");
const { generateSKU } = require("../utilities/generateSKU");
const { stockIn, stockOut } = require("../services/inventoryService");

// =====================================================
// CREATE PRODUCT
// =====================================================
const createProduct = async (req, res, next) => {
  try {
    const productData = {
      ...req.body,
      sku:
        req.body.sku ||
        generateSKU(req.body.name, req.body.category),
    };

    const product = await Product.create(productData);

    const populatedProduct = await Product.findById(product._id)
      .populate("category", "name")
      .populate("supplier", "companyName");

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: populatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// GET ALL PRODUCTS
// =====================================================
const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      supplier,
      status,
      lowStock,
      page = 1,
      limit = 20,
    } = req.query;

    const currentPage = Math.max(Number(page), 1);
    const itemsPerPage = Math.min(Math.max(Number(limit), 1), 100);

    const filter = {};

    // Search
    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          sku: {
            $regex: search,
            $options: "i",
          },
        },
        {
          barcode: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Category
    if (category) {
      filter.category = category;
    }

    // Supplier
    if (supplier) {
      filter.supplier = supplier;
    }

    // Status
    if (status) {
      filter.status = status;
    }

    // Low stock
    if (lowStock === "true") {
      filter.$expr = {
        $lte: ["$quantity", "$minimumStock"],
      };
    }

    const skip = (currentPage - 1) * itemsPerPage;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("category", "name")
        .populate("supplier", "companyName")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(itemsPerPage),

      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: currentPage,
      limit: itemsPerPage,
      pages: Math.ceil(total / itemsPerPage),
      products,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// GET SINGLE PRODUCT
// =====================================================
const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name")
      .populate("supplier", "companyName");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// UPDATE PRODUCT
// =====================================================
const updateProduct = async (req, res, next) => {
  try {
    // Do not allow clients to manipulate these through
    // the normal product update endpoint.
    delete req.body.quantity;
    delete req.body.sku;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("category", "name")
      .populate("supplier", "companyName");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// DELETE PRODUCT
// =====================================================
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// STOCK IN
// =====================================================
const stockInController = async (req, res, next) => {
  try {
    const { quantity, reason } = req.body;

    const parsedQuantity = Number(quantity);

    if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive whole number",
      });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const result = await stockIn({
      productId: req.params.id,
      quantity: parsedQuantity,
      reason: reason || "Stock received",
      performedBy: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: "Stock added successfully",
      product: result.product,
      movement: result.movement,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// STOCK OUT
// =====================================================
const stockOutController = async (req, res, next) => {
  try {
    const { quantity, reason } = req.body;

    const parsedQuantity = Number(quantity);

    if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive whole number",
      });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const result = await stockOut({
      productId: req.params.id,
      quantity: parsedQuantity,
      reason: reason || "Stock issued",
      performedBy: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: "Stock removed successfully",
      product: result.product,
      movement: result.movement,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// GET STOCK MOVEMENTS
// =====================================================
const getStockMovements = async (req, res, next) => {
  try {
    const movements = await StockMovement.find({
      product: req.params.id,
    })
      .populate("performedBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: movements.length,
      movements,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// GET LOW STOCK PRODUCTS
// =====================================================
const getLowStock = async (req, res, next) => {
  try {
    const products = await Product.find({
      $expr: {
        $lte: ["$quantity", "$minimumStock"],
      },
      status: "active",
    })
      .populate("category", "name")
      .populate("supplier", "companyName")
      .sort({ quantity: 1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  stockIn: stockInController,
  stockOut: stockOutController,
  getStockMovements,
  getLowStock,
};