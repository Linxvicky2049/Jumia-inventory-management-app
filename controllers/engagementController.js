const LiveChannel = require("../models/LiveChannel");
const User = require("../models/User");

const missions = [
  { id: "warm-welcome", title: "Warm welcome", description: "Send 25 likes to the live channel", reward: 80, xp: 40, trophy: "wood" },
  { id: "chat-spark", title: "Chat spark", description: "Return to the live room three times", reward: 140, xp: 70, trophy: "copper" },
  { id: "supporter", title: "Supporter", description: "Gift 500 tokens to the channel", reward: 300, xp: 150, trophy: "bronze" },
  { id: "community-hero", title: "Community hero", description: "Complete five viewer missions", reward: 700, xp: 350, trophy: "silver" },
];

const storeItems = [
  { id: "golden-crown", name: "Golden Crown", type: "avatar", price: 900, accent: "gold", description: "A 3D crown effect for your viewer profile." },
  { id: "neon-orbit", name: "Neon Orbit", type: "frame", price: 650, accent: "cyan", description: "A luminous profile frame with a moving orbit." },
  { id: "diamond-burst", name: "Diamond Burst", type: "reaction", price: 1200, accent: "diamond", description: "A premium reaction effect for big moments." },
  { id: "silver-mic", name: "Silver Mic", type: "badge", price: 400, accent: "silver", description: "A polished supporter badge beside your name." },
];

const getChannel = async () => {
  let channel = await LiveChannel.findOne().sort({ createdAt: 1 });
  if (!channel) {
    channel = await LiveChannel.create({
      title: "Warehouse After Hours",
      hostName: "Jumia Live Team",
      category: "Inventory drops",
      viewers: 1284,
      likes: 18420,
    });
  }
  return channel;
};

const levelFor = (xp) => Math.max(1, Math.floor(xp / 500) + 1);

const getEngagement = async (req, res, next) => {
  try {
    const [channel, user] = await Promise.all([getChannel(), User.findById(req.user._id)]);
    res.json({ success: true, channel, missions, storeItems, profile: user.engagement || {} });
  } catch (error) {
    next(error);
  }
};

const likeChannel = async (req, res, next) => {
  try {
    const [channel, user] = await Promise.all([
      getChannel(),
      User.findById(req.user._id),
    ]);
    channel.likes += 1;
    user.engagement ||= {};
    user.engagement.points = (user.engagement.points || 0) + 2;
    user.engagement.tokens = (user.engagement.tokens || 0) + 1;
    user.engagement.xp = (user.engagement.xp || 0) + 1;
    user.engagement.level = levelFor(user.engagement.xp);
    await Promise.all([channel.save(), user.save()]);
    res.json({
      success: true,
      likes: channel.likes,
      reward: { points: 2, tokens: 1 },
      profile: user.engagement,
      message: "Like sent. +1 token and +2 points",
    });
  } catch (error) {
    next(error);
  }
};

const giftTokens = async (req, res, next) => {
  try {
    const amount = Number(req.body.amount);
    if (!Number.isInteger(amount) || amount < 10 || amount > 10000) {
      return res.status(400).json({ success: false, message: "Gift amount must be between 10 and 10,000 tokens" });
    }
    const user = await User.findById(req.user._id);
    user.engagement ||= {};
    if (user.engagement.tokens < amount) return res.status(400).json({ success: false, message: "Not enough tokens" });
    const channel = await getChannel();
    user.engagement.tokens -= amount;
    user.engagement.points = (user.engagement.points || 0) + Math.floor(amount / 10);
    user.engagement.xp = (user.engagement.xp || 0) + Math.floor(amount / 20);
    user.engagement.level = levelFor(user.engagement.xp);
    channel.likes += Math.floor(amount / 100);
    await Promise.all([user.save(), channel.save()]);
    res.json({ success: true, message: `You sent ${amount} tokens to ${channel.hostName}`, profile: user.engagement });
  } catch (error) {
    next(error);
  }
};

const completeMission = async (req, res, next) => {
  try {
    const mission = missions.find((item) => item.id === req.params.id);
    if (!mission) return res.status(404).json({ success: false, message: "Mission not found" });
    const user = await User.findById(req.user._id);
    user.engagement ||= {};
    user.engagement.completedMissions ||= [];
    if (user.engagement.completedMissions.some((item) => item.missionId === mission.id)) {
      return res.status(409).json({ success: false, message: "Mission already completed" });
    }
    user.engagement.points += mission.reward;
    user.engagement.xp += mission.xp;
    user.engagement.tokens += Math.floor(mission.reward / 10);
    user.engagement.level = levelFor(user.engagement.xp);
    user.engagement.completedMissions.push({ missionId: mission.id });
    user.engagement.trophies.push({ tier: mission.trophy, name: mission.title });
    await user.save();
    res.json({ success: true, message: `${mission.title} completed`, reward: mission, profile: user.engagement });
  } catch (error) {
    next(error);
  }
};

const purchaseTokens = async (req, res, next) => {
  try {
    const packs = { starter: 500, creator: 1500, champion: 4000 };
    const tokens = packs[req.body.pack];
    if (!tokens) return res.status(400).json({ success: false, message: "Invalid token pack" });
    const user = await User.findById(req.user._id);
    user.engagement ||= {};
    user.engagement.tokens += tokens;
    await user.save();
    res.json({ success: true, message: `${tokens} tokens added`, tokens: user.engagement.tokens });
  } catch (error) {
    next(error);
  }
};

const purchaseItem = async (req, res, next) => {
  try {
    const item = storeItems.find((storeItem) => storeItem.id === req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Store item not found" });
    const user = await User.findById(req.user._id);
    user.engagement ||= {};
    if (user.engagement.tokens < item.price) return res.status(400).json({ success: false, message: "Not enough tokens" });
    if (user.engagement.ownedItems.some((owned) => owned.itemId === item.id)) return res.status(409).json({ success: false, message: "Item already owned" });
    user.engagement.tokens -= item.price;
    user.engagement.ownedItems.push({ itemId: item.id, applied: true });
    await user.save();
    res.json({ success: true, message: `${item.name} added to your profile`, profile: user.engagement });
  } catch (error) {
    next(error);
  }
};

module.exports = { getEngagement, likeChannel, giftTokens, completeMission, purchaseTokens, purchaseItem };