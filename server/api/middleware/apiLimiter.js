const rateLimit = require("express-rate-limit");

// Define rate limit rules
exports.apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 15 minutes
  max: 2, // limit each IP to 10 requests per windowMs
  message:
    "Too many inquiries created from this IP, please try again after 15 minutes.",
});
