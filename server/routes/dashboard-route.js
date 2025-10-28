const router = require("express").Router();
const AppointmentModel = require("../models/appointment-model");
const middleware = require("../middleware/index");
const dayjs = require("dayjs");

router.get("/user-appointments", middleware, async (req, res) => {
  try {
    const userId = req.userId;
    const appointments = await AppointmentModel.find({ user: userId }).sort({
      createdAt: -1,
    });

    const resultData = {
      totalAppointments: appointments.length,
      upcomingAppointments: appointments.filter(
        (appointment) =>
          dayjs(appointment.date).isAfter(dayjs()) &&
          appointment.status !== "cancelled"
      ).length,
      completedAppointments: appointments.filter(
        (appointment) => appointment.status === "completed"
      ).length,
      cancelledAppointments: appointments.filter(
        (appointment) => appointment.status === "cancelled"
      ).length,
    };

    return res.status(200).json({
      success: true,
      data: resultData,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/owner-appointments", middleware, async (req, res) => {
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
    }).sort({
      createdAt: -1,
    });

    const resultData = {
      totalAppointments: appointments.length,
      upcomingAppointments: appointments.filter(
        (appointment) =>
          dayjs(appointment.date).isAfter(dayjs()) &&
          appointment.status !== "cancelled"
      ).length,
      completedAppointments: appointments.filter(
        (appointment) => appointment.status === "completed"
      ).length,
      cancelledAppointments: appointments.filter(
        (appointment) => appointment.status === "cancelled"
      ).length,
    };

    return res.status(200).json({
      success: true,
      data: resultData,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
