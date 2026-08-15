const notFound = (req, res, next) => {
    const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
    error.status = 404;
    next(error);
};

const errorHandler = (err, req, res, next) => {
    const statusCode = err.status || err.statusCode || 500;
    const message = err.message || "Internal server error";

    console.error("ERROR:", err);

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
    });
};

module.exports = {
    notFound,
    errorHandler,
};
