// controllers/userController.js

const cloudinary = require("../../utils/cloudinary");
exports.getHero = async (req, res) => {
  try {
    const folderName = `${process.env.CLOUDINARY_DB}/Hero`;

    // Fetch all images from the specified folder in Cloudinary, sorted by oldest first
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: folderName,
      max_results: 500, // Adjust as needed
      direction: "asc", // Fetch images in ascending order (oldest first)
    });

    // Format the fetched images to include transformed 'secure_url'
    let formattedImages = result?.resources?.map((image) => {
      return {
        public_id: image?.public_id,
        url: cloudinary.url(image?.public_id, {
          transformation: [
            { width: 800, height: 600, crop: "limit", quality: "auto" },
            { fetch_format: "webp" }, // Convert to WebP format
          ],
        }),
        // Apply transformations for WebP format, compression, and optimization
        secure_url: cloudinary.url(image?.public_id, {
          transformation: [
            { width: 800, height: 600, crop: "limit", quality: "auto" },
            { fetch_format: "webp" }, // Convert to WebP format
          ],
        }),
      };
    });
    // Sort images by 'created_at' in ascending order (oldest first)
    const sortedImages = result.resources.sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );

    // Format the fetched and sorted images
    formattedImages = sortedImages.map((image) => {
      return {
        public_id: image.public_id,
        created_at: image.created_at,
        url: cloudinary.url(image.public_id, {
          transformation: [
            { width: 800, height: 600, crop: "limit", quality: "auto" },
            { fetch_format: "webp" }, // Convert to WebP format
          ],
        }),
        secure_url: cloudinary.url(image.public_id, {
          transformation: [
            { width: 800, height: 600, crop: "limit", quality: "auto" },
            { fetch_format: "webp" },
          ],
        }),
      };
    });
    res.status(200).json(formattedImages);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch Images", error: error.message });
  }
};

exports.updateHero = async (req, res) => {
  try {
    const { pictures } = req.body;

    const folderName = `${process.env.CLOUDINARY_DB}/Hero`;
    // Upload pictures to Cloudinary
    const uploadPromises = pictures?.map((base64Data) => {
      return cloudinary.uploader.upload(base64Data, {
        folder: folderName, // Specify the folder for uploaded images
      });
    });

    await Promise.all(uploadPromises);
    res.status(201).json({ message: "Image Pushed Successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to Upload Images", error: error.message });
  }
};
// Delete an Image
exports.deleteHero = async (req, res) => {
  try {
    // Extract the public_id from the request parameters
    const publicId = req.params.public_id;

    // Delete the image from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    // Check if the deletion was successful
    if (result.result === "ok") {
      res.status(200).json({ message: "Image Deleted Successfully" });
    } else {
      res.status(400).json({ message: "Failed to delete Image" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete Image", error: error.message });
  }
};
