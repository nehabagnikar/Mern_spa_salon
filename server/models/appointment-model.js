const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    salon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "salons",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    date : {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    status : {
        type: String,
        enum: ["booked", "completed", "cancelled"],
    }
  },
  { timestamps: true }
);

const AppointmentModel = mongoose.model("appointments", appointmentSchema);

module.exports = AppointmentModel;
