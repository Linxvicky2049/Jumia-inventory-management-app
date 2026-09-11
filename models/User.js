const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    address: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ["admin", "manager", "staff"],
      default: "staff",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    engagement: {
      tokens: { type: Number, default: 0, min: 0 },
      points: { type: Number, default: 0, min: 0 },
      level: { type: Number, default: 1, min: 1 },
      xp: { type: Number, default: 0, min: 0 },
      trophies: [
        {
          tier: {
            type: String,
            enum: ["wood", "copper", "bronze", "silver", "gold", "platinum", "diamond"],
          },
          name: String,
          earnedAt: { type: Date, default: Date.now },
        },
      ],
      ownedItems: [
        {
          itemId: String,
          purchasedAt: { type: Date, default: Date.now },
          applied: { type: Boolean, default: false },
        },
      ],
      completedMissions: [
        { missionId: String, completedAt: { type: Date, default: Date.now } },
      ],
    },
  },
  {
    timestamps: true,
  }
);
// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);