const router = require("express").Router();
const middleware = require("../middleware/index");
const SalonModel = require("../models/salon-model");

// Create a new salon
router.post("/create-salon", middleware, async (req, res) => {
  try {
    await SalonModel.create(req.body);
    return res.status(201).json({
      success: true,
      message: "Salon created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get all salons by owner ID
router.get("/get-salons-by-owner", middleware, async (req, res) => {
  try {
    const ownerId = req.userId;
    const salons = await SalonModel.find({ owner: ownerId }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: salons,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// get salon by ID
router.get("/get-salon-by-id/:id", middleware, async (req, res) => {
  try {
    const salonId = req.params.id;
    const salon = await SalonModel.findById(salonId);
    if (!salon) {
      return res.status(404).json({
        success: false,
        message: "Salon not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: salon,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// delete salon by ID
router.delete("/delete-salon-by-id/:id", middleware, async (req, res) => {
  try {
    const salonId = req.params.id;
    const salon = await SalonModel.findById(salonId);
    if (!salon) {
      return res.status(404).json({
        success: false,
        message: "Salon not found",
      });
    }
    await SalonModel.findByIdAndDelete(salonId);
    return res.status(200).json({
      success: true,
      message: "Salon deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// update salon by ID
router.put("/update-salon-by-id/:id", middleware, async (req, res) => {
  try {
    const salonId = req.params.id;
    const salon = await SalonModel.findById(salonId);
    if (!salon) {
      return res.status(404).json({
        success: false,
        message: "Salon not found",
      });
    }
    const updatedSalon = await SalonModel.findByIdAndUpdate(salonId, req.body, {
      new: true,
    });

    return res.status(200).json({
      success: true,
      message: "Salon updated successfully",
      data: updatedSalon,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// get all salons (public route)
router.get("/get-all-salons", async (req, res) => {
  try {
    const salons = await SalonModel.find({ isActive: true });
    return res.status(200).json({
      success: true,
      data: salons,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
