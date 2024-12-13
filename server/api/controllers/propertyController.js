// controllers/propertyController.js
const Property = require("../models/property");
const { Op } = require("sequelize");
const cloudinary = require("../../utils/cloudinary");
const { formattedResult } = require("../utils/Consts");

exports.getProperties = async (req, res) => {
  try {
    // Get query parameters
    // const { station_number, location, price } = req.query;

    // Construct the filter object
    // let filter = {};
    // if (location) filter.location = location;
    // if (station_number) filter.station_number = station_number;

    // Add functional requirements to the filter
    // Object.keys(functionalReq).forEach((key) => {
    //   if (functionalReq[key] === "true") {
    //     filter[key] = true;
    //   }
    // });

    const result = await Property.findAll({});

    const properties = await formattedResult(result);
    res.status(200).json({ properties });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch properties", error: error.message });
  }
};
exports.getStationOptions = async (req, res) => {
  try {
    // Fetch all unique stations from the Propertys table
    const stations = await Property.findAll({
      attributes: [
        [
          Property.sequelize.fn(
            "DISTINCT",
            Property.sequelize.col("station_number")
          ),
          "station_number",
        ],
      ],
      order: [["station_number", "ASC"]],
    });

    // Extract the stations from the result
    const stationList = stations.map((loc) => loc.location);

    res.status(200).json(stationList);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch stations", error: error.message });
  }
};
// exports.getPropertyOptions = async (req, res) => {
//   try {
//     // Fetch all unique properties from the Propertys table
//     const property = await Property.findAll({
//       attributes: [
//         [
//           Property.sequelize.fn(
//             "DISTINCT",
//             Property.sequelize.col("prop_name")
//           ),
//           "prop_name",
//         ],
//       ],
//       order: [["prop_name", "ASC"]],
//     });

//     // Extract the property from the result
//     const propertyList = property.map((el) => el.prop_name);

//     res.status(200).json(propertyList);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Failed to fetch properties", error: error.message });
//   }
// };
// exports.getPricingOptions = async (req, res) => {
//   try {
//     // Fetch all unique Pricing from the Property table
//     const pricing = await Property.findAll({
//       attributes: [
//         [
//           Property.sequelize.fn("DISTINCT", Property.sequelize.col("price")),
//           "price",
//         ],
//       ],
//       order: [["price", "ASC"]],
//     });

//     // Extract the Pricing from the result
//     const pricingList = pricing.map((el) => el.price);

//     res.status(200).json(pricingList);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Failed to fetch Pricing", error: error.message });
//   }
// };
exports.createProperty = async (req, res) => {
  try {
    const { location, station_number, pictures } = req.body;

    // Check for duplicate property by name
    const existingProperty = await Property.findOne({
      where: { location },
    });

    if (existingProperty) {
      return res.status(400).json({
        message:
          "Duplicate entries are not allowed. Property with the same name already exists.",
      });
    }

    // Create the property in the database
    const newProperty = await Property.create({
      location,
      station_number,
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

    res.status(201).json({
      message: "Property created successfully!",
      property: newProperty,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create property", error: error.message });
  }
};
exports.updateProperty = async (req, res) => {
  const { id } = req.params;
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
