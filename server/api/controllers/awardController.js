// controllers/userController.js

const Award = require("../models/award");
const cloudinary = require("../../utils/cloudinary");

exports.getAwards = async (req, res) => {
  try {
    //Accept query params
    const { award_year } = req.query;
    const awards = await Award.findAll({ where: award_year });
    res.status(200).json(awards);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch awards", error: error.message });
  }
};
exports.postAwards = async (req, res) => {
  try {
    //Accept query params
    const { award_year, award_title, award_desc } = req.body;
    const newProduct = await Award.create({
      award_year,
      award_title,
      award_desc,
      award_pictures: [],
    });
    // Generate a unique folder name using the product ID
    const folderName = `${process.env.CLOUDINARY_DB}/award_${newProduct.award_id}`;

    // Upload pictures to Cloudinary
    const uploadPromises = req.body.pictures?.map((base64Data) => {
      return cloudinary.uploader.upload(base64Data, {
        folder: folderName, // Specify the folder for uploaded images
      });
    });

    const uploadedImages = await Promise.all(uploadPromises);

    // Update the product with the uploaded images
    await newProduct.update({ award_pictures: uploadedImages });
    res.status(201).json({ message: "Award Created Successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create product", error: error.message });
  }
};
exports.updateAwards = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Find the existing product
    const product = await Award.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Award not found" });
    }

    // Generate the folder name based on the product ID
    const folderName = `${process.env.CLOUDINARY_DB_DEV}/award_${id}`;

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
    await Award.update(updatedData);

    res.status(200).json({ message: "Award updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update Award", error: error.message });
  }
};
// Delete a product
exports.deleteAwards = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Award.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Extract the pictures array from the product
    const { award_pictures } = product;
    // Extract the folder name from the first picture URL (assuming they all belong to the same folder)
    const folderName = award_pictures[0].folder;
    // Create a list of promises to delete each image from Cloudinary
    const deletePromises = award_pictures.map((picture) => {
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

    res.status(200).json({ message: "Award deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete Award", error: error.message });
  }
};
