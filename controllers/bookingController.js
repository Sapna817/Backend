import Booking from "../models/Booking.js";

export const createBooking = async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Booking failed", error: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ date: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const { email } = req.params;
    const bookings = await Booking.find({ email }).sort({ date: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user bookings", error: error.message });
  }
};

export const getBookingsByDoctor = async (req, res) => {
  try {
    const { doctorName } = req.params;
    const bookings = await Booking.find({
      doctor: { $regex: doctorName, $options: "i" },
    }).sort({ date: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings by doctor:", error);
    res.status(500).json({ message: "Error fetching bookings by doctor", error: error.message });
  }
};

export const getBookingsForLoggedInDoctor = async (req, res) => {
  try {
    if (!req.doctor || !req.doctor.email) {
      return res.status(401).json({ success: false, message: "Unauthorized: Doctor data not found" });
    }

    const doctorEmail = req.doctor.email; 
    const bookings = await Booking.find({ doctoremail: doctorEmail }).sort({ date: -1 });

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error("Error fetching doctor's bookings:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching doctor's bookings",
      error: error.message
    });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBooking = await Booking.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: "Error updating booking", error: error.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBooking = await Booking.findByIdAndDelete(id);

    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting booking", error: error.message });
  }
};
