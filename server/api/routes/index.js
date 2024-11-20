// routes/index.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const propertyController = require("../controllers/propertyController");
const authenticateUser = require("../middleware/authenticateUser");

// User routes
router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/forgotPassword", userController.forgotPassword);
router.post("/resetPassword", userController.resetPassword);
router.get("/users", authenticateUser, userController.allUsers);

//For Selectable Options
router.get("/locationOptions", propertyController.getLocationOptions);
router.get("/propertyOptions", propertyController.getPropertyOptions);
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
module.exports = router;
