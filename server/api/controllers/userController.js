// // controllers/userController.js
// controllers/userController.js

const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { Op } = require("sequelize");

exports.signup = async (req, res) => {
  const { first_name, last_name, email, password, role, role_id, code } =
    req.body;
  try {
    const findEmail = await User.findOne({ where: { email } });
    if (findEmail) {
      return res.status(401).json({ message: "User already exists" });
    }
    if (code !== 8050) {
      return res.status(401).json({ message: "Unable to register!" });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 8);
    await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role,
      role_id,
    });
    res.status(200).json({ message: "User Successfully registered!" });
  } catch (error) {
    res.status(400).json({ message: "Signup failed", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { encryptedEmail, encryptedPassword } = req.body;

    "encryptedEmail", encryptedEmail;
    "encryptedPassword", encryptedPassword;
    const email = CryptoJS.AES.decrypt(
      encryptedEmail,
      process.env.ENCRYPTION
    ).toString(CryptoJS.enc.Utf8);
    const password = CryptoJS.AES.decrypt(
      encryptedPassword,
      process.env.ENCRYPTION
    ).toString(CryptoJS.enc.Utf8);

    "email", email;
    if (!(email || password)) {
      return res
        .status(400)
        .json({ message: "Need to fill in both, email and password" });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "User not Registered" });
    }
    // Compare hashed password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid Password" });
    }
    // Generate JWT token
    const exp = Date.now() + 1000 * 60 * 60 * 24 * 30;
    const token = jwt.sign({ encode: user.user_id, exp }, process.env.SECRET);

    // const token = jwt.sign(
    //   { id: user.id, email: user.email },
    //   process.env.SECRET
    // );
    const sendUserInfo = await User.findOne({
      where: { email },
      attributes: [
        "user_id",
        "first_name",
        "last_name",
        "email",
        "role",
        "role_id",
      ],
    });
    res.status(200).json({ sendUserInfo, token });
  } catch (error) {
    res.status(400).json({ message: "Login failed", error: error.message });
  }
};
exports.allUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        "user_id",
        "first_name",
        "last_name",
        "email",
        "role",
        "role_id",
      ],
    });
    res.status(200).json({ users });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: error.message });
  }
};
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL,
      subject: "Password Reset",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        ${req.headers.origin}/reset/${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset link sent" });
  } catch (error) {
    res.status(500).json({
      message: "Error sending password reset link",
      error: error.message,
    });
  }
};

// Method to change password
exports.resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;
  try {
    const user = await User.findOne({
      where: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 8);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({ message: "Password successfully reset" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error resetting password", error: error.message });
  }
};


// const User = require("../models/user");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const CryptoJS = require("crypto-js");
// const crypto = require("crypto");
// const nodemailer = require("nodemailer");
// const { Op } = require("sequelize");

// exports.signup = async (req, res) => {
//   const { first_name, last_name, email, password, role, role_id } = req.body;
//   try {
//     const findEmail = await User.findOne({ where: { email } });
//     if (findEmail) {
//       return res.status(401).json({ message: "User already exists" });
//     }
//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 8);
//     await User.create({
//       first_name,
//       last_name,
//       email,
//       password: hashedPassword,
//       role,
//       role_id,
//     });
//     res.status(200).json({ message: "User Successfully registered!" });
//   } catch (error) {
//     res.status(400).json({ message: "Signup failed", error: error.message });
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const { encryptedEmail, encryptedPassword } = req.body;

//     "encryptedEmail", encryptedEmail;
//     "encryptedPassword", encryptedPassword;
//     const email = CryptoJS.AES.decrypt(
//       encryptedEmail,
//       process.env.ENCRYPTION
//     ).toString(CryptoJS.enc.Utf8);
//     const password = CryptoJS.AES.decrypt(
//       encryptedPassword,
//       process.env.ENCRYPTION
//     ).toString(CryptoJS.enc.Utf8);

//     "email", email;
//     if (!(email || password)) {
//       return res
//         .status(400)
//         .json({ message: "Need to fill in both, email and password" });
//     }
//     const user = await User.findOne({ where: { email } });
//     if (!user) {
//       return res.status(401).json({ message: "User not Registered" });
//     }
//     // Compare hashed password
//     const isValidPassword = await bcrypt.compare(password, user.password);
//     if (!isValidPassword) {
//       return res.status(401).json({ message: "Invalid Password" });
//     }
//     // Generate JWT token
//     const exp = Date.now() + 1000 * 60 * 60 * 24 * 30;
//     const token = jwt.sign({ encode: user.user_id, exp }, process.env.SECRET);

//     // const token = jwt.sign(
//     //   { id: user.id, email: user.email },
//     //   process.env.SECRET
//     // );
//     const sendUserInfo = await User.findOne({
//       where: { email },
//       attributes: [
//         "user_id",
//         "first_name",
//         "last_name",
//         "email",
//         "role",
//         "role_id",
//       ],
//     });
//     res.status(200).json({ sendUserInfo, token });
//   } catch (error) {
//     res.status(400).json({ message: "Login failed", error: error.message });
//   }
// };
// exports.allUsers = async (req, res) => {
//   try {
//     const users = await User.findAll({
//       attributes: [
//         "user_id",
//         "first_name",
//         "last_name",
//         "email",
//         "role",
//         "role_id",
//       ],
//     });
//     res.status(200).json({ users });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Failed to fetch users", error: error.message });
//   }
// };
// exports.forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ where: { email } });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const token = crypto.randomBytes(20).toString("hex");
//     user.resetPasswordToken = token;
//     user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
//     await user.save();

//     const transporter = nodemailer.createTransport({
//       service: "Gmail",
//       auth: {
//         user: process.env.EMAIL,
//         pass: process.env.EMAIL_PASSWORD,
//       },
//     });

//     const mailOptions = {
//       to: user.email,
//       from: process.env.EMAIL,
//       subject: "Password Reset",
//       text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
//         Please click on the following link, or paste this into your browser to complete the process:\n\n
//         ${req.headers.origin}/reset/${token}\n\n
//         If you did not request this, please ignore this email and your password will remain unchanged.\n`,
//     };

//     await transporter.sendMail(mailOptions);

//     res.status(200).json({ message: "Password reset link sent" });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error sending password reset link",
//       error: error.message,
//     });
//   }
// };

// // Method to change password
// exports.resetPassword = async (req, res) => {
//   const { resetToken, newPassword } = req.body;
//   try {
//     const user = await User.findOne({
//       where: {
//         resetPasswordToken: resetToken,
//         resetPasswordExpires: { [Op.gt]: Date.now() },
//       },
//     });

//     if (!user) {
//       return res
//         .status(400)
//         .json({ message: "Invalid or expired reset token" });
//     }

//     const hashedPassword = await bcrypt.hash(newPassword, 8);
//     user.password = hashedPassword;
//     user.resetPasswordToken = null;
//     user.resetPasswordExpires = null;
//     await user.save();

//     res.status(200).json({ message: "Password successfully reset" });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error resetting password", error: error.message });
//   }
// };
