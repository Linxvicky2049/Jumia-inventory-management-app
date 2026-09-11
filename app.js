const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");

dotenv.config();

const connectDB = require("./config/databaseConfig");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productroutes");
const categoryRoutes = require("./routes/categoryRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const engagementRoutes = require("./routes/engagementRoutes");


const app = express();

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests from this IP, please try again later.",
    },
});

// ===============================
// Middleware
// ===============================

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/api", apiLimiter);

// ===============================
// Health Check
// ===============================

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Jumia Inventory Management API is running",
    });
});

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is healthy",
        database: "MongoDB",
    });
});

// ===============================
// API Routes
// ===============================

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/engagement", engagementRoutes);

// ===============================
// Error Handling
// ===============================

app.use(notFound);
app.use(errorHandler);

// ===============================
// Start Server
// ===============================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

if (require.main === module) {
    startServer();
} else if (mongoose.connection.readyState === 0) {
    connectDB().catch((error) => {
        console.error("Database connection failed during app import:", error.message);
    });
}

module.exports = app;