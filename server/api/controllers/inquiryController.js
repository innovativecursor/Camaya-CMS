const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Inquiry = require("../models/inquiries");
const nodemailer = require("nodemailer");
const Joi = require("joi");

// Validations using JOI
const inquirySchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().allow("").optional(),
  mobile_number: Joi.string().min(10).max(15).required(),
  message: Joi.string().min(5).max(1000).allow("").optional(),
});
exports.fetchInquiries = async (req, res) => {
  try {
    const fetch_inq = await Inquiry.findAll({});
    res.status(200).json(fetch_inq);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to populate Inquiries", error: error.message });
  }
};
exports.createInquiry = async (req, res) => {
  const { error } = inquirySchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  try {
    const { name, email, mobile_number, message } = req.body;
    const checkDuplicateinquiry = await Inquiry.findAll({ where: { email } });
    if (checkDuplicateinquiry.length != 0) {
      return res.status(400).json({
        message: "Duplicate Entry. An inquiry with this email already exists.",
      });
    }
    await Inquiry.create({
      name,
      email,
      mobile_number,
      message,
    });
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      to: process.env.TOEMAIL,
      from: email,
      subject: "Enrollment Form Inquiry",
      text: `
            You have received a new inquiry from your website.

            Details:
            Name: ${name}
            Email: ${email}
            Mobile Number: ${mobile_number}
        
            Message:
            ${message}

            Please respond to the inquiry as soon as possible.
            `,
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({
      message:
        "Thank you for showing your interest! We'll get back to you in 48 hours.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong!", error: error.message });
  }
};
exports.deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const inquiry = await Inquiry.findByPk(id);
    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }
    await inquiry.destroy();
    res.status(200).json({ message: "Inquiry Deleted Successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to Delete Inquiry", error: error.message });
  }
};
