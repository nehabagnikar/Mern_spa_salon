const mongoose = require("mongoose");

const salonSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    zip: {
      type: String,
      required: true,
      trim: true,
    },
    minimumServicePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    maximumServicePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    offerStatus: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    workingDays: {
      type: [String],
      required: true,
      default: [],
    },
    startTime: {
      type: String,
      required: true,
      trim: true,
    },
    endTime: {
      type: String,
      required: true,
      trim: true,
    },
    breakStartTime: {
      type: String,
      required: true,
      trim: true,
    },
    breakEndTime: {
      type: String,
      required: true,
      trim: true,
    },
    slotDuration: {
      type: Number,
      required: true,
      min: 1,
    },
    maxBookingsPerSlot: {
      type: Number,
      required: true,
      min: 1,
    },
    locationInMap: {
      type: Object,
      required: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const SalonModel = mongoose.model("salons", salonSchema);
module.exports = SalonModel;
