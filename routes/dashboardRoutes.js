const express = require("express");

const {
  getDashboard,
} = require("../controllers/dashboardController");

const {
  protect,
  authorize,
} = require("../middleware/auth");

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  authorize("admin", "manager"),
  getDashboard
);

module.exports = router;