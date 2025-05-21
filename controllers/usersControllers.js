import bcrypt from "bcryptjs";
import validator from 'validator';
import User from "../models/user.js"; 
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

const createUser = async (req, res) => {
  try {
    const { FullName, Email, Phone, Password, Address, Gender, Dob } = req.body;

    if (!FullName || !Email || !Phone || !Password) {
      return res.status(400).json({ success: false, message: "Invalid user data" });
    }

    if (!validator.isEmail(Email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    const existing = await User.findOne({ Email });
    if (existing) {
      return res.status(400).json({ success: false, message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    let profilePicUrl = '';
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'users',
      });
      profilePicUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const user = new User({
      FullName: FullName,
      Email,
      Phone,
      Password: hashedPassword,
      profilePic: profilePicUrl,
      Address: Address,
      Gender,
      Dob
    });

    await user.save();

    res.status(201).json({ success: true, message: 'User added successfully', user });
  } catch (error) {
    console.error('Add User Error:', error);
    res.status(500).json({ success: false, message: 'Failed to add user', error });
  }
};

export default createUser;


// import bcrypt from "bcryptjs";
// import validator from 'validator';
// import User from "../models/user.js";
// import cloudinary from '../config/cloudinary.js';
// import fs from 'fs';
// import jwt from 'jsonwebtoken';

// const createUser = async (req, res) => {
//   try {
//     const { FullName, Email, Phone, Password, Address, Gender, Dob } = req.body;

//     // Validate required fields
//     if (!FullName || !Email || !Phone || !Password) {
//       return res.status(400).json({ success: false, message: "Required fields are missing" });
//     }

//     // Validate email
//     if (!validator.isEmail(Email)) {
//       return res.status(400).json({ success: false, message: "Invalid email format" });
//     }

//     // Validate phone number
//     if (!validator.isMobilePhone(Phone + '', 'any')) {
//       return res.status(400).json({ success: false, message: "Invalid phone number" });
//     }

//     // Validate password length
//     if (Password.length < 6) {
//       return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
//     }

//     // Check if user already exists
//     const existing = await User.findOne({ email: Email });
//     if (existing) {
//       return res.status(400).json({ success: false, message: "User with this email already exists" });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(Password, 10);

//     // Handle profile picture upload
//     let profilePicUrl = '';
//     if (req.file) {
//       try {
//         const result = await cloudinary.uploader.upload(req.file.path, {
//           folder: 'users',
//         });
//         profilePicUrl = result.secure_url;
//       } catch (uploadError) {
//         return res.status(500).json({ success: false, message: 'Image upload failed', error: uploadError });
//       } finally {
//         // Clean up temp file
//         try {
//           fs.unlinkSync(req.file.path);
//         } catch (err) {
//           console.warn("Failed to delete temp file:", err);
//         }
//       }
//     }

//     // Create and save user
//     const user = new User({
//       FullName,
//       Email: Email, // must match schema
//       Phone,
//       Password: hashedPassword,
//       profilePic: profilePicUrl,
//       Address,
//       Gender,
//       Dob
//     });

//     await user.save();

//     // Prepare response
//     const userResponse = { ...user._doc };
//     delete userResponse.Password;

//     // Generate JWT token
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

//     res.status(201).json({
//       success: true,
//       message: 'User added successfully',
//       user: userResponse,
//       token
//     });

//   } catch (error) {
//     console.error('Create User Error:', error);
//     res.status(500).json({ success: false, message: 'Server error while creating user', error: error.message });
//   }
// };

// export default createUser;
