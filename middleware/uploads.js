const multer = require("multer");
const path = require("path");
const {cloudinarystorage} = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinaryConfig");
const { param } = require("../routes/supplierRoutes");

const storage = new cloudinarystorage({
    cloudinary: cloudinary,
   params: {
        folder: "superbase-marketplace",
        allowedFormats: ["jpg", "jpeg", "png", "gif"],
        transformation: [{ width: 500, height: 500, crop: "limit" }],
    },
});