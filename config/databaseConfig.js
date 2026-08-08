const dns = require("dns");
const mongoose = require("mongoose");

// Use public DNS resolvers for SRV lookups when the system resolver is unreliable.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

dns.setDefaultResultOrder("ipv4first");

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;

        if (!mongoURI) {
            throw new Error("MONGODB_URI is not defined in .env");
        }

        const conn = await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            family: 4,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log(`Database: ${conn.connection.name}`);

        return conn;
    } catch (error) {
        console.error("MongoDB Connection Error:", error.message);
        throw error;
    }
};

module.exports = connectDB;