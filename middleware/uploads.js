const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

// =====================================================
// CLOUDINARY CONFIGURATION
// =====================================================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// =====================================================
// TEMP UPLOAD DIRECTORY
// =====================================================

const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

// =====================================================
// MULTER STORAGE
// =====================================================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname).toLowerCase();

    const safeName =
      path
        .basename(file.originalname, extension)
        .replace(/[^a-zA-Z0-9-_]/g, "-");

    cb(
      null,
      `${Date.now()}-${safeName}${extension}`
    );
  },
});

// =====================================================
// IMAGE FILE FILTER
// =====================================================

const fileFilter = function (req, file, cb) {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/bmp",
    "image/tiff",
    "image/x-citrix-jpeg",
    "image/pjpeg",
  ];

  const allowedExtensions = [
    ".jpg",
    ".jpeg",
    ".jfif",
    ".png",
    ".webp",
    ".gif",
    ".bmp",
    ".tif",
    ".tiff",
  ];

  const extension = path
    .extname(file.originalname)
    .toLowerCase();

  const mimeType = (file.mimetype || "").toLowerCase();

  const validExtension =
    allowedExtensions.includes(extension);

  const validMimeType =
    allowedMimeTypes.includes(mimeType);

  // Accept if either the extension OR MIME type
  // identifies the file as an image.
  if (validExtension || validMimeType) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Only image files are allowed. Received: ${file.originalname} (${file.mimetype})`
      ),
      false
    );
  }
};

// =====================================================
// MULTER INSTANCE
// =====================================================

const upload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB per image
    files: 100,
  },
});

// =====================================================
// CLOUDINARY UPLOAD
// =====================================================

const uploadToCloudinary = async (file) => {
  if (!file) {
    throw new Error("No image file provided");
  }

  const result = await cloudinary.uploader.upload(
    file.path,
    {
      folder: "TS.ACAD-INVENTORY",
      resource_type: "image",
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    }
  );

  // Delete temporary local file
  try {
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
  } catch (deleteError) {
    console.error(
      "Could not delete temporary file:",
      deleteError.message
    );
  }

  return result.secure_url;
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  upload,
  uploadToCloudinary,
};