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

const supplierValidation = [
    body("companyName")
        .trim()
        .notEmpty()
        .withMessage("Company name is required")
        .isLength({ min: 2, max: 200 })
        .withMessage("Company name must be between 2 and 200 characters"),

    body("contactPerson")
        .optional({ values: "falsy" })
        .trim()
        .isLength({ max: 100 })
        .withMessage("Contact person cannot exceed 100 characters"),

    body("phone")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required")
        .isLength({ min: 7, max: 20 })
        .withMessage("Phone number must be between 7 and 20 characters"),

    body("email")
        .optional({ values: "falsy" })
        .trim()
        .isEmail()
        .withMessage("Please enter a valid email address")
        .normalizeEmail(),

    body("address")
        .optional({ values: "falsy" })
        .trim()
        .isLength({ max: 500 })
        .withMessage("Address cannot exceed 500 characters"),

    handleValidationErrors,
];

module.exports = {
    supplierValidation,
};
