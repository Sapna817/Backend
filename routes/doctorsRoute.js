// import express from "express";
// import Doctor from "../models/doctors.js";
// import { getDoctorByName } from "../controllers/doctorControllers.js";
// import { loginDoctor } from "../controllers/doctorControllers.js";
// import { getMe } from "../controllers/doctorControllers.js";

// const router = express.Router();

// // Get all doctors

// router.get('/doctors', async (req, res) => {
//   try {
//     const doctors = await Doctor.find();
//     res.json(doctors);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching doctors' });
//   }
// });


// router.get("/doctors/name/:name", getDoctorByName);
// router.post('/doctor/login', loginDoctor);
// router.get("/doctor/me", getMe);


// export default router;

import express from "express";
import Doctor from "../models/doctors.js";
import {
  getDoctorByName,
  loginDoctor,
  getMe
} from "../controllers/doctorControllers.js";

import { getBookingsForLoggedInDoctor } from "../controllers/bookingController.js";
import authDoctor from "../middlewares/authDoctor.js"; // ✅ JWT middleware for doctor

const router = express.Router();

// Fetch all doctors (public)
router.get("/doctors", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching doctors" });
  }
});

// Get doctor by name
router.get("/doctors/name/:name", getDoctorByName);

// Doctor login
router.post("/doctor/login", loginDoctor);

// Get current logged-in doctor info (protected)
router.get("/doctor/me", authDoctor, getMe);

// ✅ Get all bookings for logged-in doctor (protected)
router.get("/doctor/bookings", authDoctor, getBookingsForLoggedInDoctor);

export default router;
