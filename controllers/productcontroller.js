const Product = require("../models/Product");
const StockMovement = require("../models/StockMovement");

const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

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
    const {
      search,
      category,
      status,
      lowStock,
      page = 1,
      limit = 20,
    } = req.query;

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
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

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

const stockIn = async (req, res, next) => {
  try {
    const { quantity, reason } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than zero",
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const previousQuantity = product.quantity;

    product.quantity += Number(quantity);

    await product.save();

    const movement = await StockMovement.create({
      product: product._id,
      type: "stock-in",
      quantity,
      previousQuantity,
      newQuantity: product.quantity,
      reason,
      performedBy: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: "Stock added successfully",
      product,
      movement,
    });
  } catch (error) {
    next(error);
  }
};

const stockOut = async (req, res, next) => {
  try {
    const { quantity, reason } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than zero",
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.quantity < Number(quantity)) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
        availableStock: product.quantity,
      });
    }

    const previousQuantity = product.quantity;

    product.quantity -= Number(quantity);

    await product.save();

    const movement = await StockMovement.create({
      product: product._id,
      type: "stock-out",
      quantity,
      previousQuantity,
      newQuantity: product.quantity,
      reason,
      performedBy: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: "Stock removed successfully",
      product,
      movement,
    });
  } catch (error) {
    next(error);
  }
};

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
  stockIn,
  stockOut,
  getStockMovements,
  getLowStock,
};