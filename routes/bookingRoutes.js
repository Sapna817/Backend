import express from "express";
import {
  createBooking,
  getAllBookings,
  getUserBookings,
  getBookingsByDoctor,  
  updateBooking,
  deleteBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/book-appointment", createBooking);
router.get("/bookings", getAllBookings);
router.get("/bookings/:email", getUserBookings);
router.get("bookings/doctor/:doctorName", getBookingsByDoctor)
router.put("/bookings/:id", updateBooking);
router.delete("/bookings/:id", deleteBooking);



export default router;
