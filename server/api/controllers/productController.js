// controllers/productController.js
const Product = require("../models/product");
const { Op } = require("sequelize");
const cloudinary = require("../../utils/cloudinary");

exports.getProducts = async (req, res) => {
  try {
    // Get query parameters
    const {
      location,
      booth_size,
      budget,
      closed_meeting_room,
      demo_stations,
      open_discussion_area,
      ...functionalReq
    } = req.query;

    // Construct the filter object
    let filter = {};

    if (location) filter.location = location;
    if (booth_size) filter.booth_size = booth_size;
    // if (budget) {
    //   const [minBudget, maxBudget] = budget.split("-").map(Number);
    //   filter.budget = {
    //     [Op.between]: [minBudget, maxBudget],
    //   };
    // }
    // Handle budget filter
    if (budget) {
      let budgetRange;
      try {
        budgetRange = JSON.parse(budget); // Parse the JSON string
      } catch (e) {
        return res.status(400).json({ message: "Invalid budget format" });
      }

      if (Array.isArray(budgetRange) && budgetRange.length === 2) {
        filter.budget = {
          [Op.between]: [budgetRange[0], budgetRange[1]],
        };
      } else {
        return res.status(400).json({ message: "Invalid budget range" });
      }
    }
    if (closed_meeting_room) filter.closed_meeting_room = closed_meeting_room;
    if (demo_stations) filter.demo_stations = demo_stations;
    if (open_discussion_area)
      filter.open_discussion_area = open_discussion_area;

    // Add functional requirements to the filter
    Object.keys(functionalReq).forEach((key) => {
      if (functionalReq[key] === "true") {
        filter[key] = true;
      }
    });

    const products = await Product.findAll({ where: filter });
    res.status(200).json({ products });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch products", error: error.message });
  }
};
exports.getLocationOptions = async (req, res) => {
  try {
    // Fetch all unique locations from the Products table
    const locations = await Product.findAll({
      attributes: [
        [
          Product.sequelize.fn("DISTINCT", Product.sequelize.col("location")),
          "location",
        ],
      ],
      order: [["location", "ASC"]],
    });

    // Extract the locations from the result
    const locationList = locations.map((loc) => loc.location);

    res.status(200).json(locationList);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch locations", error: error.message });
  }
};
exports.getBoothSizeOptions = async (req, res) => {
  try {
    const boothSizes = await Product.findAll({
      attributes: [
        [
          Product.sequelize.fn("DISTINCT", Product.sequelize.col("booth_size")),
          "booth_size",
        ],
      ],
    });

    const boothSizeList = boothSizes.map((boothSize) =>
      boothSize.get("booth_size")
    );

    // Function to extract the numeric parts of the booth size
    const parseBoothSize = (boothSize) => {
      const match = boothSize.match(/(\d+)x(\d+)/i);
      if (match) {
        return [parseInt(match[1], 10), parseInt(match[2], 10)];
      }
      return [0, 0];
    };

    // Sort boothSizeList based on the parsed numeric values
    boothSizeList.sort((a, b) => {
      const [aWidth, aHeight] = parseBoothSize(a);
      const [bWidth, bHeight] = parseBoothSize(b);
      return aWidth - bWidth || aHeight - bHeight;
    });

    res.status(200).json(boothSizeList);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch booth sizes", error: error.message });
  }
};
exports.getBudgetOptions = async (req, res) => {
  try {
    const budgetList = [
      {
        label: "$10k - $15k",
        value: [10000, 15000],
      },
      {
        label: "$15k - $25k",
        value: [15000, 25000],
      },
      {
        label: "$25k - $35k",
        value: [25000, 35000],
      },
      {
        label: "$35k - $45k",
        value: [35000, 45000],
      },
      {
        label: "$45k - $60k",
        value: [45000, 60000],
      },
      {
        label: "$60k+",
        value: [60000, Number.MAX_SAFE_INTEGER],
      },
    ];
    res.status(200).json(budgetList);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch budgets", error: error.message });
  }
};
exports.getSecondaryOptions = async (req, res) => {
  try {
    const secondaryOptions = [
      {
        label: 1,
        value: 1,
      },
      {
        label: 2,
        value: 2,
      },
      {
        label: 3,
        value: 3,
      },
      {
        label: 4,
        value: 4,
      },
      {
        label: 5,
        value: 5,
      },
      {
        label: 6,
        value: 6,
      },
      {
        label: 7,
        value: 7,
      },
      {
        label: 8,
        value: 8,
      },
      {
        label: 9,
        value: 9,
      },
      {
        label: 10,
        value: 10,
      },
    ];
    res.status(200).json(secondaryOptions);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch secondary Options",
      error: error.message,
    });
  }
};
exports.getfunctionalRequirements = async (req, res) => {
  try {
    //Hard Coded Options
    const functionalReq = [
      {
        label: "Bar Area",
        value: "bar_area",
      },
      {
        label: "Hanging sign",
        value: "hanging_sign",
      },
      {
        label: "LED Video Wall",
        value: "led_video_wall",
      },
      {
        label: "Lounge Area",
        value: "longue_area",
      },
      {
        label: "Product Display",
        value: "product_display",
      },
      {
        label: "Reception Counter",
        value: "reception_counter",
      },
      {
        label: "Semi Closed Meeting Area",
        value: "semi_closed_meeting_area",
      },
      {
        label: "Storage Room",
        value: "storage_room",
      },
      {
        label: "Theatre Style Demo",
        value: "theatre_style_demo",
      },
      {
        label: "Touch Screen Kiosk",
        value: "touch_screen_kiosk",
      },
    ];
    res.status(200).json(functionalReq);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch functional Requirements",
      error: error.message,
    });
  }
};
exports.getWebInfoRequirements = async (req, res) => {
  try {
    //Hard Coded Options
    const webInfo = [
      {
        label: "Showcase On Hero Section",
        value: "showcase_Hero_section",
      },
      {
        label: "Showcase On Portfolio Section",
        value: "showcase_portfolio_section",
      },
      {
        label: "Award Winning",
        value: "award_winning",
      },
      {
        label: "Recent Work",
        value: "recent_work",
      },
    ];
    res.status(200).json(webInfo);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch functional Requirements",
      error: error.message,
    });
  }
};
exports.getHeroSectionImages = async (req, res) => {
  try {
    const getAllProds = await Product.findAll({
      where: { showcase_Hero_section: true },
    });
    const pickPicturesOnly = getAllProds?.map((el)=>el?.pictures[0]);
    res.status(200).json(pickPicturesOnly);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch Hero Section Iamges",
      error: error.message,
    });
  }
};
exports.getPortfolioSectionImages = async (req, res) => {
  try {
    const getAllProds = await Product.findAll({
      where: { showcase_portfolio_section: true },
    });
    res.status(200).json(getAllProds);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch Hero Section Iamges",
      error: error.message,
    });
  }
};
exports.getAwardWinning = async (req, res) => {
  try {
    const getAllProds = await Product.findAll({
      where: { award_winning: true },
    });
    res.status(200).json(getAllProds);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch Hero Section Iamges",
      error: error.message,
    });
  }
};
exports.getrecentWork = async (req, res) => {
  try {
    const getAllProds = await Product.findAll({
      where: { award_winning: true },
    });
    res.status(200).json(getAllProds);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch Hero Section Iamges",
      error: error.message,
    });
  }
};
exports.createProduct = async (req, res) => {
  try {
    const {
      product_name,
      location,
      booth_size,
      budget,
      closed_meeting_room,
      demo_stations,
      open_discussion_area,
      bar_area,
      hanging_sign,
      led_video_wall,
      longue_area,
      product_display,
      reception_counter,
      semi_closed_meeting_area,
      storage_room,
      theatre_style_demo,
      touch_screen_kiosk,
      showcase_Hero_section,
      showcase_portfolio_section,
      award_winning,
      recent_work,
      key_highlights,
      description,
    } = req.body;

    // First, create the product in the database to get its ID
    const newProduct = await Product.create({
      product_name,
      location,
      booth_size,
      budget,
      closed_meeting_room,
      demo_stations,
      open_discussion_area,
      bar_area,
      hanging_sign,
      led_video_wall,
      longue_area,
      product_display,
      reception_counter,
      semi_closed_meeting_area,
      storage_room,
      theatre_style_demo,
      touch_screen_kiosk,
      showcase_Hero_section,
      showcase_portfolio_section,
      award_winning,
      recent_work,
      key_highlights,
      description,
      pictures: [], // Initialize as empty array, we'll update it later
    });

    // Generate a unique folder name using the product ID
    const folderName = `${process.env.CLOUDINARY_DB}/product_${newProduct.prd_id}`;

    // Upload pictures to Cloudinary
    const uploadPromises = req.body.pictures?.map((base64Data) => {
      return cloudinary.uploader.upload(base64Data, {
        folder: folderName, // Specify the folder for uploaded images
      });
    });

    const uploadedImages = await Promise.all(uploadPromises);

    // Update the product with the uploaded images
    await newProduct.update({ pictures: uploadedImages });

    res
      .status(201)
      .json({ message: "Product Created Successfully!", product: newProduct });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create product", error: error.message });
  }
};
// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Find the existing product
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Generate the folder name based on the product ID
    const folderName = `${process.env.CLOUDINARY_DB_DEV}/product_${id}`;

    // Fetch existing images from Cloudinary
    const cloudinaryFiles = await cloudinary.api.resources({
      type: "upload",
      prefix: folderName,
    });

    // Extract the public IDs of the existing pictures in Cloudinary
    const cloudinaryPublicIds = cloudinaryFiles.resources.map(
      (file) => file.public_id
    );

    // Identify and delete pictures from Cloudinary that are not in the new set
    const updatedPublicIds = updatedData.pictures
      .map((pic) => pic.public_id)
      .filter(Boolean); // Filter out undefined or null public_ids
    const deletePromises = cloudinaryPublicIds
      .filter((publicId) => !updatedPublicIds.includes(publicId))
      .map((publicId) => cloudinary.uploader.destroy(publicId));

    await Promise.all(deletePromises);

    // Upload new images that don't have a public_id
    const uploadPromises = updatedData.pictures
      .filter((pic) => typeof pic === "string") // Only process new base64 images
      .map((base64Data) =>
        cloudinary.uploader.upload(base64Data, {
          folder: folderName,
        })
      );

    const uploadedImages = await Promise.all(uploadPromises);

    // Combine the existing valid images with the newly uploaded images
    const allImages = [
      ...updatedData.pictures.filter((pic) => typeof pic !== "string"), // Keep existing images
      ...uploadedImages,
    ];

    // Update the pictures in the updatedData
    updatedData.pictures = allImages;

    // Update the product with new data and pictures
    await product.update(updatedData);

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update product", error: error.message });
  }
};
// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Extract the pictures array from the product
    const { pictures } = product;
    // Extract the folder name from the first picture URL (assuming they all belong to the same folder)
    const folderName = pictures[0].folder;
    // Create a list of promises to delete each image from Cloudinary
    const deletePromises = pictures.map((picture) => {
      // Extract the public_id from the picture URL
      const publicId = picture.public_id;
      return cloudinary.uploader.destroy(publicId);
    });

    // Wait for all images to be deleted from Cloudinary
    await Promise.all(deletePromises);

    // Get a list of all files within the folder
    const filesInFolder = await cloudinary.api.resources({
      type: "upload",
      prefix: folderName,
    });

    // Create a list of promises to delete each file within the folder
    const deleteFilePromises = filesInFolder.resources.map((file) => {
      return cloudinary.uploader.destroy(file.public_id);
    });

    // Wait for all files to be deleted from Cloudinary
    await Promise.all(deleteFilePromises);

    // Delete the folder in Cloudinary
    await cloudinary.api.delete_folder(folderName);

    // Delete the product from the database
    await product.destroy();

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete product", error: error.message });
  }
};
