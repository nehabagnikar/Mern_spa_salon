const router = require("express").Router();
const UserModel = require("../models/user-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const middleware = require("../middleware/index");

router.post("/register", async (req, res) => {
  try {
    // Check if user already exists , if yes then return error
    const existingUser = await UserModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;

    // Create a new user
    await UserModel.create(req.body);
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    // step 1: find user by email , if not found then return error
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // step 2: compare the password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    // step 3 : check if user role is equal to required role
    if (user.role !== req.body.role) {
      return res.status(403).json({
        success: false,
        message: `You do not have ${req.body.role} access`,
      });
    }

    // step 3: if password matches, return success response with jwt token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: token,
      role: user.role,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/get-logged-in-user", middleware, async (req, res) => {
  try {
    const userId = req.userId;
    const user = await UserModel.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
