// routes/index.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const productController = require("../controllers/productController");
const awardController = require("../controllers/awardController");
const authenticateUser = require("../middleware/authenticateUser");

// User routes
router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/forgotPassword", userController.forgotPassword);
router.post("/resetPassword", userController.resetPassword);
router.get("/users", authenticateUser, userController.allUsers);

//For Selectable Options
router.get("/locationOptions", productController.getLocationOptions);
router.get("/budgetOptions", productController.getBudgetOptions);
router.get("/boothsizeOptions", productController.getBoothSizeOptions);
router.get("/secondaryOptions", productController.getSecondaryOptions);
router.get("/functionalReq", productController.getfunctionalRequirements);
router.get(
  "/webInfo",
  authenticateUser,
  productController.getWebInfoRequirements
);
router.get("/heroSectionImages", productController.getHeroSectionImages);
router.get("/portfolioImages", productController.getPortfolioSectionImages);
router.get("/awardWinning", productController.getAwardWinning);
router.get("/recentWork", productController.getrecentWork);
// Product routes
router.get("/products", productController.getProducts);
router.post(
  "/createproduct",
  authenticateUser,
  productController.createProduct
);
router.put("/products/:id", authenticateUser, productController.updateProduct);
router.delete(
  "/products/:id",
  authenticateUser,
  productController.deleteProduct
);
// Awards Routes
router.get("/getAward", awardController.getAwards);
router.post("/addAward", authenticateUser, awardController.postAwards);
router.delete(
  "/deleteAward/:id",
  authenticateUser,
  awardController.deleteAwards
);
module.exports = router;
