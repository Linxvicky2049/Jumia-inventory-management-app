const multer = require("multer");
const cloudinary = require("../config/cloudinaryConfig");

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Only image files are allowed"), false);
        }
        cb(null, true);
    },
});

const uploadToCloudinary = async (file) => {
    if (!file || !file.buffer) {
        throw new Error("No file buffer provided");
    }

    const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "jumia-inventory",
                transformation: [{ width: 1200, height: 1200, crop: "limit" }],
            },
            (error, uploaded) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(uploaded);
            }
        );

        stream.end(file.buffer);
    });

    return result.secure_url;
};

module.exports = {
    upload,
    uploadToCloudinary,
};