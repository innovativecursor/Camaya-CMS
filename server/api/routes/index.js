// routes/index.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const propertyController = require("../controllers/propertyController");
const testimonialController = require("../controllers/testimonialController");
const inquiryController = require("../controllers/inquiryController");
const amenityController = require("../controllers/amenityController");
const authenticateUser = require("../middleware/authenticateUser");
const { apiLimiter } = require("../middleware/apiLimiter");

// User routes
router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/forgotPassword", userController.forgotPassword);
router.post("/resetPassword", userController.resetPassword);
router.get("/users", authenticateUser, userController.allUsers);

//For Selectable Options
router.get("/propertyOptions", propertyController.getPropertyOptions);
router.get("/locationOptions", propertyController.getLocationOptions);
router.get("/pricingOptions", propertyController.getPricingOptions);
// Property routes
router.get("/properties", propertyController.getProperties);
router.post(
  "/createProperty",
  authenticateUser,
  propertyController.createProperty
);
router.put(
  "/property/:id",
  authenticateUser,
  propertyController.updateProperty
);
router.delete(
  "/property/:id",
  authenticateUser,
  propertyController.deleteProperty
);
// Inquiry Routes
router.get(
  "/fetchInquiries",
  authenticateUser,
  inquiryController.fetchInquiries
);
router.post(
  "/sendInquiry",
  //  apiLimiter,
  inquiryController.createInquiry
);
router.delete(
  "/deleteInquiry/:id",
  authenticateUser,
  inquiryController.deleteInquiry
);
// Testimonials
router.get("/fetchTestimonials", testimonialController.getTestimonials);
router.post(
  "/createTestimonial",
  authenticateUser,
  testimonialController.createTestimonial
);
router.delete(
  "/deleteTestimonial/:id",
  authenticateUser,
  testimonialController.deleteTestimonial
);
//Aminities
router.get("/fetchMenuItems", amenityController.getMenuOptions);
router.get("/fetchAmenities", amenityController.getAmenities);
router.get("/getAmenitiesByMenuId", amenityController.getAmenitiesByMenuId);
router.post(
  "/createAmenity",
  authenticateUser,
  amenityController.createAmenity
);
router.put(
  "/updateAmenity/:id",
  authenticateUser,
  amenityController.updateAmenity
);
router.delete(
  "/deleteAmenity/:id",
  authenticateUser,
  amenityController.deleteAmenity
);

module.exports = router;
