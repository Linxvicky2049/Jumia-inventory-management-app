const Product = require("../models/Product");
const StockMovement = require("../models/StockMovement");
const { generateSKU } = require("../utilities/generateSKU");
const { stockIn, stockOut } = require("../services/inventoryService");

const createProduct = async (req, res, next) => {
  try {
    const productData = {
      ...req.body,
      sku: req.body.sku || generateSKU(req.body.name, req.body.category),
    };

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const { search, category, status, lowStock, page = 1, limit = 20 } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
        { barcode: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (status) {
      filter.status = status;
    }

    if (lowStock === "true") {
      filter.$expr = {
        $lte: ["$quantity", "$minimumStock"],
      };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("category", "name")
        .populate("supplier", "companyName")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      products,
    });
  } catch (error) {
    next(error);
  }
};

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

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

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

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

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

const stockInController = async (req, res, next) => {
  try {
    const { quantity, reason } = req.body;

    const result = await stockIn({
      productId: req.params.id,
      quantity,
      reason,
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

const stockOutController = async (req, res, next) => {
  try {
    const { quantity, reason } = req.body;

    const result = await stockOut({
      productId: req.params.id,
      quantity,
      reason,
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

const getStockMovements = async (req, res, next) => {
  try {
    const movements = await StockMovement.find({ product: req.params.id })
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

const getLowStock = async (req, res, next) => {
  try {
    const products = await Product.find({
      $expr: { $lte: ["$quantity", "$minimumStock"] },
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
