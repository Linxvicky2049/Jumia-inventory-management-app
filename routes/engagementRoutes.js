const express = require("express");
const { protect } = require("../middleware/auth");
const {
  getEngagement,
  likeChannel,
  giftTokens,
  completeMission,
  purchaseTokens,
  purchaseItem,
} = require("../controllers/engagementController");

const router = express.Router();
router.use(protect);
router.get("/", getEngagement);
router.post("/channel/like", likeChannel);
router.post("/channel/gift", giftTokens);
router.post("/missions/:id/complete", completeMission);
router.post("/tokens/purchase", purchaseTokens);
router.post("/store/:id/purchase", purchaseItem);

module.exports = router;