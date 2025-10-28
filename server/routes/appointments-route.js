const router = require("express").Router();
const AppointmentModel = require("../models/appointment-model");
const middleware = require("../middleware/index");
const SalonModel = require("../models/salon-model");

router.post("/book-appointment", middleware, async (req, res) => {
  try {
    await AppointmentModel.create(req.body);
    return res.status(200).json({
      success: true,
      message: "Appointment booked successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/get-appointments-by-user", middleware, async (req, res) => {
  try {
    const userId = req.userId;
    const appointments = await AppointmentModel.find({ user: userId })
      .populate("salon")
      .sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/get-salon-availability", middleware, async (req, res) => {
  try {
    const { salonId, date, time } = req.body;
    const salonData = await SalonModel.findById(salonId);
    if (!salonData) {
      return res
        .status(404)
        .json({ success: false, message: "Salon not found" });
    }

    const appointmentsBookedInGivenDateTime = await AppointmentModel.find({
      salon: salonId,
      date: date,
      time: time,
      status: "booked",
    });

    if (
      appointmentsBookedInGivenDateTime.length >= salonData.maxBookingsPerSlot
    ) {
      return res.status(200).json({
        success: false,
        message: "No slots available for the selected date and time",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Slots available for the selected date and time",
      data:
        salonData.maxBookingsPerSlot - appointmentsBookedInGivenDateTime.length,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/update-appointment/:id", middleware, async (req, res) => {
  try {
    const appointmentId = req.params.id;
    await AppointmentModel.findByIdAndUpdate(appointmentId, req.body);
    return res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/get-appointments-by-owner", middleware, async (req, res) => {
  try {
    const userId = req.userId;
    const queryParams = req.query;
    let filter = {};
    if (queryParams.salonId && queryParams.salonId !== "all") {
      filter.salon = queryParams.salonId;
    }

    if (queryParams.date) {
      filter.date = queryParams.date;
    }
    const appointments = await AppointmentModel.find({
      owner: userId,
      ...filter,
    })
      .populate("user")
      .populate("user")
      .populate("salon")
      .sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/get-unique-customers", middleware, async (req, res) => {
  try {
    const ownerId = req.userId;
    const appointments = await AppointmentModel.find({ owner: ownerId })
      .populate("user")
      .sort({ createdAt: -1 });

    const uniqueCustomers = [];
    appointments.forEach((appointment) => {
      if (
        !uniqueCustomers.some(
          (cus) => cus._id.toString() === appointment.user._id.toString()
        )
      ) {
        uniqueCustomers.push(appointment.user);
      }
    });

    return res.status(200).json({
      success: true,
      data: uniqueCustomers,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
