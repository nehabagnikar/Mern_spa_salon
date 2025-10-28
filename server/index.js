const express = require("express");
const app = express();

const dotenv = require("dotenv");
const connectMongoDB = require("./config/mongodb-config");
const cors = require("cors");
dotenv.config();

connectMongoDB();
const userRoute = require("./routes/users-route");
const salonsRoute = require("./routes/salons-route");
const appointmentsRoute = require("./routes/appointments-route");
const dashboardRoute = require("./routes/dashboard-route");
var cookieParser = require('cookie-parser')
app.use(express.json()); // parse JSON data
app.use(cookieParser()) // allow node to parse cookies from the request

// allow CORS for all origins
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);


app.use("/api/users" , userRoute);
app.use("/api/salons", salonsRoute);
app.use("/api/appointments", appointmentsRoute);
app.use("/api/dashboard", dashboardRoute);

const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log(`Node.js + Express.js Server is running on port ${port}`);
});
