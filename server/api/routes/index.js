// routes/index.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const propertyController = require("../controllers/propertyController");7
const testimonialController = require("../controllers/testimonialController");7
const authenticateUser = require("../middleware/authenticateUser");

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
router.put("/property/:id", authenticateUser, propertyController.updateProperty);
router.delete(
  "/property/:id",
  authenticateUser,
  propertyController.deleteProperty
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
module.exports = router;
