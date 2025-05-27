// auth.js
import jwt from 'jsonwebtoken';
import Doctor from "../models/doctors.js";

// Doctor Auth Middleware
const authDoctor = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token)
      return res.status(401).json({ message: "Access denied. No token provided." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const doctor = await Doctor.findOne({ email: decoded.email });

    if (!doctor)
      return res.status(401).json({ message: "Doctor not found." });

    req.doctor = doctor;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token", error: error.message });
  }
};

// Admin Auth Middleware
const authAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized. Login again.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Compare decoded email and password with admin credentials
    const isAdmin = decoded.email === process.env.ADMIN_EMAIL && decoded.password === process.env.ADMIN_PASSWORD;

    if (!isAdmin) {
      return res.status(403).json({ success: false, message: 'Forbidden. Not an admin.' });
    }

    req.admin = true;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ success: false, message: 'Invalid token', error: error.message });
  }
};

// Named Exports
export { authDoctor, authAdmin };
