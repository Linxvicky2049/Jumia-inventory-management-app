const sendSuccess = (res, statusCode = 200, data = {}) => {
    return res.status(statusCode).json({
        success: true,
        ...data,
    });
};

const sendError = (res, statusCode = 400, message = "Something went wrong", details = null) => {
    const payload = {
        success: false,
        message,
    };

    if (details) {
        payload.details = details;
    }

    return res.status(statusCode).json(payload);
};

module.exports = {
    sendSuccess,
    sendError,
};
