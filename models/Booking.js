import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  bookingId: String,
  name: String,
  email: String,
  phone: String,
  doctor: String,
  doctoremail: String,
  fees: String,
  timeslot: String,
  date: String,
  message: String,
  formType: String,
}, {
  timestamps: true
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
