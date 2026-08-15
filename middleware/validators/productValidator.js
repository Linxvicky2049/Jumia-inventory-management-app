const { body, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: "Validation failed",
            errors: errors.array().map((error) => ({
                field: error.path,
                message: error.msg,
            })),
        });
    }

    next();
};

const productValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Product name is required")
        .isLength({ min: 2, max: 200 })
        .withMessage("Product name must be between 2 and 200 characters"),

    body("category")
        .notEmpty()
        .withMessage("Category is required"),

    body("price")
        .notEmpty()
        .withMessage("Selling price is required")
        .isFloat({ min: 0 })
        .withMessage("Selling price must be a non-negative number"),

    body("costPrice")
        .notEmpty()
        .withMessage("Cost price is required")
        .isFloat({ min: 0 })
        .withMessage("Cost price must be a non-negative number"),

    body("quantity")
        .optional({ values: "falsy" })
        .isFloat({ min: 0 })
        .withMessage("Quantity must be a non-negative number"),

    body("minimumStock")
        .optional({ values: "falsy" })
        .isFloat({ min: 0 })
        .withMessage("Minimum stock must be a non-negative number"),

    body("status")
        .optional()
        .isIn(["active", "inactive"])
        .withMessage("Status must be active or inactive"),

    handleValidationErrors,
];

const productUpdateValidation = [
    body("name")
        .optional({ values: "falsy" })
        .trim()
        .isLength({ min: 2, max: 200 })
        .withMessage("Product name must be between 2 and 200 characters"),

    body("price")
        .optional({ values: "falsy" })
        .isFloat({ min: 0 })
        .withMessage("Selling price must be a non-negative number"),

    body("costPrice")
        .optional({ values: "falsy" })
        .isFloat({ min: 0 })
        .withMessage("Cost price must be a non-negative number"),

    body("quantity")
        .optional({ values: "falsy" })
        .isFloat({ min: 0 })
        .withMessage("Quantity must be a non-negative number"),

    body("minimumStock")
        .optional({ values: "falsy" })
        .isFloat({ min: 0 })
        .withMessage("Minimum stock must be a non-negative number"),

    body("status")
        .optional()
        .isIn(["active", "inactive"])
        .withMessage("Status must be active or inactive"),

    handleValidationErrors,
];

module.exports = {
    productValidation,
    productUpdateValidation,
};
