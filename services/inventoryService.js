const Product = require("../models/Product");
const StockMovement = require("../models/StockMovement");

const stockIn = async ({ productId, quantity, reason, performedBy }) => {
    const parsedQuantity = Number(quantity);

    if (!productId) {
        const error = new Error("Product ID is required");
        error.status = 400;
        throw error;
    }

    if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
        const error = new Error("Quantity must be greater than zero");
        error.status = 400;
        throw error;
    }

    const product = await Product.findById(productId);

    if (!product) {
        const error = new Error("Product not found");
        error.status = 404;
        throw error;
    }

    const previousQuantity = product.quantity;
    product.quantity += parsedQuantity;
    await product.save();

    const movement = await StockMovement.create({
        product: product._id,
        type: "stock-in",
        quantity: parsedQuantity,
        previousQuantity,
        newQuantity: product.quantity,
        reason,
        performedBy,
    });

    return { product, movement };
};

const stockOut = async ({ productId, quantity, reason, performedBy }) => {
    const parsedQuantity = Number(quantity);

    if (!productId) {
        const error = new Error("Product ID is required");
        error.status = 400;
        throw error;
    }

    if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
        const error = new Error("Quantity must be greater than zero");
        error.status = 400;
        throw error;
    }

    const product = await Product.findById(productId);

    if (!product) {
        const error = new Error("Product not found");
        error.status = 404;
        throw error;
    }

    if (product.quantity < parsedQuantity) {
        const error = new Error("Insufficient stock");
        error.status = 400;
        error.availableStock = product.quantity;
        throw error;
    }

    const previousQuantity = product.quantity;
    product.quantity -= parsedQuantity;
    await product.save();

    const movement = await StockMovement.create({
        product: product._id,
        type: "stock-out",
        quantity: parsedQuantity,
        previousQuantity,
        newQuantity: product.quantity,
        reason,
        performedBy,
    });

    return { product, movement };
};

module.exports = {
    stockIn,
    stockOut,
};
