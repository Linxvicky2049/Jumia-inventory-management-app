const Product = require("../models/Product");
const StockMovement = require("../models/StockMovement");

const { generateSKU } = require("../utilities/generateSKU");

const {
  stockIn,
  stockOut,
} = require("../services/inventoryService");

const {
  uploadToCloudinary,
} = require("../middleware/uploads");

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

    const itemsPerPage = Math.min(
      Math.max(Number(limit), 1),
      100
    );

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
    // Do not allow normal update endpoint
    // to manipulate quantity or SKU.

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
// BULK UPDATE PRODUCT IMAGES USING CLOUDINARY URLS
// =====================================================

const bulkUpdateProductImages = async (
  req,
  res,
  next
) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products)) {
      return res.status(400).json({
        success: false,
        message: "products must be an array",
      });
    }

    if (products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "products array cannot be empty",
      });
    }

    if (products.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Maximum of 100 products per request",
      });
    }

    const updated = [];
    const notFound = [];
    const failed = [];

    for (const item of products) {
      const { sku, id, image } = item;

      if (!sku && !id) {
        failed.push({
          sku: null,
          id: null,
          reason: "SKU or product ID is required",
        });

        continue;
      }

      if (!image) {
        failed.push({
          sku,
          id,
          reason: "Image URL is required",
        });

        continue;
      }

      if (!/^https?:\/\/.+/i.test(image)) {
        failed.push({
          sku,
          id,
          reason: "Invalid image URL",
        });

        continue;
      }

      try {
        const query = sku
          ? { sku }
          : { _id: id };

        const product =
          await Product.findOneAndUpdate(
            query,
            {
              $set: {
                image,
              },
            },
            {
              new: true,
              runValidators: true,
            }
          )
            .populate("category", "name")
            .populate("supplier", "companyName");

        if (!product) {
          notFound.push({
            sku,
            id,
          });

          continue;
        }

        updated.push({
          id: product._id,
          sku: product.sku,
          name: product.name,
          image: product.image,
        });
      } catch (error) {
        failed.push({
          sku,
          id,
          reason: error.message,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "Product image bulk update completed",

      summary: {
        requested: products.length,
        updated: updated.length,
        notFound: notFound.length,
        failed: failed.length,
      },

      updated,
      notFound,
      failed,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// STOCK IN
// =====================================================

const stockInController = async (
  req,
  res,
  next
) => {
  try {
    const { quantity, reason } = req.body;

    const parsedQuantity = Number(quantity);

    if (
      !Number.isInteger(parsedQuantity) ||
      parsedQuantity <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Quantity must be a positive whole number",
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

const stockOutController = async (
  req,
  res,
  next
) => {
  try {
    const { quantity, reason } = req.body;

    const parsedQuantity = Number(quantity);

    if (
      !Number.isInteger(parsedQuantity) ||
      parsedQuantity <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Quantity must be a positive whole number",
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

const getStockMovements = async (
  req,
  res,
  next
) => {
  try {
    const movements =
      await StockMovement.find({
        product: req.params.id,
      })
        .populate(
          "performedBy",
          "name email role"
        )
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

const getLowStock = async (
  req,
  res,
  next
) => {
  try {
    const products = await Product.find({
      $expr: {
        $lte: [
          "$quantity",
          "$minimumStock",
        ],
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

// =====================================================
// UPLOAD SINGLE PRODUCT IMAGE
// =====================================================

const uploadProductImage = async (
  req,
  res,
  next
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Product image is required",
      });
    }

    const product =
      await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const imageUrl =
      await uploadToCloudinary(req.file);

    product.image = imageUrl;

    await product.save();

    const updatedProduct =
      await Product.findById(product._id)
        .populate("category", "name")
        .populate("supplier", "companyName");

    res.status(200).json({
      success: true,
      message:
        "Product image uploaded successfully",

      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// BULK UPLOAD PRODUCT IMAGES
// =====================================================

const bulkUploadProductImages = async (
  req,
  res,
  next
) => {
  try {
    // -------------------------------------------------
    // Validate products field
    // -------------------------------------------------

    if (!req.body.products) {
      return res.status(400).json({
        success: false,
        message: "products field is required",
      });
    }

    // -------------------------------------------------
    // Parse products JSON
    // -------------------------------------------------

    let productMappings;

    try {
      productMappings =
        typeof req.body.products === "string"
          ? JSON.parse(req.body.products)
          : req.body.products;
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          "products must contain valid JSON",
      });
    }

    // -------------------------------------------------
    // Validate products array
    // -------------------------------------------------

    if (!Array.isArray(productMappings)) {
      return res.status(400).json({
        success: false,
        message: "products must be an array",
      });
    }

    if (productMappings.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "products array cannot be empty",
      });
    }

    if (productMappings.length > 100) {
      return res.status(400).json({
        success: false,
        message:
          "Maximum of 100 products per request",
      });
    }

    // -------------------------------------------------
    // Validate uploaded files
    // -------------------------------------------------

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "At least one image is required",
      });
    }

    if (req.files.length > 100) {
      return res.status(400).json({
        success: false,
        message:
          "Maximum of 100 images per request",
      });
    }

    // -------------------------------------------------
    // Product/image count must match
    // -------------------------------------------------

    if (
      productMappings.length !==
      req.files.length
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Number of products must match number of images",

        productsReceived:
          productMappings.length,

        imagesReceived:
          req.files.length,
      });
    }

    // -------------------------------------------------
    // Validate mappings
    // -------------------------------------------------

    const usedProducts = new Set();
    const usedFileIndexes = new Set();

    for (const item of productMappings) {
      if (
        !item ||
        typeof item !== "object"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Each product mapping must be an object",
        });
      }

      // SKU OR ID
      if (!item.sku && !item.id) {
        return res.status(400).json({
          success: false,
          message:
            "Every product mapping must contain either sku or id",
        });
      }

      // fileIndex
      if (
        item.fileIndex === undefined ||
        item.fileIndex === null
      ) {
        return res.status(400).json({
          success: false,
          message:
            "fileIndex is required for every product",
        });
      }

      const fileIndex = Number(
        item.fileIndex
      );

      if (
        !Number.isInteger(fileIndex) ||
        fileIndex < 0 ||
        fileIndex >= req.files.length
      ) {
        return res.status(400).json({
          success: false,
          message:
            `Invalid fileIndex ${item.fileIndex}`,
        });
      }

      // Product identifier
      const productIdentifier =
        item.sku || item.id;

      if (
        usedProducts.has(productIdentifier)
      ) {
        return res.status(400).json({
          success: false,
          message:
            `Duplicate product mapping: ${productIdentifier}`,
        });
      }

      // Duplicate file
      if (
        usedFileIndexes.has(fileIndex)
      ) {
        return res.status(400).json({
          success: false,
          message:
            `Duplicate fileIndex: ${fileIndex}`,
        });
      }

      usedProducts.add(
        productIdentifier
      );

      usedFileIndexes.add(fileIndex);
    }

    // -------------------------------------------------
    // Results
    // -------------------------------------------------

    const uploaded = [];
    const notFound = [];
    const failed = [];

    // -------------------------------------------------
    // Process each image
    // -------------------------------------------------

    for (const mapping of productMappings) {
      const fileIndex = Number(
        mapping.fileIndex
      );

      const file =
        req.files[fileIndex];

      try {
        // ---------------------------------------------
        // Find product by SKU OR ID
        // ---------------------------------------------

        let product;

        if (mapping.sku) {
          product =
            await Product.findOne({
              sku: mapping.sku,
            });
        } else {
          product =
            await Product.findById(
              mapping.id
            );
        }

        // ---------------------------------------------
        // Product not found
        // ---------------------------------------------

        if (!product) {
          notFound.push({
            sku: mapping.sku || null,
            id: mapping.id || null,

            fileIndex,

            fileName:
              file.originalname,

            reason:
              "Product not found",
          });

          continue;
        }

        // ---------------------------------------------
        // Upload image to Cloudinary
        // ---------------------------------------------

        const imageUrl =
          await uploadToCloudinary(file);

        // ---------------------------------------------
        // Save image URL to MongoDB
        // ---------------------------------------------

        product.image = imageUrl;

        await product.save();

        // ---------------------------------------------
        // Success
        // ---------------------------------------------

        uploaded.push({
          id: product._id,

          sku: product.sku,

          name: product.name,

          fileIndex,

          fileName:
            file.originalname,

          image: imageUrl,
        });
      } catch (error) {
        failed.push({
          sku: mapping.sku || null,

          id: mapping.id || null,

          fileIndex,

          fileName:
            file?.originalname || null,

          reason: error.message,
        });
      }
    }

    // -------------------------------------------------
    // Final response
    // -------------------------------------------------

    res.status(200).json({
      success: true,

      message:
        "Bulk product image upload completed",

      summary: {
        requested:
          productMappings.length,

        imagesReceived:
          req.files.length,

        uploaded:
          uploaded.length,

        notFound:
          notFound.length,

        failed:
          failed.length,
      },

      uploaded,

      notFound,

      failed,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// EXPORTS
// =====================================================

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

  bulkUpdateProductImages,

  uploadProductImage,

  bulkUploadProductImages,
};