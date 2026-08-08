const Product = require("../models/Product");
const Category = require("../models/Category");
const Supplier = require("../models/Supplier");
const User = require("../models/User");
const StockMovement = require("../models/StockMovement");

const getDashboard = async (req, res, next) => {
  try {
    const [
      totalProducts,
      totalCategories,
      totalSuppliers,
      totalUsers,
      lowStock,
      outOfStock,
      recentMovements,
    ] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      Supplier.countDocuments(),
      User.countDocuments(),

      Product.countDocuments({
        $expr: {
          $lte: ["$quantity", "$minimumStock"],
        },
      }),

      Product.countDocuments({
        quantity: 0,
      }),

      StockMovement.find()
        .populate("product", "name sku")
        .populate("performedBy", "name email")
        .sort({ createdAt: -1 })
        .limit(10),
    ]);

    res.status(200).json({
      success: true,

      dashboard: {
        totalProducts,
        totalCategories,
        totalSuppliers,
        totalUsers,
        lowStock,
        outOfStock,
      },

      recentMovements,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
};