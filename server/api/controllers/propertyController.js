// controllers/propertyController.js
const Property = require("../models/property");
const { Op } = require("sequelize");
const cloudinary = require("../../utils/cloudinary");

exports.getProperties = async (req, res) => {
  try {
    // Get query parameters
    const {
      prop_name,
      location,
      price,
    } = req.query;

    // Construct the filter object
    let filter = {};
    if (prop_name) filter.prop_name = prop_name;
    if (location) filter.location = location;
    if (price) filter.price = price;

    // Add functional requirements to the filter
    // Object.keys(functionalReq).forEach((key) => {
    //   if (functionalReq[key] === "true") {
    //     filter[key] = true;
    //   }
    // });

    const properties = await Property.findAll({ where: filter });
    res.status(200).json({ properties });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch properties", error: error.message });
  }
};
exports.getLocationOptions = async (req, res) => {
  try {
    // Fetch all unique locations from the Propertys table
    const locations = await Property.findAll({
      attributes: [
        [
          Property.sequelize.fn("DISTINCT", Property.sequelize.col("location")),
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
exports.getPropertyOptions = async (req,res)=>{
  try {
    // Fetch all unique properties from the Propertys table
    const property = await Property.findAll({
      attributes: [
        [
          Property.sequelize.fn("DISTINCT", Property.sequelize.col("prop_name")),
          "prop_name",
        ],
      ],
      order: [["prop_name", "ASC"]],
    });

    // Extract the property from the result
    const propertyList = property.map((el) => el.prop_name);

    res.status(200).json(propertyList);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch properties", error: error.message });
  }
}
exports.getPricingOptions = async (req,res)=>{
  try {
    // Fetch all unique Pricing from the Property table
    const pricing = await Property.findAll({
      attributes: [
        [
          Property.sequelize.fn("DISTINCT", Property.sequelize.col("price")),
          "price",
        ],
      ],
      order: [["price", "ASC"]],
    });

    // Extract the Pricing from the result
    const pricingList = pricing.map((el) => el.price);

    res.status(200).json(pricingList);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch Pricing", error: error.message });
  }
}
exports.createProperty = async (req, res) => {
  try {
    const { prop_name, location, price, description, pictures } = req.body;

    // Check for duplicate property by name
    const existingProperty = await Property.findOne({
      where: { prop_name },
    });

    if (existingProperty) {
      return res.status(400).json({
        message: "Duplicate entries are not allowed. Property with the same name already exists.",
      });
    }

    // Create the property in the database
    const newProperty = await Property.create({
      prop_name,
      location,
      price,
      description,
      pictures: [], // Initialize as empty array; update later after image upload
    });

    // Generate a unique folder name using the property ID
    const folderName = `${process.env.CLOUDINARY_DB}/Property_${newProperty.prop_id}`;

    // Upload pictures to Cloudinary
    const uploadPromises = pictures?.map((base64Data) => {
      return cloudinary.uploader.upload(base64Data, {
        folder: folderName, // Specify the folder for uploaded images
      });
    });

    const uploadedImages = await Promise.all(uploadPromises || []);

    // Update the property with the uploaded images
    await newProperty.update({ pictures: uploadedImages });

    res
      .status(201)
      .json({ message: "Property created successfully!", property: newProperty });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create property", error: error.message });
  }
};

// Update a property
// exports.updateProperty = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedData = req.body;

//     // Find the existing property
//     const property = await Property.findByPk(id);
//     if (!property) {
//       return res.status(404).json({ message: "Property not found" });
//     }

//     // Generate the folder name based on the property ID
//     const folderName = `${process.env.CLOUDINARY_DB_DEV}/property_${id}`;

//     // Fetch existing images from Cloudinary
//     const cloudinaryFiles = await cloudinary.api.resources({
//       type: "upload",
//       prefix: folderName,
//     });

//     // Extract the public IDs of the existing pictures in Cloudinary
//     const cloudinaryPublicIds = cloudinaryFiles.resources.map(
//       (file) => file.public_id
//     );

//     // Identify and delete pictures from Cloudinary that are not in the new set
//     const updatedPublicIds = updatedData.pictures
//       .map((pic) => pic.public_id)
//       .filter(Boolean); // Filter out undefined or null public_ids
//     const deletePromises = cloudinaryPublicIds
//       .filter((publicId) => !updatedPublicIds.includes(publicId))
//       .map((publicId) => cloudinary.uploader.destroy(publicId));

//     await Promise.all(deletePromises);

//     // Upload new images that don't have a public_id
//     const uploadPromises = updatedData.pictures
//       .filter((pic) => typeof pic === "string") // Only process new base64 images
//       .map((base64Data) =>
//         cloudinary.uploader.upload(base64Data, {
//           folder: folderName,
//         })
//       );

//     const uploadedImages = await Promise.all(uploadPromises);

//     // Combine the existing valid images with the newly uploaded images
//     const allImages = [
//       ...updatedData.pictures.filter((pic) => typeof pic !== "string"), // Keep existing images
//       ...uploadedImages,
//     ];

//     // Update the pictures in the updatedData
//     updatedData.pictures = allImages;

//     // Update the property with new data and pictures
//     await property.update(updatedData);

//     res.status(200).json({ message: "Property updated successfully", property });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Failed to update property", error: error.message });
//   }
// };
exports.updateProperty = async (req, res) => {
  const { id } = req.params;

  // Validate the incoming request data
  //   const { error } = validateBlog(req.body);
  //   if (error) {
  //     return res.status(400).json({
  //       message: "Please Fill in all the Fields",
  //       error: error.details[0].message,
  //     });
  //   }

  try {
    const updatedData = req.body;

    const prop = await Property.findByPk(id);
    if (!prop) {
      return res.status(404).json({ message: "Property not found" });
    }

    const folderName = `${process.env.CLOUDINARY_DB}/Property_${id}`;

    const cloudinaryFiles = await cloudinary.api.resources({
      type: "upload",
      prefix: folderName,
    });

    const cloudinaryPublicIds = cloudinaryFiles.resources.map(
      (file) => file.public_id
    );

    const updatedPublicIds = updatedData.pictures
      .map((pic) => pic.public_id)
      .filter(Boolean);
    const deletePromises = cloudinaryPublicIds
      .filter((publicId) => !updatedPublicIds.includes(publicId))
      .map((publicId) => cloudinary.uploader.destroy(publicId));

    await Promise.all(deletePromises);

    const uploadPromises = updatedData.pictures
      .filter((pic) => typeof pic === "string")
      .map((base64Data) =>
        cloudinary.uploader.upload(base64Data, { folder: folderName })
      );

    const uploadedImages = await Promise.all(uploadPromises);

    const allImages = [
      ...updatedData.pictures.filter((pic) => typeof pic !== "string"),
      ...uploadedImages,
    ];

    updatedData.pictures = allImages;

    await prop.update(updatedData);

    res.status(200).json({ message: "Property updated successfully", prop });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update Property", error: error.message });
  }
};
// Delete a property
// exports.deleteProperty = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const property = await Property.findByPk(id);
//     if (!property) {
//       return res.status(404).json({ message: "Property not found" });
//     }

//     // Extract the pictures array from the property
//     const { pictures } = property;
//     // Extract the folder name from the first picture URL (assuming they all belong to the same folder)
//     const folderName = pictures[0].folder;
//     // Create a list of promises to delete each image from Cloudinary
//     const deletePromises = pictures.map((picture) => {
//       // Extract the public_id from the picture URL
//       const publicId = picture.public_id;
//       return cloudinary.uploader.destroy(publicId);
//     });

//     // Wait for all images to be deleted from Cloudinary
//     await Promise.all(deletePromises);

//     // Get a list of all files within the folder
//     const filesInFolder = await cloudinary.api.resources({
//       type: "upload",
//       prefix: folderName,
//     });

//     // Create a list of promises to delete each file within the folder
//     const deleteFilePromises = filesInFolder.resources.map((file) => {
//       return cloudinary.uploader.destroy(file.public_id);
//     });

//     // Wait for all files to be deleted from Cloudinary
//     await Promise.all(deleteFilePromises);

//     // Delete the folder in Cloudinary
//     await cloudinary.api.delete_folder(folderName);

//     // Delete the property from the database
//     await property.destroy();

//     res.status(200).json({ message: "Property deleted successfully" });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Failed to delete property", error: error.message });
//   }
// };
exports.deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const prop = await Property.findByPk(id);
    if (!prop) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Extract the pictures array from the testimonial
    const { pictures } = prop;
    // If there are pictures, proceed with deleting them from Cloudinary
    if (pictures && pictures.length > 0) {
      const folderName = pictures[0]?.folder;

      // Delete all pictures associated with the staff member
      const deletePromises = pictures.map((picture) =>
        cloudinary.uploader.destroy(picture.public_id)
      );
      await Promise.all(deletePromises);

      // Check if there are any remaining files in the folder and delete them
      const filesInFolder = await cloudinary.api.resources({
        type: "upload",
        prefix: folderName,
      });

      const deleteFilePromises = filesInFolder.resources.map((file) =>
        cloudinary.uploader.destroy(file.public_id)
      );

      await Promise.all(deleteFilePromises);

      // Finally, delete the folder itself
      await cloudinary.api.delete_folder(folderName);
    }

    // Delete the testimonial from the database
    await prop.destroy();

    res.status(200).json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete testimonial", error: error.message });
  }
};